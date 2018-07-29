var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    onFetched: function() {
        this.options = Marionette.normalizeUIKeys(this.options, Object.getPrototypeOf(this.view).ui);
        // this.view.collection.state

        _(this.options).forEach(function(value, selector) {
            var element = $(selector);
            if (_(value).isObject()) {
                var functionName = _(value).keys()[0];
                var args = _(value).toArray();
                var options = args[0] || {};
                if (args.length === 2) {
                   element[functionName](options, args[1]);
                } else {
                    element[functionName](options);
                }
            } else if (_(value).isString()) {
                element[value]();
            }
        }, this);
    }
});
