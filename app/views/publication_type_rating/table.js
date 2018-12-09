// theme_company_rating_table
var Marionette = require('backbone.marionette');
var PublicationTypeRatingCollection = require('../../collections/publication_type_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/publication_type_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new PublicationTypeRatingCollection();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
        this.clicked = false;
        if (!this.options.permissions.free_time || !this.model.get("posted_date__gte")) {
            this.model.set({
                "posted_date__gte": this.options.fixed_dates[0],
                "posted_date__lte": this.options.fixed_dates[1]
            });
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/publication_type_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#publication-type-reportrange",
        "publication_type": ".publication-type",
        "table": "#datatable-publication-type",
        "rowFilter": "#datatable-publication-type .row-filter input",
        "input": "#publication-type-reportrange input",
        "queryPublicationTopic": "#query-publication-topic"
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
        ToggleBehavior: {},
        ExportBehavior: {},
        BreadCrumbBehavior: {},
        DatePickerBehavior: {}
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.publication_type': 'selectPublicationType',
        'click @ui.queryPublicationTopic': 'queryPublicationTopic',
        'change @ui.input': 'filterCollection'
    },

    onShow: function(child, construcotr, dates) {
        var self = this;
        self.$el.parent().show();
        if (!(dates && dates.length === 2) || !this.options.permissions.free_time) {
            dates = self.options.fixed_dates;
        }
        self.ui.queryPublicationTopic.hide();
        this.collection.fetch({
            success: function() {
                setTimeout(function() {
                    self.triggerMethod('fetched');
                }, 1000);
            },
            data: this.model.attributes
        });

        this.ui.reportRange.find('span').html(dates[0] + ' - ' + dates[1]);
        this.ui.reportRange.find('input').val(dates[0] + ',' + dates[1]);
        this.triggerMethod('addBreadcrumb', {"url": this.history, "title": "Тип СМИ", "lvl": 1});
    },

    filterColumn: function (event) {
        var dtTable = this.ui.table.DataTable();
        dtTable.column(event.currentTarget.parentElement.getAttribute("data-index") + ':visible')
            .search(event.currentTarget.value)
            .draw();

    },

    filterCollection: function(event, data) {
        if (!this.options.permissions.free_time) return;

        var self = this;
        if (data.fromDate && data.toDate) {
            self.$(self.ui.table).DataTable().destroy();
            self.model.clear().set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate
            });
            self.ui.queryPublicationTopic.hide();
            this.collection.fetch({
                success: function () {

                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('publication-type-rating/' + data.fromDate + "/" + data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    selectPublicationType: function(domEvent) {
        this.$(domEvent.toElement).toggleClass("select");
        if (this.$(".select").length > 0) {
            this.ui.queryPublicationTopic.show();
        } else {
            this.ui.queryPublicationTopic.hide();
        }
    },

    queryPublicationTopic: function (e) {
        var self = this;
        var regions = [];
        this.$(".select").each(function(i, item) {regions.push(self.$(item).text());});
        if (regions.length > 0 && this.model.get('posted_date__gte') && this.model.get('posted_date__lte')) {
            this.model.set("type__in", JSON.stringify(regions));

            var history = 'publication-topic-rating/' + this.model.get("region__in") + "/" +
                                                        this.model.get("type__in") + "/" +
                                                        this.model.get('posted_date__gte') + "/" +
                                                        this.model.get('posted_date__lte');
            Backbone.history.navigate(history);
        }
    }

});

module.exports = Table;