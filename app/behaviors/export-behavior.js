var Marionette = require('backbone.marionette');
var querystring = require('querystring');

module.exports = Marionette.Behavior.extend({

    ui: {
        "export_btn": ".widget .btn-export-csv"
    },

    events: {
        'click @ui.export_btn': 'exportCollection'
    },

    exportCollection: function(e) {
        var params = this.view.model.attributes;
        params.per_page = 10000;
        params.format = "csv";
        var downloadUrl  = this.view.collection.url + "?" + querystring.stringify(params);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "pyramid_data_export_" + (new Date()).getTime() + ".csv";
        a.setAttribute("data-bypass", "");
        document.body.appendChild(a);
        a.click();
    }
});