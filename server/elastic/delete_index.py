from config import es as default_es
from pprint import pprint

def delete_index(es_index='', es=None):
    if es is None:
        es = default_es

    if es_index != "":
        res = es.indices.delete(index=es_index)

