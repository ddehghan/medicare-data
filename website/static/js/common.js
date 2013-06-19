var MEDICARE = {};

// Shallow copy an object into another object. To get around the fact that JS is copy by reference
MEDICARE.ShallowCopy = function (o) {
    var copy = Object.create(o);
    for (prop in o) {
        if (o.hasOwnProperty(prop)) {
            copy[prop] = o[prop];
        }
    }
    return copy;
};

// Format number into currency format
MEDICARE.formatMoney = function (n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return '$' + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


//Handlebars.registerHelper('list', function (items, options) {
//    var out = "<ul>";
//
//    for (var i = 0, l = items.length; i < l; i++) {
//        out = out + "<li>" + options.fn(items[i]) + "</li>";
//    }
//
//    return out + "</ul>";
//});

Handlebars.registerHelper('list', function (items, options) {
    var out = "";

    for (var i = 0, l = items.length; i < l; i++) {
        out = out + options.fn(items[i]);
    }

    return out;
});


//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles                                   :::
//:::                  'K' is kilometers (default)                            :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2013            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

MEDICARE.latLonDistance = function (lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist
};


MEDICARE.toolTip = function(){
    $('svg circle').tipsy({
        gravity: 'w',
        html: true,
        title: function () {
            var d = this.__data__;

            var data = {
                'name': d.name + ", " + d.state,
                'charge': MEDICARE.formatMoney(d.charge, 0, '.', ','),
                'pay': MEDICARE.formatMoney(d.pay, 0, '.', ','),
                'AcquiredInfect': d.AcquiredInfect * 100,
                'AcquiredConditions': d.AcquiredConditions * 100,
                'PatientSafetySummary': d.PatientSafetySummary *100
            };

            var template = $('#tooltip-template').html();
            var compiledTemplate = Handlebars.compile(template);

            return compiledTemplate(data);
        }
    });
};
