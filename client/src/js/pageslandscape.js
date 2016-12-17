/**
 * @fileoverview js Gallery of frequent terms.
 *
 * Manages a 2D map with pages projected based on their content similarity. Positive pages and
 * negatives pages are show, and user brushing triggers events that clients can use to show detail
 * about selected pages.
 *
 * @param parentContainerId ID for gallery parent div element.
 */



/**
 * Manages a 2D map with pages projected based on their content similarity. Positive pages and
 * negatives pages are show, and user brushing triggers events that clients can use to show detail
 * about selected pages.
 *
 * @param parentContainerId ID for gallery parent div element.
 */
var PagesLandscape = function(parentContainerId) {
  this.parentContainerId = parentContainerId;
  this.pagesData = [];
  this.zoomScale = 1.0;
  this.zoom  = false;
  this.circlesRadius = 5;

  // Registers buttons for reranking and extracting terms.
  d3.selectAll('#pages_landscape_rank')
    .on('click', function() {
      __sig__.emit(__sig__.pages_do_ranking);
    });
  d3.selectAll('#pages_landscape_extract_terms')
    .on('click', function() {
      __sig__.emit(__sig__.pages_extract_terms);
    });
  // this.update();
};


/**
 * Gets pages data shown in the landscape.
 */
PagesLandscape.prototype.getPagesData = function() {
  return this.pagesData;
};


/**
 * Sets pages data to show in the landscape.
 */
PagesLandscape.prototype.setPagesData = function(pagesData) {
  this.pagesData = pagesData;
  // this.update();
  // Deselects items when pages data changed.
  // this.lasso.clearLasso();
};


/**
 *
 */
PagesLandscape.prototype.update = function() {
  var landscape = this;
  var data = this.pagesData;
  
  var padding = 20;

  // Dimensions.
  var margin = {top: padding, right: padding, bottom: padding, left: padding},
      containerWidth = $(this.parentContainerId).width(),
      containerHeight = $(this.parentContainerId).height(),
      width = containerWidth - margin.left - margin.right,
      height = containerHeight - margin.top - margin.bottom;

  // Linear scales for axes (centralizes to zero if only one value per dimension).
  var xExtent = d3.extent(data, function(point, i) { return point.x; });
  if (xExtent[0] == xExtent[1]) {
    xExtent[0] -= 1;
    xExtent[1] += 1;
  }

  var yExtent = d3.extent(data, function(point, i) { return point.y; });
  if (yExtent[0] == yExtent[1]) {
    yExtent[0] -= 1;
    yExtent[1] += 1;
  }

  var xScale = d3.scale.linear().domain(xExtent).range([0, width]);
  var yScale = d3.scale.linear().domain(yExtent).range([height, 0]);
  
  // SVG is for entire panel.
  var svg = d3.select(this.parentContainerId).selectAll('svg').data(['svg']);
  svg.enter().append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight);

  // Grid.
  /*
  var numberOfTicks = 5;

  var yAxisGrid = d3.svg.axis().scale(yScale)
      .ticks(numberOfTicks) 
      .tickSize(containerWidth, 0)
      .tickFormat('')
      .orient('right');

  var xAxisGrid = d3.svg.axis().scale(xScale)
      .ticks(numberOfTicks) 
      .tickSize(-containerHeight, 0)
      .tickFormat('')
      .orient('top');

  svg.append('g')
      .classed('y', true)
      .classed('axis', true)
      .call(yAxisGrid);

  svg.append('g')
      .classed('x', true)
      .classed('axis', true)
      .call(xAxisGrid);
  */

  var useZoom = true;
  if (useZoom) {
    if (!this.zoom) {
      this.zoomed = function() {
        // Zoom available only when shift is clicked.
        if (Utils.isKeyPressed(90)) {
          var t = d3.event.translate;
          //t = [0, 0];
          svg.attr('transform', 'translate(' + t + ')scale(' + d3.event.scale + ')');
          landscape.zoomScale = d3.event.scale;
          landscape.circles
              .attr('r', landscape.circlesRadius / landscape.zoomScale);
        }
      };
      this.zoom = d3.behavior.zoom()
	  .translate([0,0])
	  .scale(2)
          .scaleExtent([1, 10])
          .on('zoom', landscape.zoomed);
    }
  } else {
    this.zoom = function() {};
  }

  // Group is for inner panel (to guarantee margin and avoid cutting circles.
  var svg = svg.selectAll('g').data(['svg.g']);
  svg.enter().append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .call(landscape.zoom);

  // Creates circles.
  // NOTE: page must be the only class here, so that the tags are added as classes later. So do not
  // use .classed('page', true) as it would not remove classes when a tag is removed.
  this.circles = svg.selectAll('circle.page').data(data);
  this.circles.enter().append('circle')
      .attr('r', 0)
      .on('click', function(point, i) {
        // TODO trigger event for click on element.
        console.log('click on page [' + i + ']: ' + point.url);
      })
      .on('mouseover', function(point, i) {
        Utils.showTooltip();
      })
      .on('mousemove', function(point, i) {
        Utils.updateTooltip(point.url);
      })
      .on('mouseout', function(point, i) {
        Utils.hideTooltip();
      });
  // Applies tags as classes.
  this.circles.each(function(point, i) {
      var elm = d3.select(this);
      var tags = point['tags'];

      // Put here any class that need to be kept.
      var selected = elm.classed('selected');

      // NOTE: page must be the only class here, so that the tags are added as classes later. So do not
      // use .classed('page', true) as it would not remove classes when a tag is removed.
      elm
          .attr('class', 'page')
          .classed('selected', selected);

      for (var ti in tags) {
        elm.classed(tags[ti], true);
      };
      // TODO(cesar): Will we recommend a classification based on rank?
      //elm.style('stroke-opacity', function(point, i) {
      //  if (point.label == 'positive_recommendation' || point.label == 'negative_recommendation') {
      //    return point.opacity;
      //  } else {
      //    return null;
      //  }
      //})
  });
  this.circles
      .transition(500)
      .attr('cx', function(point, i) {
        return xScale(point.x);
      })
      .attr('cy', function(point, i) {
        return yScale(point.y);
      })
      .attr('r', landscape.circlesRadius / landscape.zoomScale);
  this.circles.exit().remove();

  // Sets up lasso.
  if (!this.lasso) {
    var landscape = this;

    // Creates the area where the lasso event can be triggered.
    var lassoRect = svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('opacity', 0);

    this.lasso = d3.lasso()
      .closePathDistance(200) // max distance for the lasso loop to be closed
      .closePathSelect(true) // can items be selected by closing the path?
      .hoverSelect(true) // can items by selected by hovering over them?
      .area(lassoRect) // area where the lasso can be started
      .on('start', function(l) { return landscape.lassoStart.call(landscape, l); })
      .on('draw', function(l) { return landscape.lassoDraw.call(landscape, l); })
      .on('end', function(l) { return landscape.lassoEnd.call(landscape, l); })
      .isEnabled(function(l) { return !Utils.isKeyPressed(90); });

    svg.call(this.lasso);
  }
  this.lasso.items(svg.selectAll('circle.page'));

  // Updates visibility of buttons according to number of items in the gallery.
  d3.selectAll('.pages_interface')
    .style('visibility', (landscape.pagesData.length == 0) ? 'hidden' : null);
};


