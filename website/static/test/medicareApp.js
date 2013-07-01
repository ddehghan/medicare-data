var myApp = angular.module("medicareApp", []);


myApp.filter('noFractionRoundedCurrency',
    [ '$filter', '$locale',
        function (filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            return function (amount, currencySymbol) {
                var value = currencyFilter(amount, currencySymbol);
                var sep = value.indexOf(formats.DECIMAL_SEP);

                if (amount >= 0) {
                    return value.substring(0, sep);
                }
                return value.substring(0, sep) + ')';
            };
        }
    ]
);


myApp.config(function ($routeProvider) {

    var urlBase = '/static/test/partials/';

    $routeProvider
        .when('/quality',
        {
            controller: 'MainController',
            templateUrl: urlBase + 'quality.html'
        })
        //Define a route that has a route parameter in it (:customerID)
        .when('/2',
        {
            controller: 'MainController',
            templateUrl: urlBase + '2.html'
        })
        .otherwise({ redirectTo: '/1' });
});
