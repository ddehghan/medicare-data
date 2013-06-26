var myApp = angular.module("medicareApp", []);


myApp.filter('noFractionRoundedCurrency',
    [ '$filter', '$locale',
        function (filter, locale) {
            var currencyFilter = filter('currency');
            var formats = locale.NUMBER_FORMATS;
            return function (amount, currencySymbol) {
                var roundedAmount;
                if (amount >= 0) {
                    if (amount % 1000 < 500) {
                        roundedAmount = (amount - (amount % 500));
                    } else {
                        roundedAmount = (amount - (amount % 500) + 500);
                    }

                }
                else {
                    if (-amount % 1000 < 500) {
                        roundedAmount = (-amount - (-amount % 500));
                    } else {
                        roundedAmount = (-amount - (-amount % 500) + 500);
                    }
                }
                var value = currencyFilter(roundedAmount, currencySymbol);
                var sep = value.indexOf(formats.DECIMAL_SEP);

                if (roundedAmount >= 0) {
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
        .when('/1',
        {
            controller: 'MainController',
            templateUrl: urlBase + '1.html'
        })
        //Define a route that has a route parameter in it (:customerID)
        .when('/2',
        {
            controller: 'MainController',
            templateUrl: urlBase + '2.html'
        })
        .otherwise({ redirectTo: '/1' });
});
