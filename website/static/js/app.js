App = Ember.Application.create({
      rootElement: '#app-container'
});

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {

    return ['red', 'yellow', 'blue'];
  }
});




//App = Ember.Application.create({});
//
//App.Store = DS.Store.extend({
//    revision: 12,
//    adapter: DS.FixtureAdapter
//});
//App.IndexRoute = Ember.Route.extend({
//    model: function () {
//        return App.Graphic.find();
//    }
//});
//
//App.IndexController= Ember.ArrayController.extend();
//
//App.IndexView = Ember.View.extend({
//
//    setupD3: function () {
//        var svg = d3.select("#svg");
//        var data = this.get('controller.content');
//        var newData = data.toArray();
//        console.log(newData);
//        var graphics = svg.selectAll("rect")
//            .data(newData)
//            .enter()
//            .append("rect");
//        graphics.attr("x", function (d, i) {
//            return (i * 50) + i * 5;
//        })
//            .attr("y", 0)
//            .attr("width", 50)
//            .attr("height", 50)
//            .attr("fill", function (d, i) {
//            console.log(d);
//            return d.get('color');
//        })
//            .attr("stroke", "black")
//    }.observes("controller.length")
//
//});
//
//App.Graphic = DS.Model.extend({
//    active: DS.attr('boolean'),
//    color: DS.attr('string'),
//    currentColor: function () {
//        return this.get('active') ? this.get('color') : 'white';
//    }.property('active')
//});
//
//App.Graphic.FIXTURES = [{
//    id: 1,
//    color: 'red'
//}, {
//    id: 2,
//    color: 'green'
//}, {
//    id: 3,
//    color: 'blue'
//}];