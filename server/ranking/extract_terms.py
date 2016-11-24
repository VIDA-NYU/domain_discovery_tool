import sys

import tfidf
import BayesianSets

import numpy as np
import scipy.sparse as sps

class extract_terms:
    def __init__(self, tfidf):
        self.table = tfidf

    def getTopTerms(self,top):
        return self.table.getTopTerms(top)
        
    def results(self,query_terms):
        
        [urls, corpus, d] = self.table.getTfidfArray()

        if sps.issparse(d):
            d = d.toarray()
        
        query_index = self.getIndex(corpus, query_terms)
        
        #Normalise the data
        col_sum_d = np.sum(d, axis=0)    
        norm_d = np.divide(d, col_sum_d)

        data = np.transpose(norm_d)

        # documents other than the relevant documents
        index = [x for x in range(0,len(data)) if x not in query_index]
        
        subquery_data = data[query_index,:]
        other_data = data[index,:]

        # Check if any of the features are not present in any 
        # of the query set documents
        check_for_zero = np.sum(subquery_data, axis=0)
        zero_indices = np.where(check_for_zero == 0)[0]
        
        if(len(zero_indices) > 0):
            # If features not present in query set documents
            # then remove them
            subquery_data = np.delete(subquery_data, zero_indices, 1)
            other_data  = np.delete(other_data, zero_indices, 1)

        bs = BayesianSets.BayesianSets()
        score = bs.score(subquery_data, other_data)

        rank_index = np.argsort(score)[::-1]

        offset_rank_index = [index[x] for x in rank_index]

        # Get the terms corresponding to the scored indices
        ranked_terms = self.table.getTerms(offset_rank_index)

        ranked_scores = [score[rank_index[i]] for i in range(0, len(score))]
        return [ranked_terms,ranked_scores]

    def getIndex(self, corpus, query_terms):
        indices = []
        for term in query_terms:
            try:
                indices.append(corpus.index(term))
            except ValueError:
                pass
        return indices
        

def main(argv):
    if len(argv) != 2:
        print "Invalid arguments"
        print "python rank.py inputfile 0,1,2"
        return
    
    # File containing information of documents
    input_file = argv[0]
    # Most relevant documents
    query_index = [int(i) for i in argv[1].split(',')]
    ranker = extract_terms()
    [ranked_urls,scores] = ranker.results(input_file,query_index)

    for i in range(0,20):
        print ranked_urls[i]," ", str(scores[i])
    
if __name__=="__main__":
    main(sys.argv[1:])
