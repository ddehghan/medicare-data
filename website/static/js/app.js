App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.IndexRoute = Ember.Route.extend({
  model: function() {

    return ['red', 'yellow', 'blue'];
  }
});


//App.booksController = Ember.Object.create({
//  content: null,
//  populate: function() {
//    var cc = this;
//    jQuery.get('/static/drg_options.json', function(data) {
//      cc.set('content', books);
//    });
//  }
//});