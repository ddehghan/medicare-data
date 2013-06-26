var MYCHART = {'init': null, 'paint': null, 'paintParameters': null};

MEDICARE.cleanData = function () {
    console.log("re-draw data");

    $(".chart-svg circle").remove();
    MEDICARE.DRGData.download = "not-started";
    MEDICARE.DRGData.data = undefined;
    MEDICARE.DRGData.delta = undefined;

    $("#wait-icon").css('display', 'inline');
};


MYCHART.paint = function () {
    MEDICARE.cleanData();

    $(".selected_drg").html(MYCHART.paintParameters[1]);
    var data_rul = '/static/data/' + MYCHART.paintParameters[0] + '.csv';
    MYCHART.init(data_rul);
};
