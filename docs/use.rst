Use Domain Discovery Tool
=========================

Now you should be able to head to http://localhost:8084/ to interact with the tool.

.. include:: add_domain.rst
.. include:: load_data.rst	     

Filtering
---------

.. image:: filters.png
   :width: 800px
   :align: center
   :height: 400px
   :alt: alternate text

Once some pages are loaded into the domain, they can be analyzed with various filters available in the Filters tab on the left panel such as:

QUERIES: Filter by keyword web searches 

CRAWLED DATA: Filter the relevant and irrelevant crawled data

TAGS: Filter by annotation tags

DOMAINS: Filter by the top level domains of all the pages in the domain

MODEL TAGS: Filter by predicted model tags

SEARCH: Search by keywords within the downloaded text. NOTE: This search is available on the top right corner.

Annotation
----------

Currently, pages can be annotated as Relevant, Irrelevant or Neutral. Annotations are used to build a domain model.

Domain Model
------------

DDT incrementally builds a model as the user annotates the retrieved pages. The accuracy of the domain model is displayed on the top right corner. It provides an indication of the model coverage of the domain and how it is influenced by annotations.

Run Crawler
-----------

Once a sufficiently good model is available you can start the ACHE crawler by clicking on "Start Crawler" button. You can see the results of the crawled data in "Crawled Data" in the Filters Tab. When the crawler is running it can be monitored at http://localhost:8080/.



