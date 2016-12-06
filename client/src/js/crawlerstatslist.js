/**
 * @fileoverview js Statistics for crawled pages.
 *
 * @author (cesarpalomo@gmail.com) Cesar Palomo
 */



/**
 * Manages a list of statistics of crawled pages, including Positive/Negative/Explored/Exploited
 * pages.
 *
 * @param containerId ID for parent element.
 */
var Statslist = function(containerId) {
    this.containerId = containerId;  
    this.entries = [];
    this.setMaxBarTotal(100);
    this.update();
};


Statslist.prototype.setMaxBarTotal = function(maxBarTotal) {
    this.maxBarTotal = maxBarTotal;
    this.update();
};


Statslist.prototype.addEntries = function(entries) {
    this.entries = this.entries.concat(entries);
    this.update();
};


Statslist.prototype.setEntries = function(entries) {
    this.entries = entries;
    this.update();
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
    
    // Number of pages per entry.
    var nPages = this.entries.map(function(d) {
        return d['Explored'] + d['Exploited'] + d['New'];
    });
    statslist.nPagesPerEntry = {};
    for (var i in nPages) {
      statslist.nPagesPerEntry[statslist.entries[i]['name']] = nPages[i];   
    }
    statslist.nPagesTotal = nPages.reduce(function(prev, cur) { return prev + cur; }, 0);
    
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
        .classed('Positive', function(d) { return d['label'] == 'Positive'; })
        .classed('Negative', function(d) { return d['label'] == 'Negative'; })
        .attr('transform', 'translate(' + (svgMargin.left + maxWordTextWidth) + ', 0)');
    
    barsContainers.each(function(d, i) {
        // Rectangle for number of explored pages.
        var rectExplored = d3.select(this).selectAll('rect.Explored').data(['rect']);
        rectExplored.enter().append('rect')
            .classed('Explored', true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        var widthExplored = barScale(d['Explored']);
        var xExplored = 0;
        rectExplored
          .transition(transitionDuration)
          .attr('x', xExplored)
          .attr('width', widthExplored);
        
        // Rectangle for number of exploited pages.
        var rectExploited = d3.select(this).selectAll('rect.Exploited').data(['rect']);
        rectExploited.enter().append('rect')
            .classed('Exploited', true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        var widthExploited = barScale(d['Exploited']);
        var xExploited = widthExplored;
        rectExploited
          .transition(transitionDuration)
          .attr('x', xExploited)
          .attr('width', widthExploited);
        
        // Rectangle for number of new pages.
        var rectNew = d3.select(this).selectAll('rect.New').data(['rect']);
        rectNew.enter().append('rect')
            .classed('New', true)
            .attr('y', 0.5 * (rowHeight - barHeight))
            .attr('height', barHeight);
        var widthNew = barScale(d['New']);
        var xNew = widthExplored + widthExploited;
        rectNew
          .transition(transitionDuration)
          .attr('x', xNew)
          .attr('width', widthNew);
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
            var t = numberFormat(statslist.nPagesPerEntry[d['name']]) + ' ' + d['label']
              + ' pages out of ' + numberFormat(statslist.nPagesTotal) + ' total';
            Utils.updateTooltip(t);
        })
        .on('mouseout', function(d, i) {
            Utils.hideTooltip();
        });

    
    // Rows for entries comparisons.
    var entriesCompTopMargin = 6 * svgMargin.top + (statslist.entries.length + 1) * rowHeight;
    
    svg = svg.selectAll('g.compRows').data(['g.compRows']);
    svg.enter().append('g')
        .classed('compRows', true);
    svg
        .attr('transform', 'translate(0,' + entriesCompTopMargin + ')');
    
    var compRows = svg.selectAll('g.compRow').data(['Explored', 'Exploited', 'New']);
    compRows.enter().append('g')
        .classed('compRow', true)
        .attr('transform', function(d, i) {
            return 'translate(0, '
            + (i * 2 * rowHeight) + ')'; 
        });
    
    var groups = statslist.entries.map(function(g) { return g['label']; });
    // Information about number of explored/exploited/new pages.
    compRows.each(function(d, i) {
        var container = d3.select(this);
        var className = d;
        var barH = 0.5 * barHeight;
        var titleH = 5;
        var titleY = 10;
        var rowH = barH + 5;
        var maxW = barScale.range()[1];

        var titleText = d.charAt(0).toUpperCase() + d.slice(1) + ' pages';
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
            var rect = gRect.selectAll('rect').data(['rect']);
            rect.enter().append('rect')
                .classed(className, true)
                .attr('y', rowH)
                .attr('height', barH);
            var w = barScale(statslist.entries.length > 0 && statslist.entries[index][className]);
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
                .text((statslist.entries.length > 0 && numberFormat(statslist.entries[index][className])) || 0);
        }        
    });
};
