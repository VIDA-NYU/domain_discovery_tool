/**
 * @fileoverview Manages a set of snippets for a frequent term appearing in URLs.
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */



/**
 * Manages a set of snippets for a frequent term appearing in URLs.
 *
 * @param parentContainerId ID for div element for snippets viewer.
 */
var SnippetsViewer = function(parentContainerId) {
  this.parentContainerId = parentContainerId;

  // Items in viewer.
  this.items = [];
};


/**
 * Clears all items in the viewer.
 */
SnippetsViewer.prototype.clear = function(lazyUpdate) {
  this.items = [];
  if (!lazyUpdate) {
    this.update();
  }
};


/**
 * Adds item to viewer: {term: xyz, snippet: abcd xyz nhonhonho}
 */
SnippetsViewer.prototype.addItem = function(snippet, lazyUpdate) {
  this.items.push(snippet);
  if (!lazyUpdate) {
    this.update();
  }
};


/**
 * Adds multiple items to viewer.
 */
SnippetsViewer.prototype.addItems = function(snippets, lazyUpdate) {
  this.items = this.items.concat(snippets);
  if (!lazyUpdate) {
    this.update();
  }
};


/**
 * Updates viewer.
 */
SnippetsViewer.prototype.update = function() {
  var viewer = this;
  var items = d3.select(this.parentContainerId)
    .selectAll('.item').data(this.items, function(item, i) {
      return item.term + '-' + i + '-' + item.snippet.substring(0, 30);
  });

  // New items.
  items.enter()
    .append('div')
    .classed('noselect', true)
    .classed('item', true)
    .on('click', function(item, i) {
      var elem = d3.select(this);
      elem.classed('dblclicked', !elem.classed('dblclicked'));
      viewer.onItemDoubleClick(item, i);
      window.open(item.url, '_blank');
    });

  // Removes missing items.
  items.exit().remove();

  // Updates existing items.
  items
    .html(function(item, i) {
      return viewer.getItemInfo(item, i);
    });
  items.each(function(item, i) {
    var tags = item.term['tags'];
    var isPositive = tags.indexOf('Positive') != -1;
    var isNegative = tags.indexOf('Negative') != -1;
    d3.select(this).selectAll('em')
      .classed('Positive', isPositive)
      .classed('Negative', isNegative);
  });
};


/**
 * Builds html content with info about an item in the viewer.
 */
SnippetsViewer.prototype.getItemInfo = function(item, i) {
  // TODO Add more details about term.
  return '<p>' + item.snippet + '</p>';
};


/**
 * Builds html content with buttons for labeling relevancy an item in the viewer,
 * such as Yes, No, Maybe.
 */
SnippetsViewer.prototype.getItemLabels = function(item, i) {
  // TODO.
  return '<p>Yes No Maybe</p>';
};


/**
 * Handles click in an item.
 */
SnippetsViewer.prototype.onItemClick = function(item, i) {
  // TODO.
  console.log('itemClicked ' + i);
};


/**
 * Handles click in an item.
 */
SnippetsViewer.prototype.onItemDoubleClick = function(item, i) {
  // TODO.
  console.log('itemDoubleClicked ' + i);
};
