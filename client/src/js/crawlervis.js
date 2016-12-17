/**
* Visualization for crawler monitoring and steering.
*
* April 2015.
* @author Cesar Palomo <cesarpalomo@gmail.com> <cmp576@nyu.edu>
*/

var CrawlerVis = function() {
  this.availableTags = [
    'Relevant',
    'Irrelevant',
    'Neutral',
  ];
  this.seedCrawlerTagsLogic = {
    'Relevant': {
      applicable: true,
      removable: true,
      negate: ['Irrelevant'],
    },
    'Irrelevant': {
      applicable: true,
      removable: true,
      negate: ['Relevant'],
    },
    'Neutral': {
      isVirtual: true,
      applicable: true,
      removable: false,
      negate: ['Relevant', 'Irrelevant'],
    },
  };
  var currentCrawler = undefined;
  var queries = undefined;
  var tags = undefined;
  var modelTags = undefined;
  this.CUSTOM_COLORS = ["Coral","GoldenRod","Gold","PaleGreen","MediumTurquoise","SteelBlue","SlateBlue","Purple", "RebeccaPurple"]
  this.color_index = 0;
  this.tag_colors = {};
};


/**
* Instantiates for crawler use: inspects crawled pages, lets user tag pages, and boost some pages
* to steer crawler.
*/
CrawlerVis.buildForCrawler = function() {
  // TODO(cesar): review function calls to see if all slots/UI elements are created correctly.
  var vis = new CrawlerVis();
  vis.initSignalSlotsCrawler.call(vis);
  vis.initUICrawler.call(vis);
  vis.stats = {
    'Positive': {'Exploited': 0, 'Explored': 0, 'New': 0, 'Total': 0},
    'Negative': {'Exploited': 0, 'Explored': 0, 'New': 0, 'Total': 0},
  };
  vis.filterStats = {
    'Positive': {'Exploited': 0, 'Explored': 0, 'New': 0, 'Total': 0},
    'Negative': {'Exploited': 0, 'Explored': 0, 'New': 0, 'Total': 0},
  };
  return vis;
};


/**
* Instantiates for seed crawler use.
*/
CrawlerVis.buildForSeedCrawler = function() {
  // TODO(cesar): review function calls to see if all slots/UI elements are created correctly.
  /*var vis = new CrawlerVis();
  vis.initSignalSlotsSeedCrawler.call(vis);
  vis.initUISeedCrawler.call(vis);
  vis.stats = {
    'Relevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Irrelevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Neutral': {'Until Last Update': 0, 'New': 0, 'Total': 0},
  };
  vis.filterStats = {
    'Relevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Irrelevant': {'Until Last Update': 0, 'New': 0, 'Total': 0},
    'Neutral': {'Until Last Update': 0, 'New': 0, 'Total': 0},
  };
    BokehPlots.vis = vis;
    TopicVis.vis = vis;
  return vis;*/
  alert('hello aqui crawler');
  console.log('aqui crawlervis');
};


// Initializes signal and slots for crawler use.
CrawlerVis.prototype.initSignalSlotsCrawler = function() {
  SigSlots.connect(
    __sig__.available_crawlers_list_loaded, this, this.createSelectForAvailableCrawlers);

  SigSlots.connect(
    __sig__.available_crawlers_list_reloaded, this, this.reloadSelectForAvailableCrawlers);
  //SigSlots.connect(__sig__.new_pages_summary_fetched, this, this.onLoadedNewPagesSummaryCrawler);
  SigSlots.connect(
    __sig__.previous_pages_summary_fetched, this, this.onLoadedPreviousPagesSummaryCrawler);
  SigSlots.connect(__sig__.terms_summary_fetched, this, this.onLoadedTermsSummary);
  SigSlots.connect(__sig__.term_focus, this, this.onTermFocus);
  SigSlots.connect(__sig__.terms_snippets_loaded, this, this.onLoadedTermsSnippets);
  SigSlots.connect(__sig__.pages_loaded, this, this.onLoadedPages);
  SigSlots.connect(__sig__.queries_loaded, this, this.onLoadedQueries);
  SigSlots.connect(__sig__.tags_loaded, this, this.onLoadedTags);
  SigSlots.connect(__sig__.model_tags_loaded, this, this.onLoadedModelTags);
  SigSlots.connect(__sig__.tag_focus, this, this.onTagFocus);
  SigSlots.connect(__sig__.tag_clicked, this, this.onTagClicked);
  SigSlots.connect(__sig__.tag_action_clicked, this, this.onTagActionClicked);
  SigSlots.connect(
    __sig__.tag_individual_page_action_clicked, this, this.onTagIndividualPageActionClicked);

  SigSlots.connect(__sig__.brushed_pages_changed, this, this.onBrushedPagesChanged);
  SigSlots.connect(__sig__.filter_enter, this, this.runFilter);
  SigSlots.connect(__sig__.add_term, this, this.runAddTerm);
  SigSlots.connect(__sig__.add_neg_term, this, this.runAddNegTerm);
  SigSlots.connect(__sig__.load_new_pages_summary, this, this.loadNewPagesSummary);
  SigSlots.connect(__sig__.update_online_classifier, this, this.updateOnlineClassifier);
  SigSlots.connect(__sig__.build_hierarchy_filters, this, this.buildHierarchyFilters);
  // TODO(Cesar): remove! not active for crawler.
  //SigSlots.connect(__sig__.term_toggle, this, this.onTermToggle);
};


