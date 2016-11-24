import numpy as np
from elastic.get_mtermvectors import getTermStatistics

class tfidf:
    def __init__(self, opt_docs = None, rm_stopwords=True, rm_numbers=True, pos_tags=[],  term_freq=1, mapping=None, es_index = 'memex', es_doc_type = 'page', es = None):
        self.documents = opt_docs
        self.corpus = None
        self.tfidfArray = None
        self.tfArray = None
        self.ttf = None
        self.mapping = mapping
        self.rm_stopwords = rm_stopwords
        self.rm_numbers = rm_numbers
        self.pos_tags = pos_tags
        self.es_index = es_index
        self.es_doc_type = es_doc_type
        self.es = es
        self.term_freq = term_freq
        
        if opt_docs != None:
          self.process(opt_docs)

    def getTopTerms(self,top):
        N = len(self.documents)
        avg = np.divide(np.sum(self.tfidfArray, axis=0), N)
        sortedAvgIndices = np.argsort(avg)[::-1]
        return [self.corpus[i] for i in sortedAvgIndices[0:top]]

    def getIndex(self, terms):
        index = []
        for term in terms:
            if term.strip() in self.corpus:
                index.append(self.corpus.index(term.strip()))
        return index

    def getTfidfArray(self):
        return [self.documents, self.corpus, self.tfidfArray]

    def getTfArray(self):
        return [self.documents, self.corpus, self.tfArray]

    def getTtf(self):
        return self.ttf

    def getURLs(self, args):
        return self.documents

    def getTerms(self, indices):
        return [self.corpus[x] for x in indices]

    def process(self, documents):
        [data_tfidf, data_tf, data_ttf, corpus, urls] = getTermStatistics(documents, self.rm_stopwords, self.rm_numbers, self.pos_tags, self.term_freq, mapping=self.mapping, es_index=self.es_index, es_doc_type=self.es_doc_type, es=self.es)
        self.tfidfArray = data_tfidf
        self.tfArray = data_tf
        self.ttf = data_ttf
        self.corpus = corpus
        self.documents = urls
