from os import environ
import json

from config import es as default_es

def create_index(es_index='memex', mapping=environ['DDT_HOME']+'/server/elastic/mapping.json', es=None):
    if es is None:
        es = default_es

    json_page_data=open(mapping).read()

    page_mappings = json.loads(json_page_data)

    doctypes = {}
    for doc_type in page_mappings.keys():
        doctypes[doc_type] = page_mappings[doc_type]
        
    mappings = {
        "mappings": doctypes
    }
    
    fields = es_index.lower().split(' ')
    es_index = '_'.join([item for item in fields if item not in ''])

    res = es.indices.create(index=es_index, body=mappings, ignore=400)

    es.indices.refresh(es_index)

    return res

def create_terms_index(es_index='ddt_terms', es=None):
    if es is None:
        es = default_es

    json_terms_data=open(environ['DDT_HOME']+'/server/elastic/mapping_terms.json').read()

    terms_mappings = json.loads(json_terms_data)

    mappings = {"mappings": 
                {
                    "terms":terms_mappings["terms"]
                }
            }
    
    fields = es_index.lower().split(' ')
    es_index = '_'.join([item for item in fields if item not in ''])

    res = es.indices.create(index=es_index, body=mappings, ignore=400)

    es.indices.refresh(es_index)

    return res

def create_config_index(es_index='config', es=None):
    if es is None:
        es = default_es

    json_config_data=open(environ['DDT_HOME']+'/server/elastic/config.json').read()

    config_mappings = json.loads(json_config_data)

    mappings = {"mappings": 
                {
                    "domains": config_mappings["domains"] 
                }
            }

    fields = es_index.lower().split(' ')

    es_index = '_'.join([item for item in fields if item not in ''])

    res = es.indices.create(index=es_index, body=mappings, ignore=400)
    
    return res


