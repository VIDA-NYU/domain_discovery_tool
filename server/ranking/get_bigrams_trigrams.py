from elasticsearch import Elasticsearch
from elastic.get_documents import get_documents
from online_classifier.tfidf_vector import tfidf_vectorizer
import numpy as np
import operator
import math
from sets import Set

from nltk import corpus
ENGLISH_STOPWORDS = set(corpus.stopwords.words('english'))

MAX_PHRASES = 1000

def get_bigrams_trigrams(text=[], termCount=20, es=None):

        bigram_vectorizer = tfidf_vectorizer(convert_to_ascii=True, ngram_range=(2,2))
        trigram_vectorizer = tfidf_vectorizer(convert_to_ascii=True, ngram_range=(3,3))
        
        [bigram_tfidf, bigram_tf, bi_corpus] = bigram_vectorizer.tfidf(text)
        [trigram_tfidf, trigram_tf, tri_corpus] = trigram_vectorizer.tfidf(text)
                
        N = np.shape(bigram_tfidf)[0]
        avg = np.divide(bigram_tfidf.sum(axis=0), N)
        sortedAvgIndices = np.argsort(avg)[::-1]
        top_bigrams = [bi_corpus[sortedAvgIndices[0,i]] for i in range(0, np.shape(sortedAvgIndices)[1])][0:termCount]

        N = np.shape(trigram_tfidf)[0]
        avg = np.divide(trigram_tfidf.sum(axis=0), N)
        sortedAvgIndices = np.argsort(avg)[::-1]
        top_trigrams = [tri_corpus[sortedAvgIndices[0,i]] for i in range(0, np.shape(sortedAvgIndices)[1])][0:termCount]

        return bigram_tfidf, trigram_tfidf, bigram_tf, trigram_tf, bi_corpus, tri_corpus, top_bigrams, top_trigrams
