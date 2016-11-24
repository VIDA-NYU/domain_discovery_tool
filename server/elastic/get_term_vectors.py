#!/usr/bin/python
from os import environ

from config import es as default_es

es = default_es

query = {
    "query": {
        "match_all": {}
    },
    "fields": []
}
res = es.search(query, 
                index=environ['ELASTICSEARCH_INDEX'] if environ.get('ELASTICSEARCH_INDEX') else 'memex', 
                doc_type=environ['ELASTICSEARCH_DOC_TYPE'] if environ.get('ELASTICSEARCH_DOC_TYPE') else 'page')

hits = res['hits']
print 'Document found: %d' % hits['total']
ids = [hit['_id'] for hit in hits['hits']]
body={
    "ids": ids,
    "parameters": {
        "fields": [ "text" ]
    }
}
res = es.send_request('POST',
                      ['memex', 'page', '_mtermvectors'],
                      body=body, query_params={})

