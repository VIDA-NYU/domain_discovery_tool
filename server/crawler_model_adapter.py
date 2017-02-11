import math
from models.crawlermodel import *

#
# Base class that defines default functionality for crawler model monitoring/steering.
#
class CrawlerModelAdapter:
  def __init__(self):
    self._crawlerModel = CrawlerModel()



  # Extracts boolean parameter.
  @staticmethod
  def extractBooleanParam(param):
    return param == 'true'



  # Extracts list of parameters: array is encoded as a long string with a delimiter.
  @staticmethod
  def extractListParam(param, opt_char = None):
    delimiter = opt_char if opt_char != None else '|'
    return param.split(delimiter) if len(param) > 0 else []



  # Returns a list of available crawlers sorted by name, creation date, in the format:
  # [
  #   {'id': crawlerId, 'name': crawlerName, 'creation': epochInSecondsOfFirstDownloadedURL},
  #   {'id': crawlerId, 'name': crawlerName, 'creation': epochInSecondsOfFirstDownloadedURL},
  #   ...
  # ]
  def getAvailableCrawlers(self):
    crawlers = self._crawlerModel.getAvailableCrawlers()
    return sorted(crawlers, key = lambda c: (c['name'], c['creation']))

  # Submits a web query for a list of terms, e.g. 'ebola disease'
  def queryWeb(self, terms, session):
    self._crawlerModel.queryWeb(terms, session=session)

  # Submits a query for a list of terms, e.g. 'ebola disease' to the seedfinder
  def runSeedFinder(self, terms, session):  
    self._crawlerModel.runSeedFinder(terms, session)
    
  # Add crawler
  def addCrawler(self, index_name):
    self._crawlerModel.addCrawler(index_name)

  # Delete crawler
  def delCrawler(self, domains):
    self._crawlerModel.delCrawler(domains)

  # Create model
  def createModel(self, session):
    return self._crawlerModel.createModel(session)

  # Returns number of pages downloaded between ts1 and ts2 for active crawler.
  # ts1 and ts2 are Unix epochs (seconds after 1970).
  # If opt_applyFilter is True, the summary returned corresponds to the applied pages filter defined
  # previously in @applyFilter. Otherwise the returned summary corresponds to the entire dataset
  # between ts1 and ts2.
  # Returns dictionary in the format:
  # {
  #   'Positive': {'Explored': #ExploredPgs, 'Exploited': #ExploitedPgs, 'Boosted': #BoostedPgs},
  #   'Negative': {'Explored': #ExploredPgs, 'Exploited': #ExploitedPgs, 'Boosted': #BoostedPgs},
  # }
  def getPagesSummary(self, opt_ts1 = None, opt_ts2 = None, opt_applyFilter = False, session = None):
    return self._crawlerModel.getPagesSummaryCrawler(opt_ts1, opt_ts2, opt_applyFilter, session)



  # Returns number of terms present in positive and negative pages.
  # Returns array in the format:
  # [
  #   [term, frequencyInPositivePages, frequencyInNegativePages, tags],
  #   [term, frequencyInPositivePages, frequencyInNegativePages, tags],
  #   ...
  # ]
  def getTermsSummary(self, session):
    return self._crawlerModel.getTermsSummaryCrawler(session)

  # Sets limit to pages returned by @getPages.
  def setPagesCountCap(self, pagesCap):
    self._crawlerModel.setPagesCountCap(pagesCap)

  # Set the date range to filter data
  def setDateTime(self, fromDate=None, toDate=None):
    self._crawlerModel.setDateTime(fromDate, toDate)


  # Returns most recent downloaded pages.
  # Returns dictionary in the format:
  # {
  #   'last_downloaded_url_epoch': 1432310403 (in seconds)
  #   'pages': [
  #             [url1, x, y, tags],     (tags are semicolon separated)
  #             [url2, x, y, tags],
  #             [url3, x, y, tags],
  #   ]
  # }
  def getPages(self, session):
    return self._crawlerModel.getPages(session)

  def getPagesQuery(self, session):
    return self._crawlerModel.getPagesQuery(session)

  # Boosts set of pages: crawler exploits outlinks for the given set of pages.
  def boostPages(self, pages):
    pages = CrawlerModelAdapter.extractListParam(pages)
    return self._crawlerModel.boostPages(pages)

  # Fetches snippets for a given term.
  def getTermSnippets(self, term, session):
    return self._crawlerModel.getTermSnippets(term, session)


  # Adds tag to page (if applyTagFlag is True) or removes tag from page (if applyTagFlag is False).
  def setPagesTag(self, pages, tag, applyTagFlag, session):
    pages = CrawlerModelAdapter.extractListParam(pages)
    applyTagFlag =  CrawlerModelAdapter.extractBooleanParam(applyTagFlag)
    self._crawlerModel.setPagesTag(pages, tag, applyTagFlag, session)


  # Adds tag to terms (if applyTagFlag is True) or removes tag from terms (if applyTagFlag is
  # False).
  def setTermsTag(self, terms, tag, applyTagFlag, session):
    terms = CrawlerModelAdapter.extractListParam(terms)
    applyTagFlag =  CrawlerModelAdapter.extractBooleanParam(applyTagFlag)
    self._crawlerModel.setTermsTag(terms, tag, applyTagFlag, session)

  # Update online classifier
  def updateOnlineClassifier(self, session):
    return self._crawlerModel.updateOnlineClassifier(session)

  # Delete terms from term window and from the ddt_terms index
  def deleteTerm(self, term, session):
    self._crawlerModel.deleteTerm(term, session)

  # Download the pages of uploaded urls
  def downloadUrls(self, urls, session):
    self._crawlerModel.downloadUrls(urls, session)

  # Crawl forward links
  def getForwardLinks(self, urls, session):
    urls = CrawlerModelAdapter.extractListParam(urls)
    self._crawlerModel.getForwardLinks(urls, session);

  # Crawl backward links
  def getBackwardLinks(self, urls, session):
    urls = CrawlerModelAdapter.extractListParam(urls)
    self._crawlerModel.getBackwardLinks(urls, session);

