require('king-theme');
require('./assets/css/bootstrap.css');
require('./assets/css/font-awesome.css');
require('./assets/css/main.css');
require('./assets/css/my-custom-styles.css');
require('./assets/css/main-ie.css');
require('./assets/css/main-ie-part2.css');



var Marionette = require('backbone.marionette');
var Router = require('./routers/router');

var app = new Marionette.Application({
    onStart: function(options) {
        var router = new Router(options);
        Backbone.history.start();
    }
});

app.start({initialData: window.initialData});