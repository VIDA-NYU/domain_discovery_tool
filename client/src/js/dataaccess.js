/**
 * Manages clock used to fetch pages summaries, and exposes access to back end.
 *
 * May 2015.
 * @author Cesar Palomo <cesarpalomo@gmail.com> <cmp576@nyu.edu>
 */
import {__sig__} from './sigslot_core.js';
import $ from 'jquery';

var DataAccess = (function() {
  var pub = {};

    var REFRESH_EVERY_N_MILLISECONDS = 2000;

  var lastUpdate = 0;
  var lastSummary = 0;
  var currentCrawler = undefined;
  var currentProjAlg = undefined;
  var loadingSummary = false;
  var updatingClassifier = false;
  var updating = false;
  var loadingPages = false;
  var loadingTerms = false;
  var pages = undefined;
  var termsSummary = undefined;
  var lastAccuracy = undefined;

  // Processes loaded list of available crawlers.
    var onAvailableCrawlersLoaded = function(crawlers) {
    __sig__.emit(__sig__.available_crawlers_list_loaded, crawlers["crawlers"]);
  };


  // Runs async post query.
  var runQuery = function(query, args, onCompletion, doneCb) {
    $.post(
      query,
      args,
      onCompletion)
    .done(doneCb);
  };

  // Runs async post query for current crawler.
  /*var runQueryForCurrentCrawler = function(query, args, onCompletion, doneCb) {
    if (currentCrawler !== undefined || query === "/addCrawler" || query === "/delCrawler") {
      runQuery(query, args, onCompletion, doneCb);
    }
  };
*/

  // Returns public interface.
  // Gets available crawlers from backend.
  pub.loadAvailableDomains = function() {
      runQuery('/getAvailableCrawlers', {"type": "init"}, onAvailableCrawlersLoaded);
  };



  // Sets current crawler Id.
  /*pub.setActiveCrawler = function(crawlerId) {
    currentCrawler = crawlerId;
  };
  */
  return pub;
}());

export {DataAccess};
