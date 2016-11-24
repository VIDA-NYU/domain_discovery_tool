#!/usr/bin/python
from config import es as default_es
from elasticsearch.exceptions import NotFoundError

def delete(ids, es_index='memex', es_doc_type='page', es=None):
    if es is None:
        es = default_es
        
    for id in ids:
        try:
            es.delete(es_index, es_doc_type, id)
        except NotFoundError:
            continue
