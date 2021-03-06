// theme_company_rating_table
var Marionette = require('backbone.marionette');
var RegionRatingCollection = require('../../collections/region_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/region_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new RegionRatingCollection();
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
    template: require('../../templates/region_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#region-reportrange",
        "region": ".region",
        "table": "#datatable-region",
        "rowFilter": "#datatable-region .row-filter input",
        "input": "#region-reportrange input",
        "queryPublicationType": "#query-publication-type"
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
        'click @ui.region': 'selectRegion',
        'click @ui.queryPublicationType': 'queryPublicationType',
        'change @ui.input': 'filterCollection'
    },

    onShow: function(child, construcotr, dates) {
        var self = this;
        self.$el.parent().show();
        if (!(dates && dates.length === 2) || !this.options.permissions.free_time) {
            dates = self.options.fixed_dates;
        }
        self.ui.queryPublicationType.hide();
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
        this.triggerMethod('addBreadcrumb', {"url": this.history, "title": "Регионы", "lvl": 0});
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
            self.ui.queryPublicationType.hide();
            this.collection.fetch({
                success: function () {

                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('region-rating/' + data.fromDate + "/" + data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    selectRegion: function(domEvent) {
        this.$(domEvent.toElement).toggleClass("select");
        if (this.$(".select").length > 0) {
            this.ui.queryPublicationType.show();
        } else {
            this.ui.queryPublicationType.hide();
        }
    },

    queryPublicationType: function (e) {
        var self = this;
        var regions = [];
        this.$(".select").each(function(i, item) {regions.push(self.$(item).text());});
        if (regions.length > 0 && this.model.get('posted_date__gte') && this.model.get('posted_date__lte')) {
            this.model.set("region__in", JSON.stringify(regions));
            var history = 'publication-type-rating/' + this.model.get("region__in") + "/" +
                                                       this.model.get('posted_date__gte') + "/" +
                                                       this.model.get('posted_date__lte');
            Backbone.history.navigate(history);
        }
    }

});

module.exports = Table;