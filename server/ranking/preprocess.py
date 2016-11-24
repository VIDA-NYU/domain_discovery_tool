from nltk import word_tokenize
from nltk.text import TextCollection
from nltk import corpus

from pprint import pprint

ENGLISH_STOPWORDS = set(corpus.stopwords.words('english'))

class TextPreprocess:
    def __init__(self,display=False):
        self.display=display
        
    def preprocess(self,text):
        #text = text.split(" ");
        text = word_tokenize(text)
        if self.display:
            print "After Tokenizing"
            print text
            print "\n\n"

        text=[w.strip().lower() for w in text if not w.strip() in ENGLISH_STOPWORDS and len(w.strip())>2]
        
        tc = TextCollection([text])
        words = list(set(tc))
        
        word_tf = {word: tc.tf(word, text) * len(text) for word in words}

        return word_tf
