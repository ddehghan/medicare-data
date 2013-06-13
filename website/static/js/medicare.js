var MYCHART = {'init': null, 'paint': null};

//MEDICARE.get_drg = function () {
//    $(".chart-svg circle").remove();
//
//    var e = document.getElementById("drug_name");
//
//    $(".selected_drg").html(e.options[e.selectedIndex].text);
//
//    MEDICARE.DRGData.download = "not-started";
//
//    return e.options[e.selectedIndex].value;
//};

MEDICARE.get_data = function (drg_num, drg_name) {
    $(".chart-svg circle").remove();
    $(".selected_drg").html(drg_name);
    MEDICARE.DRGData.download = "not-started";
    MEDICARE.DRGData.data = undefined;

    $("#wait-icon").css('display', 'inline');

    var data_rul = '/static/data/' + drg_num + '.csv';
    MYCHART.init(data_rul);

};

//MEDICARE.dataUrl = function () {
//    return '/static/data/' + MEDICARE.get_drg() + '.csv'
//};

//MEDICARE.LoadOptions = function (callback) {
//    $.getJSON('/static/data/drg_options.json', function (jsonData) {
//        $.each(jsonData, function (i, j) {
//            $('#drug_name').append($('<option></option>').val(j.value).html(j.text));
//        });
//
//        callback(MEDICARE.dataUrl());
//    });
//};


MYCHART.paint = function () {
    MYCHART.init(MEDICARE.dataUrl());
};

