/**
 * @fileoverview js Gallery of websites to be labeled.
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */



/**
 * Manages a gallery with websites to be labeled.
 * The items can be a simple URL, a thumbnail for each website or a visual representation for a
 * group of websites, such as a word cloud.
 * Interaction is possible through click on options YES, NO and INSPECT, that triggers an external
 * action. Current labels for YES/NO can be accessed through getItems().
 *
 * @param parentContainerId ID for gallery parent div element.
 */
var PagesGallery = function(parentContainerId) {
  var gallery = this;
  this.parentContainerId = parentContainerId;
  this.MOUSE_ANCHORED_PREVIEW = false;
  this.PREVIEW_ANCHOR_TOP = 400;

  // Items in gallery.
  this.items = [];

  // Registers buttons for all positive/all negative.
  d3.selectAll('#pages_items_all_positive')
    .on('click', function() {
      gallery.setAllPositive();
    });
  d3.selectAll('#pages_items_all_negative')
    .on('click', function() {
      gallery.setAllNegative();
    });
  d3.selectAll('#pages_items_all_neutral')
    .on('click', function() {
      gallery.setAllNeutral();
    });
  this.update();
};


/**
 * Returns list of items in the gallery.
 */
PagesGallery.prototype.getItems = function() {
  return this.items;  
};


/**
 * Clears gallery.
 */
PagesGallery.prototype.clear = function() {
  this.items = [];
  this.update();
};


/**
 * Adds items to gallery.
 */
PagesGallery.prototype.addItems = function(items) {
  this.items = this.items.concat(items);
  this.update();
};


PagesGallery.prototype.setItems = function(items){
  this.items = items;
  this.update();
}


/**
 * Sets a callback to test whether a tag is removable.
 */
PagesGallery.prototype.setCbIsTagRemovable = function(cb) {
  this.cbIsTagRemovable = cb;
};


/**
 * Sets a callback to get all existing tags that can be applied to a page.
 */
PagesGallery.prototype.setCbGetExistingTags = function(cb) {
  this.cbGetExistingTags = cb;
};

/**
 * Updates gallery.
 */
PagesGallery.prototype.update = function() {
  var gallery = this;
  var items = d3.select(this.parentContainerId)
    .selectAll('.item').data(this.items, function(item, i) {
      return item.url + '-' + i;
  });

  // New items.
  var newItems = items
    .enter()
      .append('div')
      .classed('well', true)
      .classed('noselect', true)
      .classed('item', true)
      .on('dblclick', function(item, i) {
        var elem = d3.select(this);
        elem.classed('dblclicked', !elem.classed('dblclicked'));
        gallery.onItemDoubleClick(item, i);
      })
      .on('click', function(item, i) {
        var isShiftKeyPressed = d3.event.shiftKey;
        if (!isShiftKeyPressed) {
          var elem = d3.select(this);

          if (elem.classed('positive')) {
            elem.classed('positive', false);
            elem.classed('negative', true);
            item.label = 'negative';
          } else if (elem.classed('negative')) {
            elem.classed('negative', false);
            item.label = undefined;
          } else {
            elem.classed('positive', true);
            item.label = 'positive';
          }
        }

        var anchorPos = (gallery.MOUSE_ANCHORED_PREVIEW) ? 
          [d3.event.x, d3.event.y] : [window.innerWidth / 2, gallery.PREVIEW_ANCHOR_TOP];
        gallery.onItemClick(item, i, d3.event.shiftKey, anchorPos);
      })
      .on('mouseover', function(item, i) {
        Utils.showTooltip();
      })
      .on('mousemove', function(item, i) {
        Utils.updateTooltip(item.url);
      })
      .on('mouseout', function(item, i) {
        Utils.hideTooltip();
      });
  newItems
    .append('div')
    .attr('id', function(item, i) {
      return 'item_info-' + i;
    })
    .attr('url', function(item, i) {
      return item.url;
    })
    .classed('item_info', true)
    .classed('noselect', true);
  // Remove missing items.
  items.exit().remove();

  // Updates existing items.
  items
    .classed('positive', function(item, i) {
      return item.label === 'positive';
    })
    .classed('negative', function(item, i) {
      return item.label === 'negative';
    });
  newItems.selectAll('div.item_info')
    .html(function(item, i) {
      return '<div class="snippet"></div>' + gallery.getItemInfo(item, i);
    });

  var existingTags = this.cbGetExistingTags ? this.cbGetExistingTags() : [];
    items.each(function(item, i) {
    // Creates tags.
    var tagsElem = d3.select(this).select('.tags').selectAll('span.tag')
      .data(item.tags, function(tag, i) { return tag; });
    tagsElem
      .enter()
      .append('span')
      .classed('tag', true);
    tagsElem.exit().remove();

    // Remove button.
    var w = 12;
    var actionType = 'Remove';
    var button = tagsElem.selectAll('img').data(function(tag, i) { return [tag]; });
    button.enter().append('img')
      .attr('actionType', actionType)
      .attr('src', 'img/remove.png')
      .attr('width', w + 'px')
      .classed('clickable', function(tag, i) {
        var isRemovable = gallery.cbIsTagRemovable(tag);
        return isRemovable;
      })
      .classed('not-clickable', function(tag, i) {
        var isRemovable = gallery.cbIsTagRemovable(tag);
        return !isRemovable;
      })
      .on('click', function(tag, i) {
        var isRemovable = gallery.cbIsTagRemovable(tag);
          if (isRemovable) {
            BokehPlots.updateTags([item],tag, actionType);
        }
      })
      .on('mouseover', function(tag, i) {
        var isRemovable = gallery.cbIsTagRemovable(tag);
        if (isRemovable) {
          d3.select(this).classed('focus', true);
        }
      })
      .on('mouseout', function(tag, i) {
        var isRemovable = gallery.cbIsTagRemovable(tag);
        if (isRemovable) {
          d3.select(this).classed('focus', false);
        }
      });

    // Tag text.
    var text = tagsElem.selectAll('span').data(function(tag, i) { return [tag]; });
    text.enter().append('span')
      .classed('not-clickable', true)
      .html(function(tag, i) {
        return tag;
      });

    // Creates input box to add custom tag
    var customTag = d3.select(this).select('.customTag');
	customTag.on('change', function() {
	    var defaultOption = 'Custom tag...';
	    var tag = d3.select(this).node().value;
	    if (tag != defaultOption) {
		// Adds tag to item.
		BokehPlots.updateTags([item],tag, "Apply");
		d3.select(this).node().value = defaultOption;
	    }
	});
		     
    // Creates/updates select box to apply new tag.
    var selectBox = d3.select(this).select('.selectTag');
    var defaultOption = 'Add tag...';
    selectBox.on('change', function() {
      var tag = d3.select(this).node().value;
      if (tag != defaultOption) {
        if($(this).siblings()[0]){
          if(tag != "Neutral"){
            $(this).siblings().children('img').attr("class", "clickable");
            $(this).siblings().children('.not-clickable').text(tag);
          } else {
            $(this).siblings().children('img').attr("class", "not-clickable");
            $(this).siblings().children('.not-clickable').text("");
          }
        }
        // Adds tag to item.
	BokehPlots.updateTags([item],tag, "Apply");
      }
    });

    // Removes all options.
    selectBox.selectAll('option').remove(); 

    // List shows only new tags.
    var itemTags = {};
    item.tags.forEach(function(tag) {
      itemTags[tag] = true;
    });
    var newTags = existingTags.filter(function(tag) {
      return !(tag in itemTags);
    });
    var tagList = [defaultOption].concat(newTags);

    var options = selectBox.selectAll('option').data(tagList, function(tag) { return tag; });
    options.enter().append('option');
    options
      .attr('value', function(d) { return d; })
      .text(function(d) { return d; });
  });
  // Creates snippet with urlive plugin.
  newItems.each(function(item, i) {
    var elemId = '#item_info-' + i;
    var containerId = elemId + ' .snippet';
    $(elemId).urlive({
        container: containerId,
        url: item.url,
    });
  });

};


