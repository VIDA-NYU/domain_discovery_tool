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
else
    TYPE=page
fi

if [ $# -gt 2 ]
then
    ELASTIC=$3
else
    ELASTIC=http://localhost:9200
fi
echo $INDEX

curl -XDELETE "$ELASTIC/$INDEX/$TYPE"; echo
