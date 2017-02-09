from subprocess import call
from subprocess import Popen
from subprocess import PIPE


from os import chdir, listdir, environ, makedirs, rename, chmod, walk, devnull, remove

from os.path import isfile, join, exists, isdir

# Return the seed urls generated for the given query
def collect_seed_urls(query, seed_dir, es_info):
    with open(seed_dir+"seeds_"+"+".join(query.split(" "))+".txt","r") as f:
        return [query, " ".join([url.strip() for url in f.readlines()]), es_info]
    
def execSeedFinder(terms, es_info):
    domain_name = es_info['activeCrawlerIndex']
  
    data_dir = environ["DDT_HOME"] + "/server/data/"
    data_crawler  = data_dir + domain_name
    data_training = data_crawler + "/training_data/"
    
    crawlermodel_dir = data_crawler + "/models/"
    
    if (not isdir(crawlermodel_dir)):
      return

    seed_dir = data_crawler + "/seedFinder/"
    
    if (not isdir(seed_dir)):
      # Create dir if it does not exist
      makedirs(seed_dir)
    
    ache_home = environ['ACHE_HOME']
    comm = ache_home + "/bin/ache run focusedCrawler.seedfinder.SeedFinder --initialQuery \"" +terms + "\" --modelPath " + crawlermodel_dir + " --seedsPath " + seed_dir + " --maxPages 2 --maxQueries 1"

    f_devnull = open(devnull, 'w')
    p = Popen(comm, shell=True, stderr=PIPE, stdout=f_devnull)
    p.wait()

    return collect_seed_urls(terms, seed_dir, es_info)

