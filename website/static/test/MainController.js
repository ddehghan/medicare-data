function MainController($scope, $http, loadDataService) {    $scope.data = loadDataService.getData();    function drawMap() {//        d3.json('/static/json/us-states.json', function (collection) {//            MEDICARE.USMap.download = "done";////            var projection = d3.geo.albersUsa();//            var path = d3.geo.path().projection(projection);////            var defs = context.svg.append("defs");//            var group = defs.append("g");//            group.attr('id', 'usmap-svg');////            group.selectAll('path')//                .data(collection.features)//                .enter().append('path')//                .attr('d', d3.geo.path().projection(projection))//                .attr('id', function (d) {//                    return d.properties.name.replace(/\s+/g, '')//                })//                .style('fill', 'gray')//                .style('stroke', 'white')//                .style('stroke-width', 1);////            DownloadMapFinished();////        });    }    $scope.filterByPrice = function () {        var test = _.filter($scope.data.drgs, function (item) {            return (parseFloat(item.charge) > $scope.filter.price);        });        console.log($scope.filter.price);        $scope.data.drgs_filter = test;        $scope.data.drgs = test;    };}