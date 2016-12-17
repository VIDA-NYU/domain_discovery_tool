(function(exports){

  /**
   * Sting to be used when grabbing the settings form DOM element.
   */
  var form = "#topicvis_settings_form";
  var MIN_TOPICS = 2;
  var MAX_TOPICS = 20;


  /**
   * Default settings for the topik visualizations.
   */
  exports.visSettings = {
    tokenizer: "simple",
    vectorizer: "bag_of_words",
    model: "plsa",
    ntopics: 2,
    visualizer: "",
    session: "",
  };


  /**
   * Convert the values in the form to simple key-value pairs, in which the key
   * is the html name of the input and the value is the value of the input.
   */
  exports.formToObject = function(form){
    var objects = {};
    var formData = $(form).serializeArray();
    for(var i = 0; i < formData.length; i++){
      objects[formData[i]["name"]] = formData[i]["value"]
    }
    if((objects.ntopics > MAX_TOPICS) || (objects.ntopics < MIN_TOPICS)){
      $("#error_ntopics").css("display", "inline");
      throw "ntopics must be a number between " + MIN_TOPICS + " and " + MAX_TOPICS + ".";
    } else {
      $("#error_ntopics").css("display", "none");
      return objects;
    }
  }


  /**
   * Update visSettings with the new settings using jQuery.extend
   */
  exports.updateSettings = function(){
    $.extend(true, exports.visSettings, exports.formToObject(form));
  }


  /**
   * When either button is clicked, use the context dependent "this" to
   * grab the value of the clicked button and update visSettings, then change
   * the href on the link button to contain the vis settings parsed as URL
   * paramaters.
   */
  $("#ldavisPlot, #termitePlot").on("click", function(){
    exports.visSettings.visualizer = $(this).attr("value");
    exports.visSettings.session = JSON.stringify(exports.vis.sessionInfo());
    var url = "/topicvis?" + $.param(exports.visSettings);
    $(this).attr("href", url);
  });


  /**
   * When the save button is clicked, update visSettings with the new values
   * from the form.
   */
  $("#save_topicvis_settings").on("click", function(){
    exports.updateSettings();
    $("#topicVisSettingsModal").modal("hide");
  });

})(this.TopicVis = {});
