#!/bin/sh
if [ $# -eq 0 ]
then
    INDEX=memex
else
    INDEX=$1
fi

if [ $# -gt 1 ]
then
    TYPE=$2
    echo $TYPE
else
    TYPE=page
fi

if [ $# -gt 2 ]
then 
    MAPPING=$3
else
    MAPPING='mapping.json'
fi

if [ $# -gt 3 ]
then
    ELASTIC=$4
else
    ELASTIC=http://localhost:9200
fi

curl -XPUT "$ELASTIC/$INDEX/$TYPE/_mapping?pretty=1" -d @$MAPPING
