/**
* Visualization for crawler monitoring and steering.
*
* April 2015.
* @author Cesar Palomo <cesarpalomo@gmail.com> <cmp576@nyu.edu>
*/

        import React from 'react';
        import ReactDOM from 'react-dom';
        import App from './App';
        import './index.css';


import {SigSlots} from './js/crawlersigslots.js';
import {__sig__} from './js/sigslot_core.js';
import {DataAccess} from './js/dataaccess.js';

var CrawlerVis = function() {
  this.availableTags = [
    'Relevant',
    'Irrelevant',
    'Neutral',
  ];
  this.seedCrawlerTagsLogic = {
    'Relevant': {
      applicable: true,
      removable: true,
      negate: ['Irrelevant'],
    },
    'Irrelevant': {
      applicable: true,
      removable: true,
      negate: ['Relevant'],
    },
    'Neutral': {
      isVirtual: true,
      applicable: true,
      removable: false,
      negate: ['Relevant', 'Irrelevant'],
    },
  };
  var currentCrawler = undefined;
  var queries = undefined;
  var tags = undefined;
  var modelTags = undefined;
  this.CUSTOM_COLORS = ["Coral","GoldenRod","Gold","PaleGreen","MediumTurquoise","SteelBlue","SlateBlue","Purple", "RebeccaPurple"]
  this.color_index = 0;
  this.tag_colors = {};
  this.dataAvailableDomains=[];
};


/**
* Instantiates for seed crawler use.
*/
CrawlerVis.buildForSeedCrawler = function() {
  // TODO(cesar): review function calls to see if all slots/UI elements are created correctly.
  var vis = new CrawlerVis();
  vis.initSignalSlotsSeedCrawler.call(vis);
  vis.initUISeedCrawler.call(vis);
  vis.stats = {
    'Relevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Irrelevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Neutral': {'Until Last Update': 0, 'New': 0, 'Total': 0},
  };
  vis.filterStats = {
    'Relevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Irrelevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Neutral': {'Until Last Update': 0, 'New': 0, 'Total': 0},
  };
  alert('buildForSeedCrawler');
  console.log('buildForSeedCrawler');
    //BokehPlots.vis = vis;
    //TopicVis.vis = vis;

  return vis;
};


// Initializes signal and slots for seed crawler use.
CrawlerVis.prototype.initSignalSlotsSeedCrawler = function() {
// TODO(cesar): review function calls to see if all slots/UI elements are created correctly.
SigSlots.connect(
__sig__.available_crawlers_list_loaded, this, this.createSelectForAvailableCrawlers);

};

// Initial components setup for crawler use.
    CrawlerVis.prototype.initUISeedCrawler = function() {
      this.loadAvailableCrawlers();
    };

    CrawlerVis.prototype.getElementValueId = function(d){
          return d.id;
    }
    // Creates select with available crawlers.
    CrawlerVis.prototype.setAvailableCrawlers = function() {
      console.log('dataAvailableDomains');
      console.log(this.dataAvailableDomains[0]);
      return this.dataAvailableDomains;
    }

    // Creates select with available crawlers.
    CrawlerVis.prototype.createSelectForAvailableCrawlers = function(data) {
        var vis = this;
        this.dataAvailableDomains = data;
       if (data.length > 0){
    	  // Manually triggers change of value.
            console.log(this.dataAvailableDomains[0]);
            var crawlerId = vis.getElementValueId(this.dataAvailableDomains[0]);
            console.log(crawlerId);
    	  //Check the first crawler in the dropdown
              //d3.select('input[value="'+data[0]["id"]+'"]').attr("checked", "checked");
              //$("#currentDomain").text(data[0].name).append("<span class='caret'></span>");

        }
        vis.setAvailableCrawlers();
      

      }


    // Loads list of available crawlers.
    CrawlerVis.prototype.loadAvailableCrawlers = function() {
      DataAccess.loadAvailableCrawlers();
    };





export {CrawlerVis};
