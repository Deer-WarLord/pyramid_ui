var Marionette = require('backbone.marionette');
var Backbone = require("backbone");

module.exports = Marionette.ItemView.extend({

    initialize: function(options){
        this.model = new Backbone.Model(options.model);
    },

    tagName: 'div',
    className: 'container',
    template: require('../templates/top-bar.html'),

});