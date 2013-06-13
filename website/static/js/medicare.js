var MYCHART = {'init': null, 'paint': null};


MEDICARE.get_data = function (drg_num, drg_name) {
    $(".chart-svg circle").remove();
    $(".selected_drg").html(drg_name);
    MEDICARE.DRGData.download = "not-started";
    MEDICARE.DRGData.data = undefined;

    $("#wait-icon").css('display', 'inline');

    var data_rul = '/static/data/' + drg_num + '.csv';
    MYCHART.init(data_rul);

};
