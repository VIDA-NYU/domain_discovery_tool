import sys

import tfidf
import BayesianSets
import numpy as np

class rank:
    def results(self,table,query_urls, other_urls):

        [urls, corpus, data] = table.getTfidfArray()

        #Normalise the data
        col_sum_d = np.sum(data,axis=0)    
        norm_d = np.divide(data, col_sum_d)

        indices = [urls.index(url) for url in query_urls]
        subquery_data = norm_d[indices, :]

        indices = [urls.index(url) for url in other_urls]
        other_data = norm_d[indices, :]

        # Check if any of the features are not present in any 
        # of the query set documents
        check_for_zero = np.sum(subquery_data, axis=0)
        zero_indices = np.where(check_for_zero == 0)[0]

        if(len(zero_indices) > 0):
            # If features not present in query set documents
            # then remove them
            old_corpus = corpus
            corpus = []
            [corpus.append(old_corpus[i]) for i in range(0,len(old_corpus)) if i not in zero_indices]

            subquery_data = np.delete(subquery_data, zero_indices, 1)
            other_data = np.delete(other_data, zero_indices, 1)

        bs = BayesianSets.BayesianSets()
        
        score = bs.score(subquery_data, other_data)

        indices = np.argsort(np.multiply(score,-1))
        ranked_urls = [other_urls[index] for index in indices]
        ranked_scores = [score[index] for index in indices]
        return [ranked_urls,ranked_scores]

def main(argv):
    if len(argv) != 2:
        print "Invalid arguments"
        print "python rank.py inputfile 0,1,2"
        return
    
    # File containing information of documents
    input_file = argv[0]
    # Most relevant documents
    query_index = [int(i) for i in argv[1].split(',')]
    ranker = rank()
    [ranked_urls,scores] = ranker.results(input_file,query_index)

    for i in range(0,len(ranked_urls)):
        print ranked_urls[i]," ", str(scores[i])
    
if __name__=="__main__":
    main(sys.argv[1:])
