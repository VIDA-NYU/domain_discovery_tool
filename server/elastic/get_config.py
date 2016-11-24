from datetime import datetime
from config import es as default_es

def get_available_domains(es=None):
    if es is None:
        es = default_es

    query = {
        "query": {
            "match_all": {}
        },
    }
    res = es.search(body=query, 
                    index='config',
                    doc_type='domains',
                    size=100
                )

    hits = res['hits']['hits']

    result = {}
    for hit in hits:
        result[hit['_id']] = hit['_source']
        result[hit['_id']]['timestamp'] = long(convert_to_epoch(datetime.strptime(result[hit['_id']]['timestamp'], '%Y-%m-%dT%H:%M:%S.%f')))
        
    return result

def get_mapping(es=None):
    if es is None:
        es = default_es
        
    query = {
        "query": {
            "match_all": {}
        },
    }
    res = es.search(body=query, 
                    index='config',
                    doc_type='mapping',
                    size=100
                )
    
    hits = res['hits']['hits']

    res = {}
    for hit in hits:
        res[hit['_source']['field']] = hit['_source']['value']

    return res

def get_tag_colors(es=None):
    if es is None:
        es = default_es
        
    query = {
        "query": {
            "match_all": {}
        }
    }
    res = es.search(body=query, 
                    index='config',
                    doc_type='tag_colors',
                    size=100
                )
    
    hits = res['hits']['hits']

    res = {}
    for hit in hits:
        res[hit['_id']] = {'index': hit['_source']['index']}
        res[hit['_id']]['colors'] = hit['_source']['colors']

    return res


def convert_to_epoch(dt):
    epoch = datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

if __name__ == "__main__":
    get_available_domains()

    
