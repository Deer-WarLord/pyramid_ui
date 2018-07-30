var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    ui: {
        "wrapper": ".widget .btn-toggle-expand"
    },

    events: {
        'click @ui.wrapper': 'clickToggle'
    },

    clickToggle: function(e) {
        e.preventDefault();
        var affectedElement = this.$(e.currentTarget).parents(".widget").children(".widget-content");

        if (!affectedElement.is(":visible")) {
            affectedElement.slideDown(300);
        } else {
            affectedElement.slideUp(300);
        }

        this.$(e.currentTarget).children('i.fa-chevron-up').toggleClass('fa-chevron-down');
    }
});