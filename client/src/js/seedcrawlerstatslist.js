/**
 * @fileoverview js Statistics for crawled pages (for seed crawler).
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */



/**
 * Manages a list of statistics of crawled pages, including Relevant/Irrelevant/Neutral
 * pages (for seed crawler).
 *
 * @param containerId ID for parent element.
 */
var Statslist = function(containerId) {
    this.containerId = containerId;
    this.entries = [];
    this.setMaxBarTotal(100);
    this.setOtherTagsTotal(0);
    this.update();
};


Statslist.prototype.setMaxBarTotal = function(maxBarTotal) {
    this.maxBarTotal = maxBarTotal;
    this.update();
};

Statslist.prototype.setOtherTagsTotal = function(otherTagsTotal) {
    this.otherTagsTotal = otherTagsTotal;
    this.update();
};


Statslist.prototype.addEntries = function(entries) {
    this.entries = this.entries.concat(entries);
    this.update();
};


Statslist.prototype.setEntries = function(entries, lazyUpdate) {
    this.entries = entries;
    if (!lazyUpdate) {
      this.update();
    }
};


Statslist.prototype.setMaxStatValue = function(maxStatValue) {
    this.maxStatValue = maxStatValue;
    this.update();
};

Statslist.prototype.update = function() {
    var statslist = this;
    var maxWordTextWidth = 120;
    var rowHeight = 30;
    var barHeight = 20;
    var svgMargin = {'top': 5, 'left': 5, 'right': 5};

    var containerWidth = $('#' + statslist.containerId).width();
    var width = containerWidth - svgMargin.left - svgMargin.right;
    var maxBarWidth = width - maxWordTextWidth;

    var numberFormat = d3.format('0,000');
    var transitionDuration = 500;

    var svg = d3.select('#' + this.containerId).select('svg');
    svg = svg.selectAll('g.rowsContainer').data(['g.rowsContainer']);
    svg.enter().append('g')
        .classed('rowsContainer', true)
        .attr('transform', 'translate(' + svgMargin.left + ', ' + svgMargin.top + ')');

    // Total number of pages.
    statslist.nPagesTotal =
      this.entries.reduce(function(prev, d) { return prev + d['Total']; }, 0) + statslist.otherTagsTotal;

    var titleRow = svg.selectAll('g.titleRow').data(['titleRow']);
    titleRow
        .enter().append('g')
        .classed('titleRow', true);
    var titleText = titleRow.selectAll('text').data(['text']);
    titleText
        .enter().append('text')
        .classed('caption', true)
        .attr('y', 0.5 * rowHeight);
    titleText.text('Total pages: ' + numberFormat(statslist.nPagesTotal));


    // Rows for entries.
    var rows = svg.selectAll('g.row').data(statslist.entries, function(d, i) {
        return i + '-' + d['name'];
    });
    rows.exit().remove();
    rows.enter().append('g')
        .classed('row', true)
        .attr('transform', function(d, i) {
            return 'translate(0, '
            + ((i + 1) * rowHeight) + ')';
        });

    // Container for stats names.
    var names = rows.selectAll('g.names').data(function(d) { return [d]; });
    names
      .enter().append('g')
        .classed('names', true)
        .attr('transform',
              'translate(0,' + (0.5 * rowHeight) + ')')
        .append('text')
        .classed('caption', true)
        .classed('noselect', true)
        .text(function(d) { return d['name']; });

    // Scales for bars.
    var barScale = d3.scale.linear()
        .range([0, maxBarWidth])
        .domain([0, statslist.maxBarTotal]);
    // Containers for bars.
    var barsContainers = rows.selectAll('g.bar').data(function(d) { return [d]; });
    barsContainers.enter().append('g')
        .classed('bar', true)
        .classed('Relevant', function(d) { return d['label'] == 'Relevant'; })
        .classed('Irrelevant', function(d) { return d['label'] == 'Irrelevant'; })
        .classed('Neutral', function(d) { return d['label'] == 'Neutral'; })
        .attr('transform', 'translate(' + (svgMargin.left + maxWordTextWidth) + ', 0)');

    // TODO(cesar): Make this flexible.
    barsContainers.each(function(d, i) {
        // Rectangle for number of pages until last update.
        var cl1 = d['label'];
        var cl2 = 'Previous';
        var rectPreviousPages =
          d3.select(this).selectAll('rect' + '.' + cl1 + '.' + cl2).data(['rect']);
        rectPreviousPages.enter().append('rect')
            .classed(cl1, true)
            .classed(cl2, true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        var wPrevious = barScale(d['Until Last Update']);
        var xPrevious = 0;
        rectPreviousPages
          .transition(transitionDuration)
          .attr('x', xPrevious)
          .attr('width', wPrevious);

        // Rectangle for number of new pages.
        var cl2 = 'New';
        var rectNewPages =
          d3.select(this).selectAll('rect' + '.' + cl1 + '.' + cl2).data(['rect']);
        rectNewPages.enter().append('rect')
            .classed(cl1, true)
            .classed(cl2, true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        var wNew = barScale(d['TotalTags'] - d['Until Last Update']);
        var xNew = wPrevious;
        rectNewPages
          .transition(transitionDuration)
          .attr('x', xNew)
          .attr('width', function(){return wNew;});
    });

    // Interaction rectangle.
    rows.selectAll('rect.interaction').data(function(d, i) { return [d]; })
      .enter().append('rect').classed('interaction', true)
        .attr('x', -svgMargin.left)
        .attr('width', containerWidth)
        .attr('height', rowHeight)
        .on('click', function(d, i) {
            console.log('click on stat ', d['name']);
        })
        .on('mouseover', function(d, i) {
            Utils.showTooltip();
        })
        .on('mousemove', function(d, i) {
            var t = numberFormat(d['Until Last Update']) + ' ' + d['label']
              + ' pages out of ' + d['TotalTags'] + ' total';
            Utils.updateTooltip(t);
        })
        .on('mouseout', function(d, i) {
            Utils.hideTooltip();
        });



    // Bar and number for new pages.
    var entriesCompTopMargin = 6 * svgMargin.top + (statslist.entries.length + 1) * rowHeight;

    svg = svg.selectAll('g.compRows').data(['g.compRows']);
    svg.enter().append('g')
        .classed('compRows', true);
    svg
        .attr('transform', 'translate(0,' + entriesCompTopMargin + ')');

    var neutralNew = 0;
    statslist.entries.forEach(function(entry) {
      if (entry['label'] == 'Neutral') {
        neutralNew = entry['New'];
      }
    });
    var compRows = svg.selectAll('g.compRow').data([{'label': 'New', 'v': neutralNew}]);
    compRows.enter().append('g')
        .classed('compRow', true)
        .attr('transform', function(d, i) {
            return 'translate(0, '
            + (i * 2 * rowHeight) + ')';
        });

    var groups = ['Neutral'];
    // Information about number of new pages.
    compRows.each(function(d, i) {
        var container = d3.select(this);
        var className = d['label'];
        var barH = 0.5 * barHeight;
        var titleH = 5;
        var titleY = 10;
        var rowH = barH + 5;
        var maxW = barScale.range()[1];

        var titleText = d['label'] + ' pages';
        d3.select(this).selectAll('text.title').data(['text'])
            .enter().append('text')
            .classed('title', true)
            .attr('y', titleY)
            .text(titleText);

        for (var index in groups) {
            var group = groups[index];
            var gRect = d3.select(this).selectAll('g.bar.' + group).data(['g.bar']);
            gRect.enter().append('g')
                .classed('bar', true)
                .classed(group, true)
                .attr('transform', 'translate(' + (svgMargin.left + maxWordTextWidth) + ', ' + (titleH + index * rowH) + ')');
            var rect = gRect.selectAll('rect' + '.' + className + '.' + group).data(['rect']);
            rect.enter().append('rect')
                .classed(className, true)
                .classed(group, true)
                .attr('y', rowH)
                .attr('height', barH);
            var w = barScale(d['v']);
            rect
                .transition(transitionDuration)
                .attr('width', w);

            // Count.
            var pagesCount = gRect.selectAll('text.numericalData').data(['text']);
            pagesCount
                .enter().append('text')
                .classed('numericalData', true)
                .classed(className, true)
                .attr('x', -10)
                .attr('y', rowH + titleY);
            pagesCount
                .text(d['v']);
        }
    });

};
