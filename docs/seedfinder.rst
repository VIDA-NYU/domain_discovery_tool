SeedFinder
**********

Instead of making multiple queries to Google/Bing yourself you can trigger automated keyword search on Google/Bing and collect more web pages for the domain using the SeedFinder. This requires a domain model. So once you have annoated sufficient pages, indicated by a non-zero accuracy on the top right corner, you can use the SeedFinder functionality.

To start a SeedFinder search click on the SEEDFINDER tab. 

.. image:: figures/seedfinder_search_new.png
   :width: 800px
   :align: center
   :height: 600px
   :alt: alternate text

Enter the initial search query keywords, for example **ebola treatment**, as shown in the figure above. The SeedFinder issues this query to Google/Bing. It applies the domain model to the pages returned by Google/Bing. From the pages labeled relevant by the domain model the SeedFinder extracts keywords to form new queries which it again issues to Google/Bing. This iterative process terminates when no more relevant pages are retrieved or the max number of queries configured is exceeded.

You can monitor the status of the SeedFinder in the **Process Monitor** that can be be accessed by clicking on the |pm_icon| on the top as shown below:

.. |pm_icon| image:: figures/pm_icon.png

.. image:: figures/sf_pm.png
   :width: 800px
   :align: center
   :height: 600px
   :alt: alternate text

You can also stop the seedfinder process from the **Process Monitor** by clicking on the stop button shown along the corresponding proces.

All queries made are listed in the **Filters** Tab under **SeedFinder Queries**. These pages can now be analysed and annotated just like the other web pages.
