var Marionette = require('backbone.marionette');

module.exports = Marionette.View.extend({

    initialize: function(options){
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/admin/user-roles.html'),

    ui: {},

    events: {},

    behaviors: {},

    onShow: function() {
        this.render();
    },

    render: function () {
        if (this.history) {
            Backbone.history.navigate(this.history);
        }
        this.$el.html(this.template({}));
    }

});