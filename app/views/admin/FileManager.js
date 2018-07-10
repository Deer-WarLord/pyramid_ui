var Marionette = require('backbone.marionette');
var FilesCollection = require('../../collections/files');
var Cookies = require('js-cookie');

var Row = Marionette.ItemView.extend({
    tagName: 'tr',
    template: require('../../templates/admin/files-row.html')
});

module.exports = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new FilesCollection();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/admin/files-table.html'),

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "table": "#datatable-files",
        "rowFilter": "#datatable-files .row-filter input",
        "delete_button": ".delete-button"
    },

    behaviors: {
        TableBehavior: {
            '@ui.table': {
                "DataTable": {
                    bDestroy: true,
                    "order": [[ 1, "desc" ]],
                    sDom: "t",
                }
            }
        },
        ToggleBehavior: {},
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.delete_button': 'removeRecord',
    },

    onShow: function() {
        var self = this;
        this.collection.fetch({
            success: function() {
                if (self.history) {
                    Backbone.history.navigate(self.history);
                }
                setTimeout(function() {
                    self.triggerMethod('fetched');
                }, 1000);
            }
        });
    },

    filterColumn: function (event) {
        var dtTable = this.ui.table.DataTable();
        dtTable.column(event.currentTarget.parentElement.getAttribute("data-index") + ':visible')
            .search(event.currentTarget.value)
            .draw();

    },

    removeRecord: function (e) {
        var self = this;
        var id = $(e.target).attr("data-index");
        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            url: "/archive/" + id + "/",
            type: 'DELETE',
            success: function() {
                self.collection.remove(id);
            }
        });
    }

});