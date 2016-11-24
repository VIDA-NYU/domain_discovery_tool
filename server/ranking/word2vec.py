from pickle import load
import numpy as np
from os import environ

from elastic.get_mtermvectors import getTermFrequency
from preprocess import TextPreprocess
from elastic.get_documents import get_documents_by_id

class word2vec:
    def __init__(self, opt_docs = None, mapping=None, from_es=True, es_index = 'memex', es_doc_type = 'page', es = None):
        self.documents = opt_docs
        self.word2vec = None
        self.word_vec = None
        self.es = es

        if not from_es:
            f = open(environ['DDT_HOME']+'/server/ranking/D_cbow_pdw_8B.pkl', 'rb')
            self.word_vec = load(f)
        
        if opt_docs != None:
            self.process(opt_docs, mapping, es_index, es_doc_type, es)

    def get_word2vec(self):
        return [self.documents,self.word2vec]

    def get(self, word):
        if self.word_vec is None:
            results = get_documents_by_id([word], ["term"], "word_phrase_to_vec", "terms", self.es)
            if results is None:
                return None;
            else:
                return results[0]["term"][0]
        else:
            return self.word_vec.get(word)

    def process(self, documents, mapping=None, es_index = 'memex', es_doc_type = 'page', es = None):
        [data_tf, corpus, urls] = getTermFrequency(documents, mapping, es_index, es_doc_type, es)
        
        documents = urls

        word2vec_list_docs = []
        urls = []
        i = 0
        for doc in data_tf:
            if self.word_vec is None:
                results = get_documents_by_id(doc.keys(), ["term", "vector"], "word_phrase_to_vec", "terms", self.es)
                word_vec_doc = [res["vector"][0] for res in results]
            else:    
                word_vec_doc = [self.word_vec[term] for term in doc.keys() if doc[term] > 5 and not self.word_vec.get(term) is None]

            if word_vec_doc:
                m_word_vec = np.array(word_vec_doc).mean(axis=0) 
                word2vec_list_docs.append(m_word_vec.tolist())
                urls.append(documents[i])
            i = i + 1
        
        self.documents = urls
        
        self.word2vec = np.array(word2vec_list_docs)

        return [self.documents,self.word2vec]

    def process_text(self, urls, documents):
        tp = TextPreprocess()

        word2vec_list_docs = []
        final_urls = []
        i = 0
        for text in documents:
            doc = tp.preprocess(text)
            if self.word_vec is None:
                terms = [term for term in doc.keys() if doc[term] > 5]
                results = get_documents_by_id(terms, ["term", "vector"], "word_phrase_to_vec", "terms", self.es)
                word_vec_doc = [res["vector"] for res in results]
            else:    
                word_vec_doc = [self.word_vec[term] for term in doc.keys() if not self.word_vec.get(term) is None]
                
            if word_vec_doc:
                m_word_vec = np.array(word_vec_doc).mean(axis=0) 
                word2vec_list_docs.append(m_word_vec.tolist())
                final_urls.append(urls[i])
            i = i + 1

        self.documents = final_urls

        self.word2vec = np.array(word2vec_list_docs)

        return [self.documents,self.word2vec]
