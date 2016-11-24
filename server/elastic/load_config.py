import json
import sys
from datetime import datetime
from add_documents import add_document

from config import es as default_es

def load_config(entries, es_index='config', es_doc_type='domains', es=None):

    if es is None:
        es = default_es

    add_document(entries, es_index, es_doc_type, es)

if __name__ == "__main__":

    if len(sys.argv)>1:
        config_file = sys.argv[1]
    else:
        config_file = 'ddt_index_config_entries.json'

    if len(sys.argv)>2:    
        es_index = sys.argv[2]
    else:
        es_index = 'config'

    if len(sys.argv)>3:    
        es_doc_type = sys.argv[3]
    else:
        es_doc_type = 'domains'

    es = None
    if len(sys.argv)>4:    
        es_host = sys.argv[4]
        from pyelasticsearch import ElasticSearch
        es = ElasticSearch(es_host)
        
    load_config(config_file, es_index, es_doc_type, es)

