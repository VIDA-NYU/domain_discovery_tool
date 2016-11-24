# ElasticSearch utility for MEMEX (Experimental)

Jean-Daniel Fekete, March 10th, 2015
Yamuna Krishnamurthy

Using ElasticSearch requires its installation first. Go to:
https://www.elastic.co/downloads/elasticsearch, get the version that fits your system. Install it and start the server.
It should work on port 9200 on localhost. The installed version should be higher than 1.4 to provide some of the features we need.

To debug and see the contents of the data in ElasticSearch, install the "Head" plugin:
   ```
   sudo elasticsearch/bin/plugin -install mobz/elasticsearch-head
   ```
Then look at the contents of Elasticsearch by opening the url: http://localhost:9200/_plugin/head/

Also, install python >= 2.7.9, not python3.

Then, you can populate the database with html documents

This directory contains python scripts for various operations with elasticsearch:

## Methods for creating an index

    ```
    create_index.py
    ```

## Methods for adding and updating documents
    ```
    add_documents.py
    ```
## Methods to Search documents

  ```
  search_documents.py
  ```
## Getting the term vectors

To perform its search, ElasticSearch maintains term vectors and computes TF/IDF on them. The information can be retrieved with the sample script:
   ```
   get_term_vectors.py
   ```
## Methods to get specific documents

   ```
   get_documents.py
   ```
## Methods to do aggregations

   ```
   aggregations.py
   ```
   
## Methods for delete an index

    ```
    delete.py
    ```

The shell scripts in the script directory can be used as follows for testing the elasticsearch:

## Creating the ElasticSearch Index

A Database is called an Index in ElasticSearch. To create it, use the script `create_index.sh'
  ```
  ./create_index.sh
  ```

Then, a Schema should be defined. A ElasticSearch Schema is called a "Mapping" for example `mapping.json`. You can install it with the script:
  ```
  ./put_mapping.sh
  ```

