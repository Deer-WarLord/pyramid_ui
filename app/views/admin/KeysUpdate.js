var Marionette = require('backbone.marionette');
var PublicationWithoutKeysCollection = require('../../collections/publication_without_keys');

var Row = Marionette.ItemView.extend({
    tagName: 'tr',
    template: require('../../templates/admin/keys-update-row.html')
});

module.exports = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new PublicationWithoutKeysCollection();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/admin/keys-update-table.html'),

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "table": "#datatable-publication-without-keys",
        "rowFilter": "#datatable-publication-without-keys .row-filter input",
        "warning_block": ".warning-block",
        "get_keys_button": "#get-keys",
        "get_collection_button": "#get-collection"
    },

    behaviors: {
        TableBehavior: {
            '@ui.table': {
                "DataTable": {
                    bDestroy: true,
                    "order": [[ 1, "desc" ]],
                    sDom: "t"
                }
            }
        },
        ToggleBehavior: {}
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.get_keys_button': 'getKeys',
        'click @ui.get_collection_button': 'getCollection'
    },

    onShow: function(child, construcotr, dates) {
        var self = this;
        $.get("/noksfishes/publications-without-keys-count/", function(data) {
            if (data > 0) {
                $(self.ui.warning_block).removeClass("hidden");
                $("#publication-count").html(data);
                $(self.ui.get_keys_button).removeClass("disabled");
            }
        });

    },

    filterColumn: function (event) {
        var dtTable = this.ui.table.DataTable();
        dtTable.column(event.currentTarget.parentElement.getAttribute("data-index") + ':visible')
            .search(event.currentTarget.value)
            .draw();

    },

    getKeys: function () {
        //TODO Loader
        var self = this;
        $.get("/noksfishes/get-keys/", function(data) {
            alert("Обновленно ключей займет какое-то время");
            self.onShow();
        });
    },

    getCollection: function () {
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
    }

});