// Initializes signal and slots for seed crawler use.
CrawlerVis.prototype.initSignalSlotsSeedCrawler = function() {
// TODO(cesar): review function calls to see if all slots/UI elements are created correctly.
SigSlots.connect(
__sig__.available_crawlers_list_loaded, this, this.createSelectForAvailableCrawlers);
SigSlots.connect(
__sig__.available_crawlers_list_reloaded, this, this.reloadSelectForAvailableCrawlers);
SigSlots.connect(
  __sig__.available_proj_alg_list_loaded, this, this.createSelectForAvailableProjectionAlgorithms);
  SigSlots.connect(__sig__.new_pages_summary_fetched, this, this.onLoadedNewPagesSummarySeedCrawler);
  SigSlots.connect(
    __sig__.previous_pages_summary_fetched, this, this.onLoadedPreviousPagesSummarySeedCrawler);
  SigSlots.connect(__sig__.terms_summary_fetched, this, this.onLoadedTermsSummary);
  SigSlots.connect(__sig__.term_focus, this, this.onTermFocus);
  SigSlots.connect(__sig__.term_toggle, this, this.onTermToggle);

  SigSlots.connect(__sig__.terms_snippets_loaded, this, this.onLoadedTermsSnippets);
  SigSlots.connect(__sig__.pages_loaded, this, this.onLoadedPages);
  SigSlots.connect(__sig__.queries_loaded, this, this.onLoadedQueries);
  SigSlots.connect(__sig__.tags_loaded, this, this.onLoadedTags);
  SigSlots.connect(__sig__.model_tags_loaded, this, this.onLoadedModelTags);
  SigSlots.connect(__sig__.tags_colors_loaded, this, this.onLoadedTagColors);
  SigSlots.connect(__sig__.tag_focus, this, this.onTagFocus);
  SigSlots.connect(__sig__.tag_clicked, this, this.onTagClicked);
  SigSlots.connect(__sig__.tag_action_clicked, this, this.onTagActionClicked);
  SigSlots.connect(
    __sig__.tag_individual_page_action_clicked, this, this.onTagIndividualPageActionClicked);

  SigSlots.connect(__sig__.brushed_pages_changed, this, this.onBrushedPagesChanged);
  SigSlots.connect(__sig__.add_crawler, this, this.runAddCrawler);
  SigSlots.connect(__sig__.del_crawler, this, this.runDelCrawler);
  SigSlots.connect(__sig__.query_enter, this, this.runQuery);
  SigSlots.connect(__sig__.filter_enter, this, this.runFilter);
  SigSlots.connect(__sig__.add_term, this, this.runAddTerm);
  SigSlots.connect(__sig__.add_neg_term, this, this.runAddNegTerm);
  SigSlots.connect(__sig__.delete_term, this, this.runDeleteTerm);
  SigSlots.connect(__sig__.load_new_pages_summary, this, this.loadNewPagesSummary);
  SigSlots.connect(__sig__.set_pages_tags_completed, this, this.onPagesTagsSet);
  SigSlots.connect(__sig__.update_online_classifier, this, this.updateOnlineClassifier);
  SigSlots.connect(__sig__.update_online_classifier_completed, this, this.onUpdatedOnlineClassifier);
  SigSlots.connect(__sig__.build_hierarchy_filters, this, this.buildHierarchyFilters);
  SigSlots.connect(__sig__.new_tag_loaded, this, this.updateNewTagLoaded);

};

    // Initial components setup for seed crawler use.
    CrawlerVis.prototype.initUICrawler = function() {
      this.loadAvailableCrawlers();
      this.loadAvailableProjectionAlgorithms();
      this.createSelectForAvailablePageRetrievalCriteria();
      this.initWordlist();
      this.initStatslist();
      this.initFilterStatslist();
      this.initTagsGallery(
        [
          'Relevant',
          'Irrelevant',
          'Neutral',
          'Positive',
          'Negative',
          'Explored',
          'Boosted',
          'Exploited',
        ],
        {
          'Relevant': {
            applicable: true,
            removable: true,
            negate: ['Irrelevant'],
          },
          'Irrelevant': {
            applicable: true,
            removable: true,
            negate: ['Relevant'],
          },
          'Neutral': {
            isVirtual: true,
            applicable: true,
            removable: false,
            negate: ['Relevant', 'Irrelevant'],
          },
          'Positive': {
            applicable: false,
            removable: false,
            negate: [],
          },
          'Negative': {
            applicable: false,
            removable: false,
            negate: [],
          },
          'Explored': {
            applicable: false,
            removable: false,
            negate: [],
          },
          'Exploited': {
            applicable: false,
            removable: false,
            negate: [],
          },
          'Boosted': {
            applicable: false,
            removable: false,
            negate: [],
          },
        });
        this.initPagesLandscape(true);
        this.initPagesGallery();
        this.initTermsSnippetsViewer();
        this.initFilterButton();
        this.initModelButton();
        this.createSelectForFilterPageCap();
      };


      // Initial components setup for crawler use.
      CrawlerVis.prototype.initUISeedCrawler = function() {
        this.loadAvailableCrawlers();
        this.loadAvailableProjectionAlgorithms();
        this.createSelectForAvailablePageRetrievalCriteria();
        this.initWordlist();
        this.initStatslist();
        this.initFilterStatslist();
        this.initPagesLandscape(false);
        this.initTagsGallery(this.availableTags, this.seedCrawlerTagsLogic);
        this.initPagesGallery();
        this.initTermsSnippetsViewer();
        this.initFilterButton();
        this.initModelButton();
        this.initQueryWebButton();
        this.initAddCrawlerButton();
        this.initFromCalendarButton();
        this.initToCalendarButton();
        this.createSelectForFilterPageCap();
        this.initAddTermButton();
      };



      CrawlerVis.prototype.getElementValueId = function(d){
        return d.id;
      }

     CrawlerVis.prototype.setCurrentCrawler = function(crawlerId){
        this.currentCrawler = crawlerId;
        this.setActiveCrawler(crawlerId);
        this.clearAll();
      }

     CrawlerVis.prototype.renderCrawlerOptions = function(element, data, selectedCrawler){
        var vis = this;
        // Remove existing crawler options before rendering new ones.
        element.selectAll('li').filter(function(d, i){
          return (this.id != "addDomainButton" && this.id != "delDomainButton");
        }).remove();
        var options = element.selectAll('input').data(data);
        options.enter().append('input');
        options
        .attr('value', vis.getElementValueId)
        .attr('type', 'radio')
        .attr('name', 'crawlerRadio')
        .attr('id', vis.getElementValueId)
        .attr('placeholder', function(d, i){
          // return d.name + ' (' + Utils.parseFullDate(d.creation) + ')'
          return d.name
        })

	 // Wrap each input and give it a label.
	 d3.selectAll("input[name='crawlerRadio']").each(function(){
	    $("input[id='"+this.id+"']")
		.wrap("<li class='crawler-radio'></li>")
		.after("<label for='"+this.id+"'>"+this.placeholder+"</label>");
         });

	 if (selectedCrawler != undefined){
             d3.select('input[value="'+selectedCrawler+'"]');
         }

        d3.selectAll('input[name="crawlerRadio"]').on('change', function(){
          var crawlerId = d3.select('input[name="crawlerRadio"]:checked').node().value;
          vis.setCurrentCrawler(crawlerId);
          CrawlerVis.prototype.updateVisualization(vis);
          nroQueries = initialCheckBox;   nroTags = initialCheckBox; changeDomainQuery = true; changeDomainTag =true;
        });

        // Add the Add Domain button after the last element in the crawler selection.
        var addDomain = $("#addDomainButton").detach();
        addDomain.appendTo($("#selectCrawler:last-child"));

        $('#delDomainCheckBox').empty();
        var count;
        for (count = 0; count < data.length; count++) {
          var newli = document.createElement('li');
          var label = data[count].id;
          newli.innerHTML = "<input type='checkbox' name='domains_checkbox' id='" + label +"' value='"+data[count].index+"'><label for='"+label+"'>"+data[count].name+"</label>";
          document.getElementById('delDomainCheckBox').appendChild(newli);
        }

        var delDomain = $("#delDomainButton").detach();
        delDomain.appendTo($("#selectCrawler:last-child"));

      }



      // Creates select with available crawlers.
      CrawlerVis.prototype.createSelectForAvailableCrawlers = function(data) {
        var vis = this;
        var selectBox = d3.select('#selectCrawler');

        $('#addDomainModal').on('shown.bs.modal', function(e){
          $("#crawler_index_name").focus();
          $("#crawler_index_name").val("");
        });

        $('#delDomainModal').on('shown.bs.modal', function(){
        });

        if (data.length > 0){
	  // Manually triggers change of value.
          var crawlerId = vis.getElementValueId(data[0]);
          vis.renderCrawlerOptions(selectBox, data, crawlerId);
          vis.setCurrentCrawler(crawlerId);
	  //Check the first crawler in the dropdown
          d3.select('input[value="'+data[0]["id"]+'"]').attr("checked", "checked");
          $("#currentDomain").text(data[0].name).append("<span class='caret'></span>");

	  CrawlerVis.prototype.updateVisualization(vis);
        } else {
          $("#currentDomain").text("Select/Add Domains").append("<span class='caret'></span>");
          document.getElementById("status_panel").innerHTML = 'No domains found'
          $(document).ready(function() { $(".status_box").fadeIn(); });
          $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
        }
      }

      // Reload select with available crawlers.
      CrawlerVis.prototype.reloadSelectForAvailableCrawlers = function(result) {
        var data = result["crawlers"];
        var type = result["type"]
        var vis = this;
        var selectBox = d3.select('#selectCrawler');
        if (data.length > 0) {
          var selectedCrawler = d3.select('input[name="crawlerRadio"]:checked').node()

          // Generate the index name from the entered crawler name
          var index_name = d3.select('#crawler_index_name').node().value;

          // If just one crawler exists then select that
          if (data.indexOf(selectedCrawler) >= 0){
            vis.renderCrawlerOptions(selectBox, data, selectedCrawler.id);
            $("#currentDomain").text(selectedCrawler.placeholder).append("<span class='caret'></span>");
          } else {
            var crawlerId = vis.getElementValueId(data[0]);
            vis.setCurrentCrawler(crawlerId);
            vis.renderCrawlerOptions(selectBox, data, crawlerId);
            $("#currentDomain").text(data[0]["name"]).append("<span class='caret'></span>");
          }
          if(type == "add"){
            document.getElementById("status_panel").innerHTML = 'Added new domain - ' + index_name;
            $(document).ready(function() { $(".status_box").fadeIn(); });
            $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
          }else if(type == "delete"){
            document.getElementById("status_panel").innerHTML = 'Deleted selected domains';
            $(document).ready(function() { $(".status_box").fadeIn(); });
            $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
          }

        } else {
          vis.renderCrawlerOptions(selectBox, data, undefined);
          $("#currentDomain").text("Select/Add Domains").append("<span class='caret'></span>");
          document.getElementById("status_panel").innerHTML = 'No domains found';
          $(document).ready(function() { $(".status_box").fadeIn(); });
          $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
        }
      };



      // Loads list of available crawlers.
      CrawlerVis.prototype.loadAvailableCrawlers = function() {
        DataAccess.loadAvailableCrawlers();
      };


      // Sets active crawler.
     CrawlerVis.prototype.setActiveCrawler = function(crawlerId) {
        $("#wordlist").html("");
        this.initWordlist();
        // Changes active crawler and forces update.
        DataAccess.setActiveCrawler(crawlerId);
        DataAccess.loadTagColors(crawlerId);
      };


      // Creates select with available projection algorithms.
      CrawlerVis.prototype.createSelectForAvailableProjectionAlgorithms = function(data) {
        var vis = this;
        var selectBox = d3.select('#selectProjectionAlgorithm').on('change', function() {
          var algId = d3.select(this).node().value;
          vis.setActiveProjectionAlg(algId);
          CrawlerVis.prototype.updateVisualization(vis);
        });
        var getElementValue = function(d) {
          return d.name;
        };
        var options = selectBox.selectAll('option').data(data);
        options.enter().append('option');
        options
        .attr('value', getElementValue)
        .text(function(d, i) {
          return d.name;
        });
        selectBox.val = options[0].text;
      };

      // Loads list of available projection algorithms.
      CrawlerVis.prototype.loadAvailableProjectionAlgorithms = function() {
        DataAccess.loadAvailableProjectionAlgorithms();
      };


      // Sets active projection algorithm.
      CrawlerVis.prototype.setActiveProjectionAlg = function(algId) {
        // Changes active crawler and forces update.
        DataAccess.setActiveProjectionAlg(algId);
      };


      var status = "less";
      var nroMaxQueries;
      var nroMaxTags;
      var flag_newQuery = false; changeDomain = false; flag_newTag = false;
      var value_newQuery = "";
      var initialCheckBox = 5; nroQueries = initialCheckBox; nroTags = initialCheckBox;
      var changeDomainQuery =false;
      var changeDomainTag = false;
      var visgeneral;

      //Adding new queries.
      CrawlerVis.prototype.updateFilterData = function(value) {
        var session = CrawlerVis.prototype.sessionInfo();
        flag_newQuery= true;
        value_newQuery = value;
        DataAccess.update(session);
        this.pagesGallery.clear();
        //DataAccess.loadAvailableQueries(session);
        //DataAccess.loadAvailableTags(session, 'Tags');
        //CrawlerVis.prototype.updateNewQueryButtonMoreQueries(session);
      };

      //Updating 'morequeries' button after a new query is added
      CrawlerVis.prototype.updateNewQueryButtonMoreQueries = function(session) {
        document.getElementById("toggleButtonLessQueries").innerText = "";
        if(nroQueries<=initialCheckBox && nroMaxQueries<=initialCheckBox) {
          document.getElementById("toggleButtonMoreQueries").innerText = "";
        }
        else{
          //if(nroQueries>10) {document.getElementById("toggleButtonLessQueries").innerText = "See Less";}
          document.getElementById("toggleButtonMoreQueries").innerText = "See More";
        }
      };

      //Updating 'moretags' button after a new tag is added
      CrawlerVis.prototype.updateChangeDomainButtonMoreTags = function(session) {
        document.getElementById("toggleButtonLessTags").innerText = "";
        if(nroTags<=initialCheckBox && nroMaxTags<=initialCheckBox) {
          document.getElementById("toggleButtonMoreTags").innerText = "";
        }
        else{
          //if(nroQueries>10) {document.getElementById("toggleButtonLessQueries").innerText = "See Less";}
          document.getElementById("toggleButtonMoreTags").innerText = "See More";
        }
      };

      //updating state of 'morequeries' button after user clicks on it.
      CrawlerVis.prototype.updateButtonMoreQueries = function(session) {
        var currentMoreQueries= nroQueries + initialCheckBox;
        if(currentMoreQueries<nroMaxQueries && (nroQueries+initialCheckBox)<=nroMaxQueries  && nroMaxQueries>initialCheckBox){
          nroQueries = currentMoreQueries; //nroQueries + initialCheckBox;
          DataAccess.loadAvailableQueries(session);//DataAccess.loadAvailableQueries(vis.sessionInfo());
          document.getElementById("toggleButtonMoreQueries").innerText = "See More";
          document.getElementById("toggleButtonLessQueries").innerText = "See Less";
        }
        else{
          nroQueries = nroMaxQueries;
          DataAccess.loadAvailableQueries(session);
          document.getElementById("toggleButtonMoreQueries").innerText = "";
          if(nroQueries>initialCheckBox) document.getElementById("toggleButtonLessQueries").innerText = "See Less";
        }

      };


      // Creates select with available pages selection criteria.
      CrawlerVis.prototype.createSelectForAvailablePageRetrievalCriteria = function() {
        var vis = this;
        visgeneral = vis;
        $('#page_retrieval_criteria_select').hide();

        var selectBox = d3.select('#page_retrieval_criteria_select').on('change', function() {
          /*var criteria = d3.select(this).node().value;
          if(criteria == "Queries"){
            $('#select_tags').hide();
            $('#select_queries').hide();
            document.getElementById("toggleButtonMore").innerText = "See More"; $('#toggleButtonMore').show();
            document.getElementById("toggleButtonLess").innerText = "See Less"; $('#toggleButtonLess').show();
            DataAccess.loadAvailableQueries(vis.sessionInfo());
          }
          else if(criteria == "Tags" || criteria == "More like"){
            $('#select_queries').hide();
            $('#select_tags').hide();
            document.getElementById("toggleButtonMore").innerText = "See More"; $('#toggleButtonMore').show();
            document.getElementById("toggleButtonLess").innerText = "See Less"; $('#toggleButtonLess').show();
            DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
          }
          else {
            $('#queryCheckBox').empty();
            $('#tagsCheckBox').empty();
            $('#select_queries').hide();
            $('#select_tags').hide();
            $('#toggleButtonMore').hide();
            $('#toggleButtonLess').hide();

          }*/

        });



        $('#selectPageRetrievalCriteria').val("Most Recent");

        d3.select('#UpdateCheckboxesQuery').on('click', function() {
          DataAccess.loadAvailableQueries(vis.sessionInfo());
          DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
          CrawlerVis.prototype.updateNewQueryButtonMoreQueries(vis.sessionInfo());
        });

        d3.select('#UpdateCheckboxesTag').on('click', function() {
            DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
        });

	      d3.select('#UpdateCheckboxesModelTag').on('click', function() {
            DataAccess.loadAvailableModelTags(vis.sessionInfo());
            //document.getElementById("toggleButtonMoreTags").innerText = "See More";
            //document.getElementById("toggleButtonLessTags").innerText = "See Less";
        });

	  //showing more checkboxes (for queries, tags and 'more like')
        d3.select('#toggleButtonMoreQueries').on('click', function() {
            DataAccess.loadAvailableQueries(vis.sessionInfo());
            CrawlerVis.prototype.updateButtonMoreQueries(vis.sessionInfo());
            /*if(nroQueries<nroMaxQueries && (nroQueries+5)<=nroMaxQueries  && nroMaxQueries>5){
              nroQueries = nroQueries + 5;
              DataAccess.loadAvailableQueries(vis.sessionInfo());
              document.getElementById("toggleButtonMoreQueries").innerText = "See More";
              document.getElementById("toggleButtonLessQueries").innerText = "See Less";
            }
            else{
              nroQueries = nroMaxQueries;
              DataAccess.loadAvailableQueries(vis.sessionInfo());
              document.getElementById("toggleButtonMoreQueries").innerText = "";
              if(nroQueries>5)document.getElementById("toggleButtonLessQueries").innerText = "See Less";
            }*/

        });
	  //showing more checkboxes (for queries, tags and 'more like')
        d3.select('#toggleButtonMoreTags').on('click', function() {
            if(nroTags<nroMaxTags && (nroTags+initialCheckBox)<=nroMaxTags  && nroMaxTags>initialCheckBox){
              nroTags = nroTags + initialCheckBox;
              DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
              document.getElementById("toggleButtonMoreTags").innerText = "See More";
              document.getElementById("toggleButtonLessTags").innerText = "See Less";
            }
            else{
              nroTags = nroMaxTags;
              DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
              document.getElementById("toggleButtonMoreTags").innerText = "";
              if(nroTags>initialCheckBox)document.getElementById("toggleButtonLessTags").innerText = "See Less";
            }
        });
	  //Showing less checkboxes (for queries, tags and 'more like')
        d3.select('#toggleButtonLessQueries').on('click', function() {
            var lessQueries = nroQueries-initialCheckBox;
            if(nroQueries>initialCheckBox && lessQueries>=0){
              nroQueries = lessQueries; //nroQueries -lessQueries;
              document.getElementById("toggleButtonMoreQueries").innerText = "See More";
              if(nroQueries<=initialCheckBox){
                nroQueries=initialCheckBox;
                DataAccess.loadAvailableQueries(vis.sessionInfo());
                document.getElementById("toggleButtonLessQueries").innerText = "";}
              else {
                DataAccess.loadAvailableQueries(vis.sessionInfo());
                document.getElementById("toggleButtonLessQueries").innerText = "See Less";}
            }
            else{
              DataAccess.loadAvailableQueries(vis.sessionInfo());
              document.getElementById("toggleButtonLessQueries").innerText = "";
            }
        });

	  //Showing less checkboxes (for queries, tags and 'more like')
        d3.select('#toggleButtonLessTags').on('click', function() {
            var lessTags = nroTags-initialCheckBox;
            if(nroTags>initialCheckBox && lessTags>=0){
              nroTags = nroTags -lessTags;
              DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
              document.getElementById("toggleButtonMoreTags").innerText = "See More";
              if(nroTags==initialCheckBox)document.getElementById("toggleButtonLessTags").innerText = "";
              else document.getElementById("toggleButtonLessTags").innerText = "See Less";
            }
            else{
              DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');
              document.getElementById("toggleButtonLessTags").innerText = "";
            }
        });

};


CrawlerVis.prototype.onLoadedQueries = function(queries) {
  var vis = this;
  vis.queries = queries;
  vis.enableQuerySelection(queries);
};

CrawlerVis.prototype.onLoadedTags = function(result) {
  var vis = this;
  vis.enableTagSelection(result['tags'], result['event']);
};

CrawlerVis.prototype.onLoadedModelTags = function(modelTags) {
  var vis = this;
  vis.enableModelTagSelection(modelTags);
};

CrawlerVis.prototype.onLoadedTagColors = function(colors_data) {
  if(colors_data != undefined) {
    this.tag_colors = colors_data["colors"];
    this.color_index = colors_data["index"];
  }
  else {
    this.tag_colors={};
    this.color_index = 0;
  }
};
// Updates tags checkbox list with new tag.
CrawlerVis.prototype.updateNewTagLoaded = function(flag_newTags){
  flag_newTag = flag_newTags;
  var session = this.sessionInfo();
  //DataAccess.loadAvailableTags(session, 'Tags');
};


// Updates pages and terms from filter buttons or filter criteria(Filter Data).
CrawlerVis.prototype.updateVisualization = function(vis){
    vis.pagesGallery.clear();
    var session = vis.sessionInfo();
    DataAccess.update(session);
};

CrawlerVis.prototype.enableTagSelection = function(tags, event){
  var vis = this;
  vis.tags = tags;

  if(event == 'Tags'){
    var pageRetrievalCriteria = d3.select('#page_retrieval_criteria_select').node().value;
    if(pageRetrievalCriteria === "More like"){
      delete vis.tags['Neutral']

    }
    var prev_checked_tags = vis.getCheckedValues("tags_checkbox");
    var check_all = false;
    if (prev_checked_tags.indexOf('select_all') > -1)
    check_all = true;

    $('#tagsCheckBox').empty();

    var newli_select_all = document.createElement('li');
    if(check_all)
    newli_select_all.innerHTML = "<input type='checkbox' name='tags_checkbox' id='select_all_tags' value='select_all' checked='true'><label for='select_all'>Select All</label>";
    else
    newli_select_all.innerHTML = "<input type='checkbox' name='tags_checkbox' id='select_all_tags' value='select_all'><label for='select_all'>Select All</label>";

    document.getElementById('tagsCheckBox').appendChild(newli_select_all);

    d3.select('#select_all_tags').on('click', function(){
      checkboxes = document.getElementsByName('tags_checkbox');
      for (var checkbox in checkboxes){
        checkboxes[checkbox].checked = this.checked;
      }
    });

    tags = vis.tags;
    // Sort the queries by number of documents
    keysSorted = Object.keys(tags).sort(function(a,b){
      return tags[b] - tags[a]
    });

    var count;
    nroMaxTags = keysSorted.length;
    if(flag_newTag && nroMaxTags<=initialCheckBox){
        nroTags=keysSorted.length;}
    else{
      if(prev_checked_tags.length>nroTags && prev_checked_tags.length>0)
        nroTags=prev_checked_tags.length;
      if(keysSorted.length<nroTags)
        nroTags=keysSorted.length;
    }
    for (count = 0; count < nroTags; count++) {//keysSorted.length
      var checked = false;
      if (prev_checked_tags.indexOf(keysSorted[count]) > -1)
      checked = true;
      var newli = document.createElement('li');
      var label = "tag_" + count.toString();
      if(check_all || checked){
        newli.innerHTML = "<input type='checkbox' name='tags_checkbox' checked='true' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
      }
      else{
        newli.innerHTML = "<input type='checkbox' name='tags_checkbox' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
      }
      document.getElementById('tagsCheckBox').appendChild(newli);
    }
    //  });
  }
  if(event == 'Model'){
    // Show the tags list modal
    //$('#modelSettingModal').modal("show");
  }
  $('#tagsCheckBox').show();

  $("input[name='tags_checkbox']").click(function() {
    CrawlerVis.prototype.updateVisualization(vis);
  });
  $("input[name='morelike_checkbox']").click(function() {
    CrawlerVis.prototype.updateVisualization(vis);
  });

  if(changeDomainTag || flag_newTag){
    CrawlerVis.prototype.updateChangeDomainButtonMoreTags(vis.sessionInfo());
  }changeDomainTag =false; flag_newTag=false;



};

CrawlerVis.prototype.enableModelTagSelection = function(tags){
    var vis = this;
    vis.modelTags = tags;

    var pageRetrievalCriteria = d3.select('#page_retrieval_criteria_select').node().value;

    var prev_checked_tags = vis.getCheckedValues("model_tags_checkbox");
    var check_all = false;
    if (prev_checked_tags.indexOf('select_all') > -1)
    check_all = true;

    $('#modelTagsCheckBox').empty();

    var newli_select_all = document.createElement('li');
    if(check_all)
    newli_select_all.innerHTML = "<input type='checkbox' name='model_tags_checkbox' id='select_all_Modeltags' value='select_all' checked='true'><label for='select_all'>Select All</label>";
    else
    newli_select_all.innerHTML = "<input type='checkbox' name='model_tags_checkbox' id='select_all_Modeltags' value='select_all'><label for='select_all'>Select All</label>";

    document.getElementById('modelTagsCheckBox').appendChild(newli_select_all);

    d3.select('#select_all_Modeltags').on('click', function(){
      checkboxes = document.getElementsByName('model_tags_checkbox');
      for (var checkbox in checkboxes){
        checkboxes[checkbox].checked = this.checked;
      }
    });

    // Sort the queries by number of documents
    keysSorted = Object.keys(tags).sort(function(a,b){
      return tags[b] - tags[a]
    });

    var count;
    var nroMaxModelTags = keysSorted.length;

    /*if(prev_checked_tags.length>nroTags && prev_checked_tags.length>0)
      nroTags=prev_checked_tags.length;
    if(keysSorted.length<nroTags)
      nroTags=keysSorted.length;*/

    for (count = 0; count < nroMaxModelTags; count++) {//keysSorted.length
      var checked = false;
      if (prev_checked_tags.indexOf(keysSorted[count]) > -1)
      checked = true;
      var newli = document.createElement('li');
      var label = "tag_" + count.toString();
      if(check_all || checked){
        newli.innerHTML = "<input type='checkbox' name='model_tags_checkbox' checked='true' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
      }
      else{
        newli.innerHTML = "<input type='checkbox' name='model_tags_checkbox' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
      }
      document.getElementById('modelTagsCheckBox').appendChild(newli);
    }

  $('#modelTagsCheckBox').show();

  $("input[name='model_tags_checkbox']").click(function() {
    CrawlerVis.prototype.updateVisualization(vis);
  });
};

CrawlerVis.prototype.enableQuerySelection = function(queries){
  var vis = this;
  // Show the queries list modal
  //$('#listQueriesModal').modal("show");
  //$('#tagsCheckBox').hide(); // hide before tagsCheckBox

  var prev_checked_queries = vis.getCheckedValues("queries_checkbox");
  var check_all = false;
  if (prev_checked_queries.indexOf('select_all') > -1)
  check_all = true;

  $('#queryCheckBox').empty();

  var newli_select_all = document.createElement('li');
  if(check_all)
  newli_select_all.innerHTML = "<input type='checkbox' name='queries_checkbox' id='select_all_queries' value='select_all' checked='true'><label for='select_all'>Select All</label>";
  else
  newli_select_all.innerHTML = "<input type='checkbox' name='queries_checkbox' id='select_all_queries' value='select_all'><label for='select_all'>Select All</label>";

  document.getElementById('queryCheckBox').appendChild(newli_select_all);

  d3.select('#select_all_queries').on('click', function(){
    checkboxes = document.getElementsByName('queries_checkbox');
    for (var checkbox in checkboxes){
      checkboxes[checkbox].checked = this.checked;
    }
  });

  queries = vis.queries;
  // Sort the queries by number of documents
  keysSortedAux = Object.keys(queries).sort(function(a,b){
    return queries[b] - queries[a]
  });
    //sort the queries by checked state.
  /*  d3.selectAll("input[name=queries_checkbox]").on("click", function() {
      //user checked some query.
  });*/

    keysSorted = Object.keys(queries); //keysSortedAux
    var swap = true;
    var j = 0;
    while (swap) {
        swap = false;
        j++;
        for (var i = 0; i < keysSorted.length - j; i++) {
            if ( ( !(prev_checked_queries.indexOf(keysSorted[i]) > -1) && (prev_checked_queries.indexOf(keysSorted[i+1]) > -1) )  || ( !(prev_checked_queries.indexOf(keysSorted[i]) > -1) && (flag_newQuery && (keysSorted[i+1]==value_newQuery)) ) ) {
                var tmp = keysSorted[i];
                keysSorted[i] = keysSorted[i + 1];
                keysSorted[i + 1] = tmp;
                swap = true;
            }
        }
    }

  var count,i;
  var newliAux = [];
  nroMaxQueries=keysSorted.length;
  //

  if(flag_newQuery && nroMaxQueries<=initialCheckBox){
      nroQueries=keysSorted.length;}
  else{
    if(prev_checked_queries.length>nroQueries && prev_checked_queries.length>0)
      nroQueries=prev_checked_queries.length;
    if(keysSorted.length<nroQueries)
      nroQueries=keysSorted.length;
  }

  for (count = 0; count < nroQueries; count++) { // keysSorted.length
    var checked = false;
    if (prev_checked_queries.indexOf(keysSorted[count]) > -1)
    checked = true;
    var newli = document.createElement('li');
    var label = "query_" + count.toString();
    if(check_all || checked){
      newli.innerHTML = "<input type='checkbox' name='queries_checkbox' checked='true' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+queries[keysSorted[count]]+")"+"</label>";
    }else{
      if(flag_newQuery && keysSorted[count]==value_newQuery) {
        newli.innerHTML = "<input type='checkbox' name='queries_checkbox' checked='true' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+queries[keysSorted[count]]+")"+"</label>";
      }
      else newli.innerHTML ="<input type='checkbox' name='queries_checkbox' 'id='" + label +"' value='"+keysSorted[count]+"'><label for='"+label+"'>"+keysSorted[count]+" ("+queries[keysSorted[count]]+")"+"</label>";
    }
    document.getElementById('queryCheckBox').appendChild(newli);
  }
    if(flag_newQuery){
      CrawlerVis.prototype.updateVisualization(vis);
    }

    value_newQuery="";

    $('#queryCheckBox').show();

    $("input[name='queries_checkbox']").click(function() {
      CrawlerVis.prototype.updateVisualization(vis);
    });
    if(changeDomainQuery || flag_newQuery){
      CrawlerVis.prototype.updateNewQueryButtonMoreQueries(vis.sessionInfo());
    }changeDomainQuery=false;
    flag_newQuery=false;


};


CrawlerVis.prototype.getCheckedValues = function(source){
  var selected_queries = [];
  checkboxes = document.getElementsByName(source);
  var index;
  for (index = 0; index < checkboxes.length; index++){

    if(checkboxes[index].checked){
      selected_queries.push(checkboxes[index].value);
    }
  }
  return selected_queries;
};

// Initializes statistics about crawler: number of positive/negative pages,
// exploited/explored/pending for visualization.
CrawlerVis.prototype.initStatslist = function() {
  this.statslist = new Statslist('statslist');
};


// Initializes statistics resulting from filter: number of positive/negative pages,
// exploited/explored/pending for visualization.
CrawlerVis.prototype.initFilterStatslist = function() {
  this.filterStatslist = new Statslist('filter_statslist');
};


// Responds to loaded new pages summary signal (crawler vis).
CrawlerVis.prototype.onLoadedNewPagesSummaryCrawler = function(summary, isFilter) {
  var stats = isFilter ? this.filterStats : this.stats;
  var statslist = isFilter ? this.filterStatslist : this.statslist;

  // All explored and exploited pages are reported as new pages.
  var pos = stats['Positive'];
  var neg = stats['Negative'];
  pos['New'] =
  summary['Positive']['Exploited']
  + summary['Positive']['Explored'];
  neg['New'] =
  summary['Negative']['Exploited']
  + summary['Negative']['Explored'];

  // Updates UI element that reports pages statistics.
  this.updatePagesStatsCrawler(stats, statslist);
};


// Responds to loaded pages summary until last update (crawler vis).
CrawlerVis.prototype.onLoadedPreviousPagesSummaryCrawler = function(summary, isFilter) {
  var stats = isFilter ? this.filterStats : this.stats;
  var statslist = isFilter ? this.filterStatslist : this.statslist;

  for (var t in {'Positive': 1, 'Negative': 1}) {
    stats[t]['Explored'] = summary[t]['Explored'];
    stats[t]['Exploited'] = summary[t]['Exploited'];
    stats[t]['Boosted'] = summary[t]['Boosted'];
    // Computes total.
    stats[t]['Total'] = stats[t]['Explored'] + stats[t]['Exploited'];
  }

  // Updates UI element that reports pages statistics.
  this.updatePagesStatsCrawler(stats, statslist);
};


// Updates UI element that reports pages statistics.
CrawlerVis.prototype.updatePagesStatsCrawler = function(stats, statslist) {
  var pos = stats['Positive'];
  var neg = stats['Negative'];
  statslist.setEntries([
    {'name': 'Positive pages', 'Explored': pos['Explored'], 'Exploited': pos['Exploited'], 'New': pos['New'], 'label': 'Positive'},
    {'name': 'Negative pages', 'Explored': neg['Explored'], 'Exploited': neg['Exploited'], 'New': neg['New'], 'label': 'Negative'},
  ]);

  // Sets maximum bar width for Positive/Negative pages.
  var maxWidth = Math.max(
    pos['Explored'] + pos['Exploited'] + pos['New'],
    neg['Explored'] + neg['Exploited'] + neg['New']);
    statslist.setMaxBarTotal(maxWidth);

    d3.select('#goto_statistics')
    .classed('enabled', true)
    .classed('disabled', false);
  };

  var aux_new = 0; otherTags = 0;
  // Responds to loaded new pages summary signal.
  CrawlerVis.prototype.onLoadedNewPagesSummarySeedCrawler = function(summary, isFilter) {
    var stats = isFilter ? this.filterStats : this.stats;
    var statslist = isFilter ? this.filterStatslist : this.statslist;

    for (var t in summary) {
      if(t=='Relevant' || t=='Irrelevant' || t=='Neutral'){
      // t is in {Relevant, Irrelevant, Neutral}.
      stats[t]['New'] = summary[t];
      aux_new = stats['Neutral']['New']
      // Computes total.
      stats[t]['Total'] = stats[t]['Until Last Update'] + stats[t]['New'];}
    }
    otherTags = summary['OtherTags'];
    // Updates UI element that reports pages statistics.
    this.updatePagesStatsSeedCrawler(stats, statslist);
  };


  // Responds to loaded pages summary until last update (seed crawler vis).
  CrawlerVis.prototype.onLoadedPreviousPagesSummarySeedCrawler = function(summary, isFilter) {
    var stats = isFilter ? this.filterStats : this.stats;
    var statslist = isFilter ? this.filterStatslist : this.statslist;
    var total = 'Total';
    stats['Neutral']['New'] = stats['Neutral']['New']  + aux_new;
    for (var t in stats) {
      total_aux = total+t;
      // t is in {Relevant, Irrelevant, Neutral}.
      // Stores statistics until last update.
      stats[t]['TotalTags'] = summary[total_aux];
      stats[t]['Until Last Update'] = summary[t];
      // Computes total.
      stats[t]['Total'] = stats[t]['Until Last Update'] + stats[t]['New'];
    }
    otherTags = summary['OtherTags'];
    // Updates UI element that reports pages statistics.
    this.updatePagesStatsSeedCrawler(stats, statslist);

    var session = CrawlerVis.prototype.sessionInfo();
    DataAccess.loadAvailableQueries(session);
    DataAccess.loadAvailableTags(session, 'Tags');
    CrawlerVis.prototype.updateNewQueryButtonMoreQueries(session);
  };


  // Updates UI element that reports pages statistics for seed crawler.
  CrawlerVis.prototype.updatePagesStatsSeedCrawler = function(stats, statslist) {
    var entries = [];
    for (var t in stats) {
      // t is in {Relevant, Irrelevant, Neutral}.
      entries.push({
        'name': t + ' pages',
        'Until Last Update': stats[t]['Until Last Update'],
        'New': stats[t]['New'],
        'TotalTags': stats[t]['TotalTags'],
        'Total': stats[t]['Total'],
        'label': t,
      });
    }
    var lazyUpdate = true;
    statslist.setEntries(entries, lazyUpdate);


    // Sets maximum bar width for Positive/Negative pages.
    var maxWidth = Math.max(
      stats['Neutral']['TotalTags'],
      Math.max(stats['Relevant']['TotalTags'], stats['Irrelevant']['TotalTags']));
      statslist.setMaxBarTotal(maxWidth);
      statslist.setOtherTagsTotal(otherTags);
      d3.select('#goto_statistics')
      .classed('enabled', true)
      .classed('disabled', false);

    aux_new = 0;
    otherTags = 0;
    };


    // Initializes word list: terms with frequency in Positive and Negative pages.
    CrawlerVis.prototype.initWordlist = function() {
      this.wordlist = new Wordlist('wordlist');
    };

    // Initializes pages landscape.
    CrawlerVis.prototype.initPagesLandscape = function(showBoostButton) {
      var vis = this;
      this.pagesLandscape = new PagesLandscape('#pages_landscape');

      // Registers action for click on update button.
      d3.select('#pages_landscape_update')
      .on('mouseover', function() {
        Utils.showTooltip();
      })
      .on('mousemove', function() {
        Utils.updateTooltip('Update view with new pages');
      })
      .on('mouseout', function() {
        Utils.hideTooltip();
      })
      .on('click', function() {
        if (!d3.select(this).classed('enabled')) {
          return;
        }
        // Updates pages and terms.
        DataAccess.update(vis.sessionInfo());
        vis.pagesGallery.clear();
      });


      if (showBoostButton) {
        // Registers action for click on boost button.
        d3.select('#pages_landscape_boost')
        .on('mouseover', function() {
          Utils.showTooltip();
        })
        .on('mousemove', function() {
          Utils.updateTooltip('Boost selected pages');
        })
        .on('mouseout', function() {
          Utils.hideTooltip();
        })
        .on('click', function() {
          if (!d3.select(this).classed('enabled')) {
            return;
          }
          // Boosts selected pages (items in the gallery).
          var selectedPages = vis.pagesGallery.getItems().map(function(item) {
            // TODO(cesar): use Page Id, not URL.
            return item.url;
          });
          DataAccess.boostPages(selectedPages);
        });
      }
    };


    // Initializes tags gallery.
    CrawlerVis.prototype.initTagsGallery = function(predefinedTags, tagsLogic) {
      this.tagsGallery = new TagsGallery('#tags_items', predefinedTags, tagsLogic);
    };


    // Initializes pages gallery (snippets for selected pages).
    CrawlerVis.prototype.initPagesGallery = function() {
      var vis = this;
      this.pagesGallery = new PagesGallery('#pages_items');
      this.pagesGallery.setCbIsTagRemovable(function(tag) {
        return vis.tagsGallery.isTagRemovable.call(vis.tagsGallery, tag);
      });
      this.pagesGallery.setCbGetExistingTags(function() {
        return vis.tagsGallery.getApplicableTags.call(vis.tagsGallery);
      });
    };


    // Load new pages when available at regular intervals
    CrawlerVis.prototype.loadNewPagesSummary = function(isFilter) {
      var vis = this;
      DataAccess.loadNewPagesSummary(isFilter, vis.sessionInfo());
    };

    // Initializes pages gallery (snippets for selected pages).
    CrawlerVis.prototype.initTermsSnippetsViewer = function() {
      this.termsSnippetsViewer = new SnippetsViewer('#terms_snippets_viewer');
    };


    // Responds to loaded terms summary signal.
    CrawlerVis.prototype.onLoadedTermsSummary = function(summary) {
      // Updates UI element that reports terms statistics.
      this.wordlist.setEntries(summary.map(function(w) {
        return {'word': w[0], 'posFreq': w[1], 'negFreq': w[2], 'tags': w[3]}
      }));

      // Sets maximum frequency for positive/negative frequencies to set bars width in wordlist.
      var maxPosFreq = d3.max(summary, function(w) { return w[1]; });
      var maxNegFreq = d3.max(summary, function(w) { return w[2]; });
      var maxFreq = Math.max(maxPosFreq, maxNegFreq);
      this.wordlist.setMaxPosNegFreq(maxFreq, maxFreq);

      // Resets terms snippets viewer.
      this.termsSnippetsViewer.clear();
    };

    // Responds to focus on a term.
    CrawlerVis.prototype.onTermFocus = function(term, onFocus) {
      if (onFocus) {
        var vis = this;
        DataAccess.loadTermSnippets(term, vis.sessionInfo());
      }
    };


    // Responds to toggle of a term.
    // Term format:
    // {'word': term, 'tags': [], ...}
    CrawlerVis.prototype.onTermToggle = function(term, shiftClick) {
      var vis = this;

      if (shiftClick) {
        // Responds to shift click on a term: adds word to query list.
        var boxElem = d3.select('#query_box').node();
        boxElem.value += ' ' + term['word'];
      } else {
        // State machine: Neutral -> Positive -> Negative -> Neutral.
        var tags = term['tags'];

        if (tags.indexOf("Custom") != -1)
        return;

        var isPositive = tags.indexOf('Positive') != -1;
        var isNegative = tags.indexOf('Negative') != -1;

        if (isPositive) {
          // It was positive, so it turns negative.
          DataAccess.setTermTag(term['word'], 'Positive', false, vis.sessionInfo());
          DataAccess.setTermTag(term['word'], 'Negative', true, vis.sessionInfo());

          // Removes tag 'Positive' from tags array, adds 'Negative'.
          tags.splice(tags.indexOf('Positive'), 1);
          tags.push('Negative');
        }
        else if (isNegative) {
          // It was Negative, so it turns Neutral.
          DataAccess.setTermTag(term['word'], 'Negative', false, vis.sessionInfo());

          // Removes tag 'Negative' from tags array.
          tags.splice(tags.indexOf('Negative'), 1);
        }
        else {
          // It was Neutral, so it turns Negative.
          DataAccess.setTermTag(term['word'], 'Positive', true, vis.sessionInfo());

          // Adds tag 'Positive' to tags array.
          tags.push('Positive');
        }
        // Updates wordlist.
        vis.wordlist.update();

        // Triggers update of snippets to update its tags.
        __sig__.emit(__sig__.term_focus, term['word'], true);
      }
    };


    // Responds to loaded terms snippets.
    CrawlerVis.prototype.onLoadedTermsSnippets = function(data) {
      var vis = this;

      var term = data.term;
      var tags = data.tags;
      var context = data.context;

      var termObj = {term: term, tags: tags};

      var termSnippets = [];
      $.each(context, function(url, context){
        var termSnippet = {};
        termSnippet['term'] = termObj;
        termSnippet['url'] = url;
        termSnippet['snippet'] = context;
        termSnippets.push(termSnippet);
      });

      var lazyUpdate = true;
      this.termsSnippetsViewer.clear(lazyUpdate);
      this.termsSnippetsViewer.addItems(termSnippets);
    };

// Update online classifier
CrawlerVis.prototype.updateOnlineClassifier = function() {
    var vis = this;
    DataAccess.updateOnlineClassifier(vis.sessionInfo());
};


    // Triggers page summary update after the pages are tagged
    CrawlerVis.prototype.onPagesTagsSet = function() {
      var vis = this;
      // Fetches statistics for until last update happened.
      DataAccess.loadPagesSummaryUntilLastUpdate(false, vis.sessionInfo());
      DataAccess.loadPagesSummaryUntilLastUpdate(true, vis.sessionInfo());
    }

    // Responds to tag focus.
    CrawlerVis.prototype.onTagFocus = function(tag, onFocus) {
      // TODO(cesar): focus+context on pages landscape when tag is highlighted.
      console.log('tag highlighted: ', tag, onFocus ? 'gained focus' : 'lost focus');
    };

   // Display new model accuracy
   CrawlerVis.prototype.onUpdatedOnlineClassifier = function(accuracy) {
       var vis = this;
       // Updates last update and accuracy.
       if (accuracy != '0') {
	   var lastUpdate = Utils.parseDateTime(DataAccess.getLastUpdateTime());
	   d3.select('#last_update_info_box')
	       .html('(Domain Model Accuracy: ' + accuracy + '%<br>Last Update: ' + lastUpdate + ')');
       } else {
	   var lastUpdate = Utils.parseDateTime(DataAccess.getLastUpdateTime());
	   d3.select('#last_update_info_box')
	       .html('(Domain Model Accuracy: NA, <br>Last Update: ' + lastUpdate + ')');
       }
       DataAccess.loadAvailableModelTags(vis.sessionInfo());
       //document.getElementById("toggleButtonMoreTags").innerText = "See More";
       //document.getElementById("toggleButtonLessTags").innerText = "See Less";
   }

   // Responds to loaded pages signal.
   CrawlerVis.prototype.onLoadedPages = function(pagesData) {
       if (pagesData["pages"].length === 0){
	   BokehPlots.clear();
	   return {};
       } else {
	   var pages = pagesData['pages'].map(function(page, i) {
	       return {
		   url: page[0],
		   x: page[1],
		   y: page[2],
		   tags: page[3],
	       };
	   });

	   this.pagesLandscape.setPagesData(pages);

	   var vis = this;
	   // Fetches statistics for until last update happened.
	   DataAccess.loadPagesSummaryUntilLastUpdate(false, vis.sessionInfo());
	   DataAccess.loadPagesSummaryUntilLastUpdate(true, vis.sessionInfo());
	   return pages;
       }
   };

    // Responds to clicked tag.
    CrawlerVis.prototype.onTagClicked = function(tag) {
      // TODO(cesar): Keep tagged pages on landscape in focus.
      console.log('tag clicked: ', tag);
    };


    // Responds to clicked tag action.
    CrawlerVis.prototype.onTagActionClicked = function(tag, action, opt_items, refresh_plot) {
      var vis = this;

      // If items is empty array, applies action to selected pages in the landscape.
      if (!opt_items || opt_items.length == 0) {
        opt_items = this.pagesLandscape.getSelectedItems();
      }

      // Apply or remove tag from urls.
      var applyTagFlag = action == 'Apply';
      var urls = [];
      var updated_tags = {};
      var update_color_index = false;

      for (var i in opt_items) {
        var item = opt_items[i];
        var tags = item.tags;
        var color = item.color;

        // Removes tag when the tag is present for item, and applies only when tag is not present for
        // item.
        var isTagPresent = item.tags.some(function(itemTag) {
          return itemTag == tag;
        });
        if ((applyTagFlag && !isTagPresent) || (!applyTagFlag && isTagPresent)) {
          urls.push(item.url);

          // Updates tag list for items.
          if (applyTagFlag) {
            if(tags.indexOf("") >= 0){
              tags.splice(tags.indexOf(""), 1);
            }
            tags.push(tag);
            current_tag = tag;

          } else {
            tags.splice(tags.indexOf(tag), 1);
            current_tag = tags[tags.length - 1]

          }

          // Set color
          if(current_tag == "Relevant"){
            color = "blue";
          } else if(current_tag == "Irrelevant"){
            color = "crimson";
          } else if(current_tag == "Neutral" || current_tag == "" || current_tag == undefined){
            color = "#7F7F7F";
          } else {
            if(current_tag in vis.tag_colors){
              color = vis.tag_colors[current_tag];
            }
            else {
              color = vis.CUSTOM_COLORS[vis.color_index];
              update_color_index = true;
              vis.tag_colors[tag] = vis.CUSTOM_COLORS[vis.color_index];
            }
          }

          // Track the updated tags to update the bokeh plot data
          updated_tags[item.url] = {"color": color};
          updated_tags[item.url]["tags"] = tags;
        }
      }

      if(update_color_index){
        vis.color_index = (vis.color_index + 1) % vis.CUSTOM_COLORS.length;
        var colors = [];
        for(var tag_color in vis.tag_colors){
          colors.push(tag_color+";"+vis.tag_colors[tag_color]);
        }
        var update_colors = {"index": vis.color_index, "colors": colors};
        DataAccess.updateColors(vis.sessionInfo(), update_colors);
      }

      if (urls.length > 0) {
        DataAccess.setPagesTag(urls, tag, applyTagFlag, vis.sessionInfo());
      }

      BokehPlots.updateData(updated_tags);
    };


    // Responds to clicked tag action for individual page.
    CrawlerVis.prototype.onTagIndividualPageActionClicked = function(tag, action, item) {
      this.tagsGallery.applyOrRemoveTag(tag, action, [item]);
    };

    /**
    * Responds to new brushing for pages.
    */
    CrawlerVis.prototype.onBrushedPagesChanged = function(indexOfSelectedItems) {
      var pages = this.pagesLandscape.getPagesData();
      var selectedPages = indexOfSelectedItems.map(function (index) {
        return pages[index];
      });
      this.pagesGallery.setItems(selectedPages);

      // Updates button used to boost selected items in pages landscape.
      d3.select('#pages_landscape_boost')
      .classed('enabled', indexOfSelectedItems.length > 0)
      .classed('disabled', indexOfSelectedItems.length == 0);
    };

    CrawlerVis.prototype.crawlPages = function(selectedURLs, crawl_type) {
      var vis = this;
      DataAccess.crawlPages(selectedURLs, crawl_type, vis.sessionInfo());
    }

    /**
    * Initializes addc crawler button
    */
    CrawlerVis.prototype.initAddCrawlerButton = function() {
      var vis = this;
      var submit_add_domain = function() {
        var value = d3.select('#crawler_index_name').node().value;
        __sig__.emit(__sig__.add_crawler, value);

        // Hide domain modal after domain has been submitted.
        $("#addDomainModal").modal("hide");
      };

      var submit_del_domain = function() {
        var checked_domains = {};
        d3.selectAll("input[name='domains_checkbox']:checked").each(function(){
          checked_domains[this.id] = this.value;
        });

        __sig__.emit(__sig__.del_crawler, checked_domains)

        // Hide domain modal after domain has been submitted.
        $("#delDomainModal").modal("hide");
      };

      d3.select('#crawler_index_name').on('change', submit_add_domain);
      d3.select('#submit_add_crawler').on('click', submit_add_domain);
      d3.select('#submit_del_crawler').on('click', submit_del_domain);
    };

    /**
    * Initializes query web button (useful for seed crawler vis).
    */
    CrawlerVis.prototype.initQueryWebButton = function() {
      var search_enter = function() {
        var value = d3.select('#query_box').node().value;
        __sig__.emit(__sig__.query_enter, value);
        setTimeout(function(){ CrawlerVis.prototype.updateFilterData(value);}, 5000);
      };

      $( "#query_box" ).on( "keydown", function(event) {
        if(event.which == 13) {
          search_enter();
        }
      });

      d3.select('#submit_query')
      .on('click', search_enter);

      // Initializes history of queries.
      this.queriesList = [];
    };



    CrawlerVis.prototype.initAddTermButton = function() {
      d3.select('#add_term_button')
      .on('mouseover', function() {
        Utils.showTooltip();
      })
      .on('mousemove', function() {
        Utils.updateTooltip('Add custom relevant terms');
      })
      .on('mouseout', function() {
        Utils.hideTooltip();
      })
      .on('click', function() {
        var value = d3.select('#add_term_box').node().value;
        __sig__.emit(__sig__.add_term, value);
      });
      d3.select('#add_term_neg_button')
      .on('mouseover', function() {
        Utils.showTooltip();
      })
      .on('mousemove', function() {
        Utils.updateTooltip('Add custom irrelevant terms');
      })
      .on('mouseout', function() {
        Utils.hideTooltip();
      })
      .on('click', function() {
        var value = d3.select('#add_term_box').node().value;
        __sig__.emit(__sig__.add_neg_term, value);
      });

    };


    /**
    * Initializes filter button.
    */
    CrawlerVis.prototype.initFilterButton = function() {
      var vis = this;
      var submit_filter = function() {
          var value = d3.select('#filter_box').node().value;
        __sig__.emit(__sig__.filter_enter, value);
      };

      d3.select('#filter_box')
      .on('change', submit_filter);

      d3.select('#submit_filter')
      .on('click', submit_filter);
      // Initializes history of filters.
      this.filtersList = [];
    };

    /**
    * Initializes filter button.
    */
    CrawlerVis.prototype.initModelButton = function() {
      var vis = this;
      d3.select('#build_model')
      .on('mouseover', function() {
        Utils.showTooltip();
      })
      .on('mousemove', function() {
        Utils.updateTooltip('Generate and download page classifier crawler model');
      })
      .on('mouseout', function() {
        Utils.hideTooltip();
      })

      .on('click', function() {
        vis.createModelData();
      });

      d3.select('#ModelSettings').on('click', function() {
        //DataAccess.loadAvailableTags(vis.sessionInfo(), 'Model');
      });

      $('#modelSettingsModal').on('shown.bs.modal', function(){

        var prev_pos_checked_tags = vis.getCheckedValues("posTagsCheckBox");
        var prev_neg_checked_tags = vis.getCheckedValues("negTagsCheckBox");
        var pos_check_all = false;
        var neg_check_all = false;
        if (prev_pos_checked_tags.indexOf('select_all') > -1)
        pos_check_all = true;
        if (prev_neg_checked_tags.indexOf('select_all') > -1)
        neg_check_all = true;


        $('#posTagsCheckBox').empty();
        $('#negTagsCheckBox').empty();

        var newli_pos_select_all = document.createElement('li');
        if(pos_check_all)
        newli_pos_select_all.innerHTML = "<input type='checkbox' name='posTagsCheckBox' id='pos_select_all' value='select_all' checked='true'><label for='select_all'>Select All</label>";
        else
        newli_pos_select_all.innerHTML = "<input type='checkbox' name='posTagsCheckBox' id='pos_select_all' value='select_all'><label for='select_all'>Select All</label>";

        document.getElementById('posTagsCheckBox').appendChild(newli_pos_select_all);

        d3.select('#pos_select_all').on('click', function(){
          checkboxes = document.getElementsByName('posTagsCheckBox');
          for (var checkbox in checkboxes){
            checkboxes[checkbox].checked = this.checked;
          }
        });

        var newli_neg_select_all = document.createElement('li');
        if(neg_check_all)
        newli_neg_select_all.innerHTML = "<input type='checkbox' name='negTagsCheckBox' id='neg_select_all' value='select_all' checked='true'><label for='select_all'>Select All</label>";
        else
        newli_neg_select_all.innerHTML = "<input type='checkbox' name='negTagsCheckBox' id='neg_select_all' value='select_all'><label for='select_all'>Select All</label>";

        document.getElementById('negTagsCheckBox').appendChild(newli_neg_select_all);

        d3.select('#neg_select_all').on('click', function(){
          checkboxes = document.getElementsByName('negTagsCheckBox');
          for (var checkbox in checkboxes){
            checkboxes[checkbox].checked = this.checked;
          }
        });

        tags = vis.tags;
        // Sort the tags by number of documents
        keysSorted = Object.keys(tags).sort(function(a,b){
          return tags[b] - tags[a]
        });

        var count;
        for (count = 0; count < keysSorted.length; count++) {
          if(keysSorted[count] != 'Irrelevant'){
            var pos_checked = false;
            if (prev_pos_checked_tags.indexOf(keysSorted[count]) > -1 || keysSorted[count] == 'Relevant')
            pos_checked = true;
            var newli_pos = document.createElement('li');
            var pos_label = "pos_tag_" + count.toString();
            if(pos_check_all || pos_checked)
            newli_pos.innerHTML = "<input type='checkbox' name='posTagsCheckBox' checked='true' 'id='" + pos_label +"' value='"+keysSorted[count]+"'><label for='"+pos_label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
            else
            newli_pos.innerHTML = "<input type='checkbox' name='posTagsCheckBox' 'id='" + pos_label +"' value='"+keysSorted[count]+"'><label for='"+pos_label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
            document.getElementById('posTagsCheckBox').appendChild(newli_pos);
          }

          if(keysSorted[count] != 'Relevant'){
            var neg_checked = false;
            if (prev_neg_checked_tags.indexOf(keysSorted[count]) > -1  || keysSorted[count] == 'Irrelevant')
            neg_checked = true;
            var newli_neg = document.createElement('li');
            var neg_label = "neg_tag_" + count.toString();
            if(neg_check_all || neg_checked)
            newli_neg.innerHTML = "<input type='checkbox' name='negTagsCheckBox' checked='true' 'id='" + neg_label +"' value='"+keysSorted[count]+"'><label for='"+neg_label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
            else
            newli_neg.innerHTML = "<input type='checkbox' name='negTagsCheckBox' 'id='" + neg_label +"' value='"+keysSorted[count]+"'><label for='"+neg_label+"'>"+keysSorted[count]+" ("+tags[keysSorted[count]]+")"+"</label>";
            document.getElementById('negTagsCheckBox').appendChild(newli_neg);
          }
        }
      });

    };

    CrawlerVis.prototype.createModelData = function() {
      var vis = this;
      document.getElementById("status_panel").innerHTML = 'Building domain model...';
      $(document).ready(function() { $(".status_box").fadeIn(); });
      $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
      DataAccess.createModelData(vis.sessionInfo());
    }

    /**
    * Initializes calendar button.
    */
    CrawlerVis.prototype.initFromCalendarButton = function() {
      var vis = this;
      $("#from_datetimepicker").datetimepicker({
        icons:{
          time: "glyphicon glyphicon-time",
          date: "glyphicon glyphicon-calendar"
        }
      });
    };

    /**
    * Initializes calendar button.
    */
    CrawlerVis.prototype.initToCalendarButton = function() {
      var vis = this;
      $('#to_datetimepicker').datetimepicker({
        icons:{
          time: "glyphicon glyphicon-time",
          date: "glyphicon glyphicon-calendar"
        }
      });
    };

    // Creates select to limit number of pages to load.
    CrawlerVis.prototype.createSelectForFilterPageCap = function() {
      var vis = this;
      //var selectBox = d3.select('#filter_cap_select');
      var selectBox = d3.select('#filter_cap_select').on('change', function() {
        CrawlerVis.prototype.updateVisualization(vis);
      });

      var getElementValue = function(d) {
        return d;
      };
      // Some options.
      var data = [10, 50, 100, 250, 500, 1000, 2000];
      var options = selectBox.selectAll('option').data(data);
      options.enter().append('option');
      options
      .attr('value', getElementValue)
      .text(function(d, i) {
        return d;
      });

      $('#filter_cap_select').val(100);
      cap = d3.select('#filter_cap_select').node().value;


    };

    /**
    * Applies query (useful for seed crawler vis).
    */
    CrawlerVis.prototype.applyQuery = function(terms) {
      var vis = this;
      DataAccess.queryWeb(terms, vis.sessionInfo());
    };

    /**
    * Download pages of uploaded urls
    */
    CrawlerVis.prototype.downloadUrls = function(urls) {
      var vis = this;
      DataAccess.downloadUrls(urls, vis.sessionInfo());

    };

    /**
    * Submit user-defined seeds.
    */
    $("#createSeeds").submit(function(event){
      event.preventDefault();
      file = event.target.seeds.files[0]
      var text = undefined;
      if(file != undefined && file != ""){
        reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
          text = reader.result;
          text += event.target.seeds_text.value;
          if(text != undefined && text != ""){
            CrawlerVis.prototype.downloadUrls(text);
            setTimeout(function(){ CrawlerVis.prototype.updateFilterData('uploaded');}, 5000);
          }
        }
      } else {
        text = event.target.seeds_text.value;
        if(text != undefined && text != ""){
          CrawlerVis.prototype.downloadUrls(text);
          setTimeout(function(){ CrawlerVis.prototype.updateFilterData('uploaded');}, 5000);
        }
      }


    });

    /**
    * Add crawler
    */
    CrawlerVis.prototype.addCrawler = function(index_name) {
      DataAccess.addCrawler(index_name);
    };


    CrawlerVis.prototype.addTerm = function(term) {
      var vis = this;
      vis.wordlist.addEntries([{'word': term, 'posFreq': 0, 'negFreq': 0, 'tags': ["Positive", "Custom"]}]);

      DataAccess.setTermTag(term, 'Positive;Custom', true, vis.sessionInfo());
    };

    CrawlerVis.prototype.addNegTerm = function(term) {
      var vis = this;
      vis.wordlist.addEntries([{'word': term, 'posFreq': 0, 'negFreq': 0, 'tags': ["Negative", "Custom"]}]);
      DataAccess.setTermTag(term, 'Negative;Custom', true, vis.sessionInfo());
    };

    CrawlerVis.prototype.deleteTerm = function(term) {
      var vis = this;
      DataAccess.deleteTerm(term, vis.sessionInfo());
    };


    /**
    * Runs query (useful for seed crawler vis).
    */
    CrawlerVis.prototype.runQuery = function(terms) {
      this.applyQuery(terms);

      // Appends terms to history of queries.
      this.queriesList =
      this.appendToHistory('#query_box_previous_queries', this.queriesList, terms);

          //  DataAccess.loadAvailableTags(session, 'Tags');
      //DataAccess.loadAvailableQueries(this.sessionInfo()); //reload the queries
    };

    /**
    * Runs query (useful for seed crawler vis).
    */
    CrawlerVis.prototype.runAddCrawler = function(index_name) {
      if (index_name === ""){
        document.getElementById("status_panel").innerHTML = 'Enter a valid domain name';
        $(document).ready(function() { $(".status_box").fadeIn(); });
        $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
      }
      else this.addCrawler(index_name);
    };

    /**
    * Runs query (useful for seed crawler vis).
    */
    CrawlerVis.prototype.runDelCrawler = function(domains) {
      this.setCurrentCrawler(undefined);
      DataAccess.delCrawler(domains);
    };


    /**
    * Run Add Term
    */

    CrawlerVis.prototype.runAddTerm = function(term) {
      if (term === ""){
        document.getElementById("status_panel").innerHTML = 'Enter a valid term';
        $(document).ready(function() { $(".status_box").fadeIn(); });
        $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
      }
      else this.addTerm(term);
    };

    /**
    * Run Add Neg Term
    */

    CrawlerVis.prototype.runAddNegTerm = function(term) {
      if (term === ""){
        document.getElementById("status_panel").innerHTML = 'Enter a valid term';
        $(document).ready(function() { $(".status_box").fadeIn(); });
        $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
      }
      else this.addNegTerm(term);
    };

    /**
    * Run Delete Term
    */

    CrawlerVis.prototype.runDeleteTerm = function(term) {
      this.deleteTerm(term);
    };

    /**
    * Applies filter.
    */
    CrawlerVis.prototype.applyFilter = function(terms) {
      var vis = this;
      if (terms != undefined && terms != ""){
        document.getElementById("status_panel").innerHTML = 'Applying filter...';
        $(document).ready(function() { $(".status_box").fadeIn(); });
        $(document).ready(setTimeout(function() {$('.status_box').fadeOut('fast');}, 5000));
        // Applies filter and issues an update automatically.
        DataAccess.update(vis.sessionInfo());
      }
    };

    /**
    * Runs filter.
    */
    CrawlerVis.prototype.runFilter = function(terms) {
      this.applyFilter(terms);

      // Appends terms to history of filters.
      this.filtersList =
      this.appendToHistory('#filter_box_previous_filters', this.filtersList, terms);
    };


    /**
    * Appends terms to history of queries/filters.
    * Returns new history.
    */
    CrawlerVis.prototype.appendToHistory = function(elementSelector, history, queryTerms) {
      // Appends terms to history of queries/filters.
      var newHistory = [queryTerms].concat(history);
      var previousQueries = d3.select(elementSelector).selectAll('option')
      .data(newHistory, function(d, i) { return queryTerms + '-' + i; });
      previousQueries.enter().append('option');
      previousQueries.exit().remove();
      previousQueries
      .attr('label', function(queryTerms) {
        return queryTerms;
      })
      .attr('value', function(queryTerms) {
        return queryTerms;
      });
      return newHistory;
    };

    // Return all the session info
    CrawlerVis.prototype.sessionInfo = function() {
      var vis = this;

      var session = {};

      var search_engine = d3.select('#search_engine').node().value;
      session['search_engine'] = search_engine;

      var algId = d3.select('#selectProjectionAlgorithm').node().value;
      session['activeProjectionAlg'] = algId;

	var domainId = d3.select('input[name="crawlerRadio"]:checked').node() ? d3.select('input[name="crawlerRadio"]:checked').node().value : undefined;
      session['domainId'] = domainId;

      var cap = d3.select('#filter_cap_select').node().value;
      session['pagesCap'] = cap;

      var fromdate_local = new Date(d3.select('#fromdate').node().value);
      var todate_local = new Date(d3.select('#todate').node().value);

      if (fromdate_local != "Invalid Date")
      var fromdate_utc = Utils.toUTC(fromdate_local);
      else fromdate_utc = null;
      if (todate_local != "Invalid Date")
      var todate_utc = Utils.toUTC(todate_local);
      else todate_utc = null;

      session['fromDate'] = fromdate_utc;
      session['toDate'] = todate_utc;

	var filterTerms = d3.select('#filter_box').node().value;
      if (filterTerms === '')
	  filterTerms = null;
      session['filter'] = filterTerms;

      var pageRetrievalCriteria = d3.select('#page_retrieval_criteria_select').node().value;
      session['pageRetrievalCriteria'] = pageRetrievalCriteria;
      //design new interface (including queries, tags, most like checkboxs)

      session['selected_morelike']=vis.getCheckedValues('morelike_checkbox').toString();

      if (vis.getCheckedValues('queries_checkbox').toString()== "" && vis.getCheckedValues('tags_checkbox').toString() == "" && vis.getCheckedValues('model_tags_checkbox').toString() == ""){
        $('#selectPageRetrievalCriteria').val("Most Recent");
        session['pageRetrievalCriteria'] = "Most Recent";
      }
      else{
        if(vis.getCheckedValues('queries_checkbox').toString()!= "" && vis.getCheckedValues('tags_checkbox').toString() != ""){
          session['selected_queries'] = vis.getCheckedValues('queries_checkbox').toString();
          session['selected_tags']= vis.getCheckedValues('tags_checkbox').toString();
          session['newPageRetrievelCriteria'] = "Queries,Tags,";
        }
        else{
          session['newPageRetrievelCriteria'] = "one";
          if (vis.getCheckedValues('queries_checkbox').toString()!= ""){ // if (pageRetrievalCriteria == 'Queries'){
            session['pageRetrievalCriteria'] = "Queries";
            session['selected_queries'] = vis.getCheckedValues('queries_checkbox').toString();
          }
          if (vis.getCheckedValues('tags_checkbox').toString()!= ""){//if (pageRetrievalCriteria == 'Tags' || pageRetrievalCriteria == 'More like'){
            //if (pageRetrievalCriteria == 'More like') session['pageRetrievalCriteria'] = "More like";
            //else
            session['pageRetrievalCriteria'] = "Tags";
            session['selected_tags'] = vis.getCheckedValues('tags_checkbox').toString();
          }
	    if (vis.getCheckedValues('model_tags_checkbox').toString()!= ""){//if (pageRetrievalCriteria == 'Tags' || pageRetrievalCriteria == 'More like'){
            //if (pageRetrievalCriteria == 'More like') session['pageRetrievalCriteria'] = "More like";
            //else
            session['pageRetrievalCriteria'] = "Model Tags";
		session['selected_model_tags'] = vis.getCheckedValues('model_tags_checkbox').toString();
          }

        }
      }

      session['model'] = {}
      if(vis.getCheckedValues('posTagsCheckBox').toString() != undefined && vis.getCheckedValues('posTagsCheckBox').toString() != "")
	  session['model']['positive'] = vis.getCheckedValues('posTagsCheckBox').toString();
      else session['model']['positive'] = 'Relevant';
      if(vis.getCheckedValues('negTagsCheckBox'.toString()) != undefined && vis.getCheckedValues('negTagsCheckBox').toString() != "")
	  session['model']['negative'] = vis.getCheckedValues('negTagsCheckBox').toString();
      else session['model']['nagative'] = 'Irrelevant';

return session;
};

CrawlerVis.prototype.clearAll = function() {
    d3.select('#query_box').node().value = "";
    d3.select('#filter_box').node().value = "";
    $('#queryCheckBox').empty();
    d3.select('#last_update_info_box')
	.html('');
    this.pagesGallery.clear();
    this.tagsGallery.clear();
    this.termsSnippetsViewer.clear();
    BokehPlots.clear();
    DataAccess.setLastAccuracy('0');
};

//List of applied filters: Remove the selected button and descheck the associated checkbox.
removeButton =  function(infoButton) {
  var vis =visgeneral;
  var info = infoButton.split(",");
  if(info[0].indexOf("Filter") > -1){
    var filterInfo = d3.select('#filter_box').node().value;
    d3.select('#filter_box').node().value = "";
  }else{
    if(info[0].indexOf("MoreLike") > -1){
      checkboxes = document.getElementsByName('morelike_checkbox');
    }
    if(info[0].indexOf("Queries") > -1){
      checkboxes = document.getElementsByName('queries_checkbox');
    }
    if(info[0].indexOf("Tags") > -1){
      checkboxes = document.getElementsByName('tags_checkbox');
    }
     if(info[0].indexOf("ModelTags") > -1){
   checkboxes = document.getElementsByName('model_tags_checkbox');
    }
    for (var checkbox in checkboxes){
      if(checkboxes[checkbox].value == info[1]){
      checkboxes[checkbox].checked = this.checked;}
    }
  }
  var nameButton="#" + info[0];
  $(nameButton).remove();
  CrawlerVis.prototype.updateVisualization(vis);

}

  // Create/update the container which shows current sequence of applied filters (these appear as buttons).
CrawlerVis.prototype.GetCheckedStateNew = function( newobj) {
    var list_buttons="<div class='row' style='margin-left:1px; margin-right:5px;'>";
    newobj.forEach(function(d) {
      var filters = (d.name).split(",");
      if(filters[0]==""){
        return "";
      }
      else{
        var typeFilter = d.type;
        var buttons= "<div style='float: left; background-color:#ccadc7; padding: 2px 2px 2px 2px;margin-bottom:2px;margin-right:2px;'>" + typeFilter + ": ";
        var nameButton = typeFilter+"_";
        for(var i=0; i<filters.length ; i++){
          if(filters[i] !="select_all")
          buttons = buttons + " <button id='"+nameButton+i +"' class='btn btn-default btn-xs'  onclick='removeButton(\"" + nameButton+i+","+filters[i] + "\")'> <span class='pull-right' style='margin-top:1px;margin-left:2px;margin-right:-3px;'> <span class='glyphicon glyphicon-remove'></span></span>"+ filters[i]+"</button>";
        }
        buttons = buttons + "</div>"
        list_buttons= list_buttons + buttons;
        return ""; //buttons;
      }
    });
    list_buttons =list_buttons + "</div>";
    document.getElementById("list_buttons_div").innerHTML = list_buttons;
}

  //Take a query 'JSON.stringify(session)' for create an array with json objects.
  //Which contains the filters's sequence even queries and tags.
 CrawlerVis.prototype.buildHierarchyFilters = function(value) {
    var path = [];
    path.length = 0;
    //var root = {"name": "root", "children": []};
    var lengthFilter =0;
    if(value.filter!=null){
      var selectedFilter = value.filter; var typeName = "Filter";
      lengthFilter =typeName.length + selectedFilter.length;
      var childNode = {"name": selectedFilter, "type": typeName, "length": lengthFilter};
      path.unshift(childNode);
    }
    if((typeof value.selected_queries=="undefined") && (typeof value.selected_tags=="undefined")&& (typeof value.selected_model_tags=="undefined")) { //if(value.pageRetrievalCriteria=="Most Recent" && value.selected_queries=="" && value.selected_tags==""){
      var selectedFilter = value.pageRetrievalCriteria;
      var childNode = {"name": "Most Recent", "type": "Most Recent", "length": lengthFilter};
      path.unshift(childNode);
    }
    if(value.selected_morelike!=""){ //if(value.selected_morelike!="More like"){
      var selectedMoreLike = value.selected_morelike;
      var childNode = {"name": selectedMoreLike, "type": "MoreLike", "length": (value.pageRetrievalCriteria).length +selectedMoreLike.length+lengthFilter};
      path.unshift(childNode);
    }
    if (value.selected_tags!="" && !(typeof value.selected_tags=="undefined")) { // if (value.pageRetrievalCriteria=="Tags") {
      var selectedTags = value.selected_tags;
      var childNode = {"name": selectedTags, "type": "Tags", "length": (value.pageRetrievalCriteria).length +selectedTags.length + lengthFilter};
      path.unshift(childNode);
    }
    if (value.selected_model_tags!="" && !(typeof value.selected_model_tags=="undefined")) { // if (value.pageRetrievalCriteria=="Model Tags") {
      var selectedTags = value.selected_model_tags;
      var childNode = {"name": selectedTags, "type": "ModelTags", "length": (value.pageRetrievalCriteria).length +selectedTags.length + lengthFilter};
      path.unshift(childNode);
    }
    if (value.selected_queries!="" && !(typeof value.selected_queries=="undefined")) { //if (value.pageRetrievalCriteria=="Queries") {
      var selectedQueries = value.selected_queries;
      var childNode = {"name": selectedQueries, "type": "Queries", "length": (value.pageRetrievalCriteria).length + selectedQueries.length + lengthFilter}; //var childNode = {"name": selectedQueries, "type": value.pageRetrievalCriteria, "length": (value.pageRetrievalCriteria).length + selectedQueries.length + lengthFilter};
      path.unshift(childNode);
    }
    var newobj = path;
    this.GetCheckedStateNew(newobj);
}


$(document).ready(function() {
  // Set the seeds panel as hidden by default.


  $("#seedsHeaderWebSearch").next().slideToggle(0);

  $("#seedsHeaderData").next().slideToggle(0);
  $("#seedsHeaderFilter").next().slideToggle(0);
    //$("#seedsHeaderFilter").hide();
  $("#seedsHeader").next().slideToggle(0);
  $(".panel-heading").click(function () {

    $header = $(this);
    //getting the next element
    $content = $header.next();
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(400, function(){
      if( $content.is(":visible")){

        //initialization of checkboxs (queries, tags)
        var vis = visgeneral;
        //Load Queries
        $('#select_tags').hide();
        $('#select_queries').hide();
        $('#queryCheckBox').show();
        var MoreQueries = ""; var LessQueries = "";
        var MoreTags = ""; var LessTags = "";
        if(nroMaxQueries>initialCheckBox){
          MoreQueries = "See More";
          LessQueries = "";
        }
        document.getElementById("toggleButtonMoreQueries").innerText = MoreQueries; $('#toggleButtonMoreQueries').show();
        document.getElementById("toggleButtonLessQueries").innerText = LessQueries;$('#toggleButtonLessQueries').show();

        //DataAccess.loadAvailableQueries(vis.sessionInfo());
        //Load Tags
        if(nroMaxTags>initialCheckBox){
          MoreTags = "See More";
          LessTags = "";
        }
        $('#tagsCheckBox').show();
        document.getElementById("toggleButtonMoreTags").innerText = MoreTags; $('#toggleButtonMoreTags').show();
        document.getElementById("toggleButtonLessTags").innerText = LessTags; $('#toggleButtonLessTags').show();
        //DataAccess.loadAvailableTags(vis.sessionInfo(), 'Tags');

        $header.find("span.collapsethis").removeClass("glyphicon-plus");
        $header.find("span.collapsethis").addClass("glyphicon-minus");
      }
      else{
        $header.find("span.collapsethis").removeClass("glyphicon-minus");
        $header.find("span.collapsethis").addClass("glyphicon-plus");
      }
    });


  });
});
