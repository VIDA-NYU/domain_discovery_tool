from sklearn import linear_model
from sklearn.calibration import CalibratedClassifierCV

from tfidf_vector import tfidf_vectorizer

import numpy as np

class OnlineClassifier:

    def __init__(self, max_features=10000):
        self.clf = None
        self.tfidf_vector = tfidf_vectorizer(convert_to_ascii=True, max_features = max_features)
        
    def vectorize(self, train, test=[]):
        [X_train, _, _] = self.tfidf_vector.tfidf(train)
        
        X_test = None
        if test:
            [X_test, _, _] = self.tfidf_vector.tfidf(test)
            
        return [X_train, X_test]

    def fit(self, X, Y):
        clf = linear_model.SGDClassifier(n_iter=1)
        try:
            clf.fit(X, Y)
        except ValueError as verr:
            print("Value error: {0}".format(verr))
            return None
        self.clf = clf
        return clf

    def partialFit(self, X, Y):
        if self.clf is None:
            self.fit(X, Y)
        else:
            self.clf.partial_fit(X,Y)
        return self.clf
    
    def calibrate(self,  X, Y):
        if self.clf != None:
            sigmoid = CalibratedClassifierCV(self.clf, cv=2, method='sigmoid')
            sigmoid.fit(X,Y)
            return sigmoid
        else:
            return None

    def calibrateScore(self, sigmoid, X, Y):
        return sigmoid.score(X,Y)

    def predictClass(self, X, sigmoid):
        return [self.clf.predict(X), sigmoid.predict(X), np.multiply(sigmoid.predict_proba(X),100)]

    def classify(self, train, train_labels, test, test_labels, partial=False):
        [X_train, X_test] = self.vectorize(train, test)
        if partial:
            clf = self.partialFit(X_train, train_labels)
        else:
            clf = self.fit(X_train, train_labels)
        sigmoid = self.calibrate(clf, X_train, train_labels)
        self.predictClass(X_test, test_labels, clf, sigmoid)
        
        
