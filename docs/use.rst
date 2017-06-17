Using the Domain Discovery Tool
===============================

Now you should be able to head to http://localhost:8084/ to interact with the tool.

.. include:: add_domain.rst
.. include:: load_data.rst
.. include:: filter.rst	     	     

Annotation
----------

Currently, pages can be annotated as Relevant, Irrelevant or Neutral. Annotations are used to build a domain model.

Domain Model
------------

DDT incrementally builds a model as the user annotates the retrieved pages. The accuracy of the domain model is displayed on the top right corner. It provides an indication of the model coverage of the domain and how it is influenced by annotations.

Run Crawler
-----------

Once a sufficiently good model is available you can start the ACHE crawler by clicking on "Start Crawler" button. You can see the results of the crawled data in "Crawled Data" in the Filters Tab. When the crawler is running it can be monitored at http://localhost:8080/.



