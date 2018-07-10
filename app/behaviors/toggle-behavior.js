var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    ui: {
        "wrapper": ".widget .btn-toggle-expand",
        "affectedElement": ".widget-content"
    },

    events: {
        'click @ui.wrapper': 'clickToggle'
    },

    clickToggle: function(e) {
        e.preventDefault();
        var self = event.currentTarget;
        var affectedElement = this.ui.affectedElement;

        if (this.clicked) {
            this.clicked = false;
            affectedElement.slideDown(300);
        } else {
            this.clicked = true;
            affectedElement.slideUp(300);
        }

        $(self).find('i.fa-chevron-up').toggleClass('fa-chevron-down');
    },
});