/**
 * Responds to changes in the page labels.
 *
 */
PagesLandscape.prototype.onPageLabelsChanged = function() {
  this.update();
};


/**
 * Returns selected items.
 */
PagesLandscape.prototype.getSelectedItems = function() {
  var items = this.pagesData;
  var indexOfSelectedItems = this.getSelectedItemsIndex();
  return indexOfSelectedItems.map(function(index) {
    return items[index];
  });
};


/**
 * Returns index of selected items.
 */
PagesLandscape.prototype.getSelectedItemsIndex = function() {
  // Retrieves selected pages.
  var lassoItems = this.lasso.items()[0];
  var indexOfSelectedItems = d3.range(lassoItems.length).filter(function(index) {
    return d3.select(lassoItems[index]).classed('selected');
  });
  return indexOfSelectedItems;
};


/**
 * Given array of pages, creates a random position in the plane for each page to simulate a
 * 2D projection. 
 *
 */
PagesLandscape.createRandomPositions = function(pagesData) {
  // Creates random x, y positions for each page.
  return pagesData.map(function(d, i) {
    d['x'] = Math.random();
    d['y'] = Math.random();
    return d;
  });
};

// Lasso functions to execute while lassoing.
PagesLandscape.prototype.lassoStart = function() {
  this.lasso.items()
    .classed('selected', false);
};

PagesLandscape.prototype.lassoDraw = function() {
  this.lasso.items()
    .classed('selected', function(d) {
      return d.possible;
    });
};

PagesLandscape.prototype.lassoEnd = function() {
  var indexOfSelectedItems = this.getSelectedItemsIndex();
  __sig__.emit(__sig__.brushed_pages_changed, indexOfSelectedItems);
};
