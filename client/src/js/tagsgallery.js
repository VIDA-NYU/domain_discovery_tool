/**
 * @fileoverview js Gallery of tags.
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */



/**
 * Manages a list of tags used for pages (some predefined and some defined by user).
 * Interaction is possible through click on "tag selected" and "untag selected".
 *
 * @param parentContainerId ID for gallery parent div element.
 * @param predefinedTags list of predefined tags, with tag name.
 * @param tagsLogic mechanism to handle tags logic: some tags are not applicable, and some tags when
 *        applied should trigger the removal of other tags (e.g. when Yes is applied, No is
 *        removed).
 *        Must be in the format:
 *         {
 *           'TagName': {
 *             applicable: true/false,
 *             removable: true/false,
 *             negate: ['Tag1', 'Tag2'],
 *           },
 *         }
 */
var TagsGallery = function(parentContainerId, predefinedTags, tagsLogic) {
  this.parentContainerId = parentContainerId;

  // Predefined items in gallery.
  this.predefinedItems = predefinedTags;

  // User-defined items in gallery.
  this.userItems = [];

  // Handles tags logic.
  this.tagsLogic = tagsLogic;

  this.update();
};


/**
 * Clears list of items.
 */
TagsGallery.prototype.clear = function(lazyUpdate) {
  this.userItems = [];

  if (!lazyUpdate) {
    this.update();
  }
};


/**
 * Adds item to gallery.
 */
TagsGallery.prototype.addItem = function(tag, lazyUpdate) {
    if(this.predefinedItems.indexOf(tag) < 0) {
	if(this.userItems.indexOf(tag) < 0){
	    this.userItems.push(tag);
	    this.tagsLogic[tag] = {'applicable': true, 'removable': true, negate: []};
	    if(this.tagsLogic["Neutral"]["negate"].indexOf(tag) < 0)
		this.tagsLogic["Neutral"]["negate"].push(tag); 
	    if (!lazyUpdate) {
		this.update();
	    }
	}
    }
};


/**
 * Removes item from gallery.
 */
TagsGallery.prototype.removeItem = function(tag) {
    var index = this.userItems.indexOf(tag);
    if( index >= 0 && this.predefinedItems.indexOf(tag) < 0){
	this.userItems.splice(index, 1);
    }
}

/**
 * Get items from gallery.
 */
TagsGallery.prototype.getCustomTags = function() {
    return this.userItems;
}

/**
 * Sets mechanism to handle tags logic: some tags are not applicable, and some tags when applied
 * should trigger the removal of other tags (e.g. when Yes is applied, No is removed).
 * Logic must be in the format:
 *  {
 *    'TagName': {
 *      applicable: true/false,
 *      removable: true/false,
 *      negate: ['Tag1', 'Tag2'],
 *    },
 *  }
 */
TagsGallery.prototype.setTagsLogic = function(tagsLogic) {
  // Handles tags logic.
  this.tagsLogic = tagsLogic;
};


/**
 * Updates gallery.
 */
TagsGallery.prototype.update = function() {
  var gallery = this;
  this.items = this.predefinedItems.concat(this.userItems);

  var gallery = this;
  var items = d3.select(this.parentContainerId)
    .selectAll('.item').data(this.items, function(item, i) {
      return item + '-' + i;
  });

  // Configures actions on images.
  items.each(function(item, i) {
    // Only clickable tags.
    var isApplicable = gallery.isTagApplicable(item);
    var isRemovable = gallery.isTagRemovable(item);

    if (isApplicable || isRemovable) {
      var itemElm = d3.select(this);
      itemElm.selectAll('img').each(function() {
        var img = d3.select(this);
        var actionType = img.attr('actionType');
        if ((isApplicable && actionType == 'Apply') 
            || (isRemovable && actionType == 'Remove')) {
          img
            .on('mouseover', function() {
              Utils.showTooltip();
            })
            .on('mousemove', function() {
              Utils.updateTooltip(actionType + ' tag "' + item + '"');
            })
            .on('mouseout', function() {
              Utils.hideTooltip();
            })
            .on('click', function() {
              gallery.onItemActionClick(item, i, actionType);
              event.stopPropagation();
            });
        }
      });
    }
  });
};


/**
 * Returns whether a tag is applicable.
 */
TagsGallery.prototype.isTagApplicable = function(tag) {
  return tag in this.tagsLogic && this.tagsLogic[tag]['applicable'];
};


/**
 * Returns whether a tag is removable.
 */
TagsGallery.prototype.isTagRemovable = function(tag) {
  return tag in this.tagsLogic && this.tagsLogic[tag]['removable'];
};


/**
 * Builds html content with info about an item in the gallery.
 */
TagsGallery.prototype.getItemInfo = function(item, i) {
  return item;
};


/**
 * Builds html content with buttons for labeling relevancy an item in the gallery,
 * such as Yes, No, Maybe.
 */
TagsGallery.prototype.getItemButtons = function(item, i) {
  var w = 12;
  var a = this.isTagApplicable(item) ? 'clickable' : 'not-clickable';
  var r = this.isTagRemovable(item) ? 'clickable' : 'not-clickable';
  return '<img actionType="Remove" src="img/remove.png" width="' + w + 'px" class="' + r + '">'
    + '<img actionType="Apply" src="img/apply.png" width="' + w + 'px" class="' + a + '">';
};


/**
 * Handles click in an item.
 */
TagsGallery.prototype.onItemClick = function(item, i) {
  __sig__.emit(__sig__.tag_clicked, item);
};


/**
 * Handles item focus.
 */
TagsGallery.prototype.onItemFocus = function(item, i, onFocus) {
  __sig__.emit(__sig__.tag_focus, item, onFocus);
};


/**
 * Handles click in an item.
 */
TagsGallery.prototype.onItemActionClick = function(item, i, actionType) {
  this.applyOrRemoveTag(item, actionType);
};


/**
 * Applies or removes tag.
 */
TagsGallery.prototype.applyOrRemoveTag = function(tag, actionType, opt_pages, refresh_plot) {
  // Handles tags logic.
  if (tag in this.tagsLogic) {
    var logicForTag = this.tagsLogic[tag];

    if (actionType == 'Apply') {
      // Removes tags in negate.
      for (var i in logicForTag.negate) {
        var negateTag = logicForTag.negate[i];
        __sig__.emit(__sig__.tag_action_clicked, negateTag, 'Remove', opt_pages, refresh_plot);
      }
      if (logicForTag.applicable && !logicForTag.isVirtual) {
        __sig__.emit(__sig__.tag_action_clicked, tag, actionType, opt_pages, refresh_plot);
      }
    } else {
      // Removes tag when removable.
      if (logicForTag.removable) {
        __sig__.emit(__sig__.tag_action_clicked, tag, actionType, opt_pages, refresh_plot);
      }
    }
  } else {
    __sig__.emit(__sig__.tag_action_clicked, tag, actionType, opt_pages, refresh_plot);
  }
};



/**
 * Returns applicable tags.
 */
TagsGallery.prototype.getApplicableTags = function() {
  var gallery = this;
  return this.items.filter(function(tag) {
    return gallery.isTagApplicable(tag);
  });
};
