//angular.module('medicareApp').factory('loadDataService', function ($rootScope, $http) {
//    var loadDataService = {};
//
//    loadDataService.data = {};
//
//    loadDataService.getData = function () {
//        $http.get('../data/39.csv')
//            .success(function (data) {
//                loadDataService.data.drgs = $.csv.toObjects(data);
//            });
//
////        $http.get('../json/us-states.json')
////            .success(function (data) {
////                loadDataService.data.usStates = data;
////            });
////
//        return loadDataService.data;
//    };
//
//    return loadDataService;
//});
