from math import sqrt
from numpy import *

import sys

reload(sys)
sys.setdefaultencoding("utf-8")


class BayesianSets:
    # D-> Query Set
    # X-> Data Set
    def score(self, D, X) :

        #Compute Bayesian Sets Parameters
        c = 2
        N = D.shape[0]
        T = concatenate((D,X))
        m = divide(sum(T, axis=0),T.shape[0])

        a = multiply(m, c)
        b = multiply(subtract(1,m),c)

        at = add(a,sum(D, axis=0))
        bt = subtract(add(b,N),sum(D, axis=0))
        
        C = sum(subtract(add(subtract(log(add(a,b)),log(add(add(a,b),N))), log(bt)), log (b)))

        q = transpose(add(subtract(subtract(log(at),log(a)),log(bt)), log(b)))
        
        score_X = transpose(add(C, dot(X,q)))
        
        return asarray(score_X)
        
