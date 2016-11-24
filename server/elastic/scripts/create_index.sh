#!/bin/sh
if [ $# -eq 0 ]
then 
    INDEX=memex
else
    INDEX=$1
fi

if [ $# -gt 1 ]
then
    ELASTIC=$2
else
    ELASTIC=http://localhost:9200
fi

curl -s -XPUT "$ELASTIC/$INDEX"; echo
#  -d '{
#     "index" : {
# 	"analysis":{
# 	    "analyzer":{
# 		"html" : {
# 	            "type" : "custom",
# 		    "tokenizer" : "standard",
#                     "filter" : ["lowercase" , "stop"],
#                     "char_filter" : ["html_strip"]
#                 }
#             }
# 	}
#     }
# }'
