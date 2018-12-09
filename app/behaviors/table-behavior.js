var Marionette = require('backbone.marionette');
var PaginationView = require("../views/pagination");

module.exports = Marionette.Behavior.extend({

    events: {
        'click .paginate_button a': 'renderPage'
    },

    onFetched: function() {
        this.options = Marionette.normalizeUIKeys(this.options, Object.getPrototypeOf(this.view).ui);
        var tableSelector;

        _(this.options).forEach(function(value, selector) {
            tableSelector = $(selector);
            var functionName = _(value).keys()[0];
            var args = _(value).toArray();
            var options = args[0] || {};
            tableSelector[functionName](options);
        }, this);

        new PaginationView({
            page_count: this.view.collection.state.totalPages,
            page_active: this.view.collection.state.currentPage,
            page_show: this.view.collection.state.pageSize,
            $el: tableSelector.parents(".widget-content").children(".paginator")
        }).render();
    },

    renderPage: function(e) {
        e.preventDefault();
        var self = this;
        var table = this.$(this.ui.table).DataTable();
        table.clear();
        table.destroy();
        var page = +e.target.attributes.tabindex.value;
        this.view.model.set("page", page);
        this.view.collection.getPage(page, {
            success: function() {
                self.triggerMethod('fetched');
            },
            data: this.view.model.attributes
        });
    },

});
