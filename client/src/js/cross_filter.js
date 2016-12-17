/**
 * This module handles the server callback to update the bokeh plots
 */
var crossFilterUpdate = function(){
  var data_table_ids = ['urls', 'tlds', 'tags', 'queries'];

  setTimeout(function() { //need timeout to wait for class change
    var global_state = {};
    for (i=0; i<data_table_ids.length; i++) {
      global_state[data_table_ids[i]] = get_table_state(data_table_ids[i]);
    }

    global_state['datetimepicker_start'] = $('#datetimepicker_start').data('date') || '';
    global_state['datetimepicker_end'] = $('#datetimepicker_end').data('date') || '';
    $.ajax({
      type: "POST",
      url: '/update_cross_filter_plots' + window.location.search, //session info
      data: JSON.stringify(global_state),
      contentType: "application/json",
      dataType: "json",
      success: function(response) {
        $("#plot_area").html(response);
      }
    });
  }, 10);

  var get_table_state = function(id) {
    var current = $("#".concat(id)).find(".bk-slick-cell.l0.selected");
    var active_cells = [];
    for (j = 0; j < current.length; j++) {
      active_cells.push(current[j].innerText);
    }
    return active_cells;
  };
};
