import cherrypy
from domain_discovery_API.server import Page
#import domain_discovery_api.* as dd_api
from ConfigParser import ConfigParser
import json
import os
from threading import Lock
import urlparse
from domain_discovery_API.models.domain_discovery_model import DomainModel

class DDTServer(Page):
  @staticmethod
  def getConfig():
    # Parses file to prevent cherrypy from restarting when config.conf changes: after each request
    # it restarts saying config.conf changed, when it did not.
    config = ConfigParser()
    config.read(os.path.join(os.path.dirname(__file__), "config.conf"))

    configMap = {}
    for section in config.sections():
      configMap[section] = {}
      for option in config.options(section):
        # Handles specific integer entries.
        val = config.get(section, option)
        if option == "server.socket_port" or option == "server.thread_pool":
          val = int(val)
        configMap[section][option] = val

    return configMap

  # Default constructor reading app config file.
  def __init__(self):
    self._ddtModel = DomainModel()
    path = os.path.dirname(__file__)
    self._ddtModel.setPath(path)
    super(DDTServer, self).__init__(self._ddtModel, path)
    
  # Access to seed crawler vis.
  @cherrypy.expose
  def seedcrawler(self):
    # TODO Use SeedCrawlerModelAdapter self._crawler = SeedCrawlerModelAdapter()
    return open(os.path.join(self._HTML_DIR, u"index.html"))

  @cherrypy.expose
  def release(self):
    return open(os.path.join(self._HTML_DIR, u"release.html"))

  @cherrypy.expose
  def index(self):
    return self.seedcrawler()

if __name__ == "__main__":
  server = DDTServer()

  # CherryPy always starts with app.root when trying to map request URIs
  # to objects, so we need to mount a request handler root. A request
  # to "/" will be mapped to HelloWorld().index().
  app = cherrypy.quickstart(server, config=DDTServer.getConfig())
  cherrypy.config.update(server.config)
  #app = cherrypy.tree.mount(page, "/", page.config)

  #if hasattr(cherrypy.engine, "signal_handler"):
  #    cherrypy.engine.signal_handler.subscribe()
  #if hasattr(cherrypy.engine, "console_control_handler"):
  #    cherrypy.engine.console_control_handler.subscribe()
  #cherrypy.engine.start()
  #cherrypy.engine.block()

else:
  server = DDTServer()
  # This branch is for the test suite; you can ignore it.
  config = DDTServer.getConfig()
  app = cherrypy.tree.mount(server, config=config)
