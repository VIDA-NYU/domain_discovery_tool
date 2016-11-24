from sklearn.feature_extraction.text import CountVectorizer
from nltk import corpus

class tf_vectorizer:
    
    def __init__(self, convert_to_ascii=False, max_features=10000, ngram_range=(1,1)):
        self.convert_to_ascii = convert_to_ascii
        self.count_vect = None
        self.max_features = max_features
        self.ngram_range = ngram_range
        self.ENGLISH_STOPWORDS = corpus.stopwords.words('english')
        
    def vectorize(self, data):
        X_counts = None

        if self.count_vect is None:
            self.count_vect = CountVectorizer(stop_words=self.ENGLISH_STOPWORDS, preprocessor=self.preprocess, strip_accents='ascii', ngram_range=self.ngram_range, max_features=self.max_features)
            X_counts = self.count_vect.fit_transform(data)
        else:
            X_counts = self.count_vect.transform(data)

        return [X_counts, self.count_vect.get_feature_names()]

    def tf(self, data):
        return self.vectorize(data)

    def preprocess(self, text):
        # Remove unwanted chars and new lines
        text = text.lower().replace(","," ").replace("__"," ").replace("(", " ").replace(")", " ").replace("[", " ").replace("]", " ").replace(".", " ").replace("/", " ").replace("\\", " ").replace("_", " ").replace("#", " ").replace("-", " ").replace("+", " ").replace("%", " ").replace(";", " ").replace(":", " ").replace("'", " ").replace("\""," ").replace("^", " ")

        text = text.replace("\n"," ")

        if self.convert_to_ascii:
            # Convert to ascii
            ascii_text = []
            for x in text.split(" "):
                try:
                    ascii_text.append(x.encode('ascii', 'ignore'))
                except:
                    continue
            
            text = " ".join(ascii_text)
        
        preprocessed_text = " ".join([word.strip() for word in text.split(" ") if len(word.strip()) > 2 and (word.strip() != "") and (self.isnumeric(word.strip()) == False) and self.notHtmlTag(word.strip()) and self.notMonth(word.strip())])

        return preprocessed_text

    def notHtmlTag(self, word):
        html_tags = ["http", "html", "img", "images", "image", "index"]
        
        for tag in html_tags:
            if (tag in word) or (word in ["url", "com", "www", "www3", "admin", "backup", "content"]):
                return False

        return True

    def notMonth(self, word):
        month_tags = ["jan", "january", "feb", "february","mar", "march","apr", "april","may", "jun", "june", "jul", "july", "aug", "august","sep", "sept", "september","oct","october","nov","november","dec", "december","montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sontag"]

        if word in month_tags:
            return False

        return True

    def isnumeric(self, s):
        # Check if string is a numeric
        try: 
            int(s.replace(".","").replace("-","").replace("+",""))
            return True
        except ValueError:
            try:
                long(s.replace(".","").replace("-","").replace("+",""))
                return True
            except ValueError:
                return False

    
