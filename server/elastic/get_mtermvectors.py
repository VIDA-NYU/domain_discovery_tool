#!/usr/bin/env python
from sklearn.feature_extraction import DictVectorizer
import nltk
import math
from sets import Set
import time
import numpy as np
import operator

from config import es as default_es
from elastic.get_documents import get_documents_by_id

ENGLISH_STOPWORDS = set(nltk.corpus.stopwords.words('english'))
MAX_TERMS = 2000

def pos_filter(pos_tags=['NN', 'NNS', 'NNP', 'NNPS', 'VBN', 'JJ'], docterms=[]):
    tagged = nltk.pos_tag(docterms)
    valid_words = [tag[0] for tag in tagged if tag[1] in pos_tags]
    return valid_words

def tfidf(tf, df, n_doc):
    idf = math.log(n_doc / float(df))
    return tf * idf

def terms_from_es_json(doc, rm_stopwords=True, rm_numbers=True, termstatistics = False, term_freq = 0, mapping=None, es=None):
    terms = {}
    docterms = doc["term_vectors"][mapping['text']]["terms"]
    n_doc = doc["term_vectors"][mapping['text']]["field_statistics"]["doc_count"]
    valid_words = docterms.keys()
    
    if rm_stopwords:
        valid_words = [k for k in valid_words if k not in ENGLISH_STOPWORDS and (len(k) > 2)]

    if rm_numbers:
        valid_words = [k for k in valid_words if not k.lstrip('-').replace('.','',1).replace(',','',1).isdigit()]
        
    if termstatistics == True:
        terms = {term: {'tfidf':tfidf(docterms[term]["term_freq"], docterms[term]["doc_freq"], n_doc),
                        'tf': docterms[term]["term_freq"],
                        'ttf': docterms[term]["ttf"],
                    } for term in valid_words if docterms[term]["ttf"] > term_freq
        }
    else:
        terms = { term: {'tf': docterms[term]['term_freq']} for term in valid_words if docterms[term]["term_freq"] > term_freq}

    # Restrict the number of terms for large documents
    if len(terms.keys()) > MAX_TERMS:
        sorted_terms = []
        if termstatistics == True:
            terms_tfidf = {term:terms[term]["tfidf"] for term in terms.keys()}
            sorted_terms = sorted(terms_tfidf.items(), key=operator.itemgetter(1), reverse=True)
        else:
            terms_tf = {term:terms[term]["tf"] for term in terms.keys()}
            sorted_terms = sorted(terms_tf.items(), key=operator.itemgetter(1), reverse=True)

        terms = {item[0]: terms[item[0]] for item in sorted_terms[0:MAX_TERMS]}

    return terms


def getTermFrequency(all_hits, rm_stopwords=True, rm_numbers=True, pos_tags=[], term_freq=0, mapping=None, es_index='memex', es_doc_type='page', es=None):
    if es is None:
        es = default_es

    docs = []
    stats = []
    corpus = []

    once = True
    for i in range(0, len(all_hits), 10):
        hits = all_hits[i:i+10]

        term_res = es.mtermvectors(index=es_index,
                                   doc_type=es_doc_type,
                                   fields=mapping['text'], 
                                   ids=hits) 

        for doc in term_res['docs']:
            if doc.get('term_vectors'):
                if mapping['text'] in doc['term_vectors']:
                    docs.append(doc['_id'])
                    res = terms_from_es_json(doc=doc, rm_stopwords=rm_stopwords, rm_numbers=rm_numbers,  term_freq=term_freq, mapping=mapping)
                    stats.append(res)

    tfs = []
    for stat in stats:
        tf={}
        tf={k:stat[k]['tf'] for k in stat.keys()}
        tfs.append(tf)

    v_tf = DictVectorizer()
    data = v_tf.fit_transform(tfs).toarray()
    corpus = v_tf.get_feature_names()

    if len(pos_tags) > 0:
        filtered_words = pos_filter(pos_tags, corpus)
        indices = [corpus.index(term) for term in corpus if term not in filtered_words]
        corpus =  np.delete(corpus, indices)
        corpus = corpus.tolist()
        data =  np.delete(data, indices, 1)

    return [data, corpus, docs]


def getTermStatistics(all_hits, rm_stopwords=True, rm_numbers=True, pos_tags=[], term_freq=0, num_terms=MAX_TERMS, mapping=None, es_index='memex', es_doc_type='page', es=None):
    if es is None:
        es = default_es

    stats = []
    docs = []

    ttf = {}
    for i in range(0, len(all_hits), 10):
        hits = all_hits[i:i+10]

        term_res = es.mtermvectors(index=es_index,
                                   doc_type=es_doc_type,
                                   term_statistics=True, 
                                   fields=mapping['text'], 
                                   ids=hits)

        for doc in term_res['docs']:
            if doc.get('term_vectors'):
                if mapping['text'] in doc['term_vectors']:
                    docs.append(doc['_id'])
                    res = terms_from_es_json(doc=doc, rm_stopwords=rm_stopwords, rm_numbers=rm_numbers, termstatistics=True, term_freq=term_freq, mapping=mapping)
                    stats.append(res)
                    for k in res.keys():
                        ttf[k] = res[k]['ttf']


    tfidfs = []
    tfs = []
    for stat in stats:
        tfidf={k: stat[k]['tfidf'] for k in stat.keys()}
        tfidfs.append(tfidf)
        tf={k:stat[k]['tf'] for k in stat.keys()}
        tfs.append(tf)

    v_tfidf = DictVectorizer()
    v_tf = DictVectorizer()

    data = v_tfidf.fit_transform(tfidfs).toarray()
    corpus = v_tfidf.get_feature_names()
    tf_data = v_tf.fit_transform(tfs).toarray()
    
    if len(pos_tags) > 0:
        filtered_words = pos_filter(pos_tags, corpus)
        indices = [corpus.index(term) for term in corpus if term not in filtered_words]
        corpus =  np.delete(corpus, indices)
        corpus = corpus.tolist()
        data =  np.delete(data, indices, 1)
        tf_data =  np.delete(tf_data, indices, 1)

        if len(corpus) > MAX_TERMS:
            mean_tfidf = np.mean(data, axis=0)
            indices = np.argsort(mean_tfidf)[::-1]
            corpus = [corpus[i] for i in indices]
            data = data[:, indices]
            tf_data = tf_data[:, indices]
            
        ttf = {key:value for key, value in ttf.iteritems() if key in corpus}

    result = [data, tf_data, ttf, corpus, docs]

    del tfidfs
    del tfs

    return result

