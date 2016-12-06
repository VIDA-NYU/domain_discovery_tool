/**
 * @fileoverview js List with salient terms in crawled pages.
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */

/**
 * Manages a list of terms present in crawled pages, including positive/negative/not-tagged.
 * Also shows frequency of words in positive/negative pages.
 *
 * @param containerId ID for parent element.
 */
var Wordlist = function(containerId, maxWordTextWidth, itemClickDisable) {
    this.containerId = containerId;  
    this.entries = [];
    this.setMaxPosNegFreq(15, 15);
    this.update();
    this.maxWordTextWidth = null;
    if(maxWordTextWidth != undefined || maxWordTextWidth != null){
	this.maxWordTextWidth = maxWordTextWidth;
    }
    this.itemClickDisable = true;
    if(itemClickDisable != undefined)
	this.itemClickDisable = itemClickDisable;
};

Wordlist.prototype.setMaxPosNegFreq = function(maxPosFreq, maxNegFreq) {
    this.maxPosFreq = maxPosFreq;
    this.maxNegFreq = maxNegFreq;
    this.update();
};

Wordlist.prototype.addEntries = function(entries) {
    var duplicate = false;
    $(this.entries).each(function(index, value ){
	if ($(entries).get(0)["word"] === value["word"]){
	    if ($(entries).get(0)["tags"].indexOf("Custom") > -1)
		value["tags"] = $(entries).get(0)["tags"];
	    duplicate = true;
	}
    });
    if (duplicate === false)
	this.setEntries(entries.concat(this.entries));
    else this.setEntries(this.entries);
};

/**
 * E.gs. of entry expected format:
 * [{ 'word': 'posTerm', 'posFreq': 40, 'negFreq': 30, 'tags': ['Negative']},
 *  { 'word': 'negTerm', 'posFreq': 20, 'negFreq': 30, 'tags': ['Positive']},
 *  { 'word': 'neutralTerm', 'posFreq': 10, 'negFreq': 40, 'tags': []},]
 */
Wordlist.prototype.setEntries = function(entries) {
    this.entries = entries;
    this.update();
};


Wordlist.prototype.update = function() {
    var wordlist = this;
    var rowHeight = 16;
    var barHeight = 6;
    var svgMargin = {'top': 5, 'left': 5, 'right': 5, 'bottom': 5};

    var word_length = [];
    $(this.entries).each(function( index, value ){
    	word_length.push(value["word"].length);
    });

    if(this.maxWordTextWidth === undefined || this.maxWordTextWidth === null) {
      this.maxWordTextWidth = Math.max.apply(Math, word_length) * 7;
    }else{
      if((Math.max.apply(Math, word_length) * 7) > this.maxWordTextWidth){
        this.maxWordTextWidth = Math.max.apply(Math, word_length) * 7;
      }
    }

    var containerWidth = $('#' + wordlist.containerId).width();
    var width = containerWidth - svgMargin.left - svgMargin.right;
    var maxBarWidth = 30;
    
    // Computes svg height.
    var svgHeight = svgMargin.top + svgMargin.bottom + rowHeight * this.entries.length;

    var transitionDuration = 500;
    
    var svg = d3.select('#' + this.containerId).selectAll('svg').data(['svg']);
    svg.enter().append('svg');
    svg.attr('height', svgHeight);
    svg = svg.selectAll('g.container').data(['g.container']);
    svg.enter().append('g')
        .classed('container', true)
        .attr('transform', 'translate(' + svgMargin.left + ', ' + svgMargin.top + ')');
    
    // Rows for entries.
    var rows = svg.selectAll('g.row').data(wordlist.entries, function(d, i){
        return i + '-' + d['word'];
    });
    rows.exit().remove();
    rows.enter().append('g')
        .classed('row', true)
        .attr('transform', function(d, i) {
            return 'translate(0, '
            + (i * rowHeight) + ')'; 
        });

    // Left bars (positive frequency bars).
    var posBars = rows.selectAll('g.bar.pos').data(function(d) { return [d]; });
    posBars.enter().append('g')
        .classed('bar', true)
        .classed('pos', true)
        .attr('transform', 'translate(' + (width - (maxBarWidth)) + ', 0)')
        .append('rect')
        .classed('background', true)
        .attr('y', 0.5 * (rowHeight - barHeight))
        .attr('width', maxBarWidth)
        .attr('height', barHeight);
    

    // Container for word.
    var words = rows.selectAll('g.words').data(function(d) { return [d]; });
    words
      .enter().append('g')
        .classed('words', true)
        .attr('transform', 'translate(30,' + (0.5 * rowHeight) + ')')
        .append('text')
        .classed('noselect', true)
        .text(function(d){return d['word'];})
        .on('click', function(d, i){
          wordlist.onItemClick(d, i, d3.event.shiftKey);
        })
        .on('mouseover', function(d, i) {
          if (!wordlist.currentWord){
            wordlist.onItemFocus(d, i, d3.event.shiftKey, true);
          }
        })
        .on('mouseout', function(d, i) {
          if (!wordlist.currentWord){
            wordlist.onItemFocus(d, i, d3.event.shiftKey, false);
          }
        })

    // Container for word.
    var circles = rows.selectAll('g.custom').data(function(d) { return [d]; });
    circles
        .enter().append('g')
        .classed('custom', true);


    // Term should be classed according to its tags, e.g. Positive/Negative.
    words.each(function(d) {
      var elm = d3.select(this).select('text');
      var tags = d['tags'];
      var isPositive = tags.indexOf('Positive') != -1 || tags.indexOf('Relevant') != -1;
      var isNegative = tags.indexOf('Negative') != -1 || tags.indexOf('Irrelevant') != -1;
      elm
        .classed('Positive', isPositive)
        .classed('Negative', isNegative);
    });
    
   

    var pins = rows.selectAll('g.pins').data(function(d) { return [d]; });
    pins.enter().append('g')
      .classed("pins", true)
      .append('svg:foreignObject')
      .attr("width", 20)
      .attr("height", 20)
      .attr("y", "-2px")
      .attr("x", "10px")
      .append("xhtml:span")
      .attr("class", "control glyphicon glyphicon-pushpin")
      .on('mouseover', function(d, i) {
	    Utils.showTooltip();
      })
      .on('mousemove', function() {
	  Utils.updateTooltip('Pin Term Context');
      })
      .on('mouseout', function() {
	  Utils.hideTooltip();
      })
      .on("click", function(d, i){
        if (wordlist.currentWord == d.word){
          wordlist.currentWord = undefined;
          $(this).removeClass("pinned");
        } else {
          wordlist.currentWord = d.word;
          $(".pins span.pinned").removeClass("pinned");
          $(this).addClass("pinned");
          wordlist.onItemFocus(d, i, d3.event.shiftKey, true);
        }
      })    

    circles.each(function(d) {
	var tags = d['tags'];
	var isCustom = tags.indexOf('Custom') != -1;
	if (isCustom){
	    var container = d3.select(this);
	    container.append('image')
		.attr('xlink:href', '/img/delete.jpg')
		.attr('width', 15)
		.attr('height', 15)
		.attr('transform', 'translate(-5,-4)')
	        .on('click', function(d, i) {
		    wordlist.onDeleteClick(d, i);
		})
		.on('mouseover', function(d, i) {
		    Utils.showTooltip();
		})
		.on('mousemove', function() {
		    Utils.updateTooltip('Delete Term');
		})
		.on('mouseout', function() {
		    Utils.hideTooltip();
		});

	}
    });

    // Right bars (negative frequency bars).
    var negBars = rows.selectAll('g.bar.neg').data(function(d) { return [d]; });
    negBars.enter().append('g')
        .classed('bar', true)
        .classed('neg', true)
        .attr('transform', 'translate(' + (width - (2 * maxBarWidth)) + ', 0)')
      .append('rect')
        .classed('background', true)
        .attr('y', 0.5 * (rowHeight - barHeight))
        .attr('width', maxBarWidth)
        .attr('height', barHeight);
    
    // Scales for left/right bars.
    // TODO Read domain from data.
    var barScale = d3.scale.linear()
        .range([0, maxBarWidth]);
    
    // Adds left bars (aligned to right).

    barScale.domain([0, wordlist.maxPosFreq]);
    posBars.each(function(d, i) {
        var rect = d3.select(this).selectAll('rect.pos').data(['rect']);
        rect.enter().append('rect')
            .classed('pos', true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        // Aligns left bar to right.
        var width = barScale(d['posFreq']);
        rect
            .transition(transitionDuration)
            .attr('x', 0)
            .attr('width', width);
    });
   
    // Adds right bars (aligned to left).
    barScale.domain([0, wordlist.maxNegFreq]);
    negBars.each(function(d, i) {
        var rect = d3.select(this).selectAll('rect.neg').data(['rect']);
        rect.enter().append('rect')
            .classed('neg', true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);

        // Aligns left bar to left.
        var width = barScale(d['negFreq']);
        rect
          .transition(transitionDuration)
          .attr('x', maxBarWidth - width)
          .attr('width', width);
    });
};


/**
 * Handles click in an item.
 */
Wordlist.prototype.onItemClick = function(item, i, isShiftKeyPressed) {
    if (this.itemClickDisable === true)
	__sig__.emit(__sig__.term_toggle, item, isShiftKeyPressed);
};

/**
 * Handles mouse focus on an item.
 */
Wordlist.prototype.onItemFocus = function(item, i, isShiftKeyPressed, onFocus) {
  __sig__.emit(__sig__.term_focus, item['word'], onFocus);
};

Wordlist.prototype.onDeleteClick = function(item, i) {
    __sig__.emit(__sig__.delete_term, item['word']);
    var removeWord = this.entries.indexOf(item);
    this.entries.splice(removeWord,1);
    this.update();
}
