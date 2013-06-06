var MYCHART = {'init': null, 'paint': null};

MEDICARE.get_drg = function () {
    $(".chart-svg circle").remove();

    var e = document.getElementById("drug_name");

    $(".selected_drg").html(e.options[e.selectedIndex].text);

//    MEDICARE.DRGData.download="not-downloaded";

    return e.options[e.selectedIndex].value;
};

MEDICARE.dataUrl = function () {
    return '/static/data/' + MEDICARE.get_drg() + '.csv'
};

MEDICARE.LoadOptions = function (callback) {
    $.getJSON('/static/data/drg_options.json', function (jsonData) {
        $.each(jsonData, function (i, j) {
            $('#drug_name').append($('<option></option>').val(j.value).html(j.text));
        });

        callback(MEDICARE.dataUrl());
    });
};



MYCHART.paint = function () {
    MEDICARE.LoadOptions(MYCHART.init);
};