#
# Overwrites default functionality to serve for seed crawler model use.
#
class SeedCrawlerModelAdapter(CrawlerModelAdapter):
  def __init__(self):
    CrawlerModelAdapter.__init__(self)



  # Returns a list of available seed crawlers sorted by name, creation date, in the format:
  # [
  #   {'name': crawlerName, 'creation': epochInSecondsOfFirstDownloadedURL},
  #   {'name': crawlerName, 'creation': epochInSecondsOfFirstDownloadedURL},
  #   ...
  # ]
  def getAvailableCrawlers(self):
    crawlers = self._crawlerModel.getAvailableSeedCrawlers()
    return sorted(crawlers, key = lambda c: (c['name'], c['creation']))

  def getAvailableProjectionAlgorithms(self):
    return self._crawlerModel.getAvailableProjectionAlgorithms()

  def getAvailableQueries(self, session):
    return self._crawlerModel.getAvailableQueries(session)

  def getAvailableTags(self, session):
    return self._crawlerModel.getAvailableTags(session)

  def getAvailableModelTags(self, session):
    return self._crawlerModel.getAvailableModelTags(session)

  def updateColors(self, session, colors):
    return self._crawlerModel.updateColors(session, colors)

  def getTagColors(self, domainId):
    return self._crawlerModel.getTagColors(domainId)

  # Returns number of pages downloaded between ts1 and ts2 for active crawler.
  # ts1 and ts2 are Unix epochs (seconds after 1970).
  # If opt_applyFilter is True, the summary returned corresponds to the applied pages filter defined
  # previously in @applyFilter. Otherwise the returned summary corresponds to the entire dataset
  # between ts1 and ts2.
  # Returns dictionary in the format:
  # {
  #   'Relevant': numPositivePages,
  #   'Irrelevant': numNegativePages,
  #   'Neutral': numNeutralPages,
  # }
  def getPagesSummary(self, opt_ts1 = None, opt_ts2 = None, opt_applyFilter = False, session = None):
    return self._crawlerModel.getPagesSummarySeedCrawler(opt_ts1, opt_ts2, opt_applyFilter, session)



  # Returns number of terms present in relevant and irrelevant pages.
  # Returns array in the format:
  # [
  #   [term, frequencyInRelevantPages, frequencyInIrrelevantPages, tags],
  #   [term, frequencyInRelevantPages, frequencyInIrrelevantPages, tags],
  #   ...
  # ]
  def getTermsSummary(self, session):
    return self._crawlerModel.getTermsSummarySeedCrawler(session = session)

  def getPagesDates(self, session):
    return self._crawlerModel.getPagesDates(session)

  def getPlottingData(self, session):
    return self._crawlerModel.getPlottingData(session)

  def make_topic_model(self, session, tokenizer, vectorizer, model, ntopics):
    return self._crawlerModel.make_topic_model(session, tokenizer, vectorizer, model, ntopics)
  
