Crawl Forward and Backward
**************************

This allows the user to crawl one level forward or backward for all the selected URLs.

**Forward Links -** Forward links are all the links contained in a given page. When you crawl one level forward it downloads all the pages corresponding to the links contained in the page.

**Backward Links -** Backward links are all the links that contain a link to the given page. When you crawl one level backward it first finds all the links that contain a link to the selected page and then downloads all the pages corresponding to the links contained in the all the backward link pages.

The motivation for backward and forward crawling is the assumption that links containing the selected pages (back links) and links contained in the selected page (forward links) would be about similar topic as the selected page.

Crawl Individual Pages
<<<<<<<<<<<<<<<<<<<<<<

.. |tag_one| image:: figures/fwd_back_single.png

|tag_one|  buttons, along each page, can be used to crawl backward or forward links in individual pages.

Crawl Selected Pages
<<<<<<<<<<<<<<<<<<<<

Select multiple pages by keeping the **ctrl** key pressed and clicking on the pages that you want to select. When done with selecting pages, release the **ctrl** key. This will bring up a window where you can choose to crawl forward or backward the pages as shown below:

.. image:: figures/multi_select.png
   :width: 800px
   :align: center
   :height: 400px
   :alt: alternate text


Crawl All Pages
<<<<<<<<<<<<<<<

.. |tag_all| image:: figures/tag_all.png

Use the |tag_all| buttons at the top of the list of pages to crawl backward or forward links on all pages in the current view.

Crawl All Pages for Current Filter
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

.. |tag_all| image:: figures/tag_all.png
		     
If you want to crawl forward or backward all pages retrieved for a particular filter (across pagination), then check the **Select ALL results in <total pages> paginations** checkbox below the page list on top left. Then use |tag_all| buttons to crawl all the pages.