/**
 * Builds html content with info about an item in the gallery,
 * such as url, tags and container for snippet.
 */
PagesGallery.prototype.getItemInfo = function(item, i) {
  return '<span class="item-url"><a target="_blank" href="'+item.url+'"">'+item.url+'</a></span>'
    + '<span class="tags"><input type="text"  placeholder="Custom tag... " class="customTag"><select class="selectTag"></select></span>';
};


/**
 * Handles click in an item.
 */
PagesGallery.prototype.onItemClick = function(item, i, isShiftKeyPressed, anchorPos) {
  if (isShiftKeyPressed) {
    var url = item.url;
    if (url.indexOf('http') !== 0) {
      url = 'http://' + url;
    }
    this.setPagePreviewEnabled(true, url, anchorPos);
  }
};


/**
 * Handles double click in an item.
 */
PagesGallery.prototype.onItemDoubleClick = function(item, i) {
  // TODO.
  console.log('itemDoubleClicked ' + i);
};


/**
 * Sets visibility of url preview.
 */
PagesGallery.prototype.setPagePreviewEnabled = function(enabled, url, anchorPos) {
  var gallery = this;
  if (enabled) {
    var transitionTimeInMili = 2000;
    d3.select('#urlBgMask')
      .style('display', 'block')
      .style('opacity', 0)
      .transition(transitionTimeInMili)
      .style('opacity', 0.9);
    d3.select('#mask')
      .style('display', 'block')
      .style('cursor', 'pointer')
      .on('click', function() {
        var isShiftKeyPressed = d3.event.shiftKey;
        if (isShiftKeyPressed) {
          Utils.openInNewTab(url);
        } else {
          gallery.setPagePreviewEnabled(false);
        }
      });

    // TODO: should keep track of width defined in css.
    var iframeWidth = 800;
    //var top = anchorPos[1];
    var top = '50';
    var left = anchorPos[0] - iframeWidth / 2;
    left = Math.max(0, Math.min(left, window.innerWidth - iframeWidth - 20));

    d3.selectAll('iframe#urlPreview').data(['urlPreview'])
        .enter()
      .append('iframe')
      .attr('id', 'urlPreview')
      .attr('src', url)
      .style('opacity', 0)
      .style('top', top + 'px')
      .style('left', left + 'px')
      .transition(transitionTimeInMili)
      .style('opacity', 1);
    d3.select('body')
      .on('keydown', function() {
        if (!d3.event.shiftKey) {
          gallery.setPagePreviewEnabled(false);
        }
      });
  } else {
    d3.select('#urlBgMask')
      .style('display', 'none');
    d3.select('#mask')
      .style('display', 'none')
      .style('cursor', 'wait');
    d3.selectAll('#urlPreview')
      .remove();
    d3.select('body')
      .on('keydown', null);
  }
};
