Explore Data (Filters)
----------------------

.. image:: filters.png
   :width: 800px
   :align: center
   :height: 400px
   :alt: alternate text

Once some pages are loaded into the domain, they can be analyzed and spliced with various filters available in the Filters tab on the left panel. The available filters are:

Queries
~~~~~~~

This lists all the web search queries, uploaded URLs and seedfinder queries made to date in the domain. You can select one or more of these queries to get pages for those specific queries.

SeedFinder Queries
~~~~~~~~~~~~~~~~~~

This lists all the seedfinder queries made to date in the domain. You can select one or more of these queries to get pages for those specific queries.

Crawled Data
~~~~~~~~~~~~

This lists the relevant and irrelevant crawled data. The relevant crawled data, **CD Relevant**, are those crawled pages that are labeled relevant by the domain model. The irrelevant crawled data, **CD Irrelevant**, are those crawled pages that are labeled irrelevant by the domain model.

Tags
~~~~

This lists the annotations made to data. Currently the annotations can be either **Relevant**, **Irrelevant** or **Neutral**.

Annotated Terms
~~~~~~~~~~~~~~~

This lists all the terms that are either added, uploaded in the Terms Tab. It also lists the terms from the extracted terms in the Terms Tab that are annotated.

Domains
~~~~~~~

This lists all the top level domains of all the pages in the domain. For example, the top level domain for URL https://ebolaresponse.un.org/data is **ebolaresponse.un.org**.

Model Tags
~~~~~~~~~~

You can expand the **Model Tags** and click the **Upate Model Tags** button that appears below, to apply the domain model to a random selection of 500 unlabeled pages. The predicted labels for these 500 pages could be:

* **Maybe Relevant:** These are pages that have been labeled relevant by the model with a high confidence
* **Maybe Irrelevant:** These are pages that have been labeled irrelevant by the model with a high confidence
* **Unsure:** These are pages that were marked relevant or irrelevant by the domain model but with low confidence. Experiments have shown that labeling these pages helps improve the domain model's ability to predict labels for similar pages with higher confidence.

**NOTE:** This will take a few seconds to apply the model and show the results.

Search
~~~~~~

.. image:: search.png
   :width: 800px
   :align: center
   :height: 400px
   :alt: alternate text

Search by keywords within the within the page content text. This search is available on the top right corner as shown in the figure above. It can be used along with the other filters. The keywords are searched not only in the content of the page but also the title and URL of the page.

