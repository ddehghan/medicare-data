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
//            controller: 'MainController',
            templateUrl: urlBase + 'quality.html'
        })
        //Define a route that has a route parameter in it (:customerID)
//        .when('/2',
//        {
//            controller: 'MainController',
//            templateUrl: urlBase + '2.html'
//        })
        .otherwise({ redirectTo: '/quality' });
});


myApp.directive('repeatDone', function () {
    return function (scope, element, attrs) {
        if (scope.$last) { // all are rendered
            scope.$eval(attrs.repeatDone);
        }
    }
});


myApp.factory('loadDataService', function ($rootScope, $http) {
    var loadDataService = {};
    loadDataService.data = {};

    console.log(loadDataService);

    loadDataService.getData = function () {
        $http.get('../data/39.csv')
            .success(function (data) {
                console.log("download finish");
                loadDataService.data.drgs = $.csv.toObjects(data);

            });

//        $http.get('../json/us-states.json')
//            .success(function (data) {
//                loadDataService.data.usStates = data;
//            });
//
        return loadDataService.data;
    };


    return loadDataService;
});
