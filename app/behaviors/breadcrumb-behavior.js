var Marionette = require('backbone.marionette');

var breadCrumbHomeTmpl = '<li class="active" data-lvl="<%- lvl %>" data-url="<%- url %>" data-title="<%- title %>">' +
    '<i class="fa fa-home"></i><%- title %></li>';
var breadCrumbItemTmpl = '<li class="active" data-lvl="<%- lvl %>" data-url="<%- url %>" data-title="<%- title %>">' +
    '<%- title %></li>';

module.exports = Marionette.Behavior.extend({

    onAddBreadcrumb: function (data) {
        var breadcrumb = this.$el.parents("#main-content-wrapper").find("#breadcrumb");
        if (data.url === undefined) {
            data.url = Backbone.history.getHash();
        }
        if (data.lvl === 0) {
            breadcrumb.html(_.template(breadCrumbHomeTmpl)(data))
        } else {
            var prevEl = breadcrumb.find(".active");
            prevEl.removeClass("active");
            // prevEl.html("");
            // if (prevEl.data("lvl") === 0) {
            //     prevEl.append('<i class="fa fa-home"></i>');
            // }
            // prevEl.append("<a href='#" + prevEl.data("url") + "'>" + prevEl.data("title") + "</a>");
            breadcrumb.append(_.template(breadCrumbItemTmpl)(data))
        }
    },

    onInitBreadcrumb: function (data) {
        
    }
});