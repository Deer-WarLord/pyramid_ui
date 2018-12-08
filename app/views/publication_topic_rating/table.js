// theme_company_rating_table
var Marionette = require('backbone.marionette');
var PublicationTopicRatingCollection = require('../../collections/publication_topic_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/publication_topic_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new PublicationTopicRatingCollection();
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
    template: require('../../templates/publication_topic_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#publication-topic-reportrange",
        "publication_topic": ".publication-topic",
        "table": "#datatable-publication-topic",
        "rowFilter": "#datatable-publication-topic .row-filter input",
        "input": "#publication-topic-reportrange input",
        "queryPublication": "#query-publication"
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
        DatePickerBehavior: {}
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.publication_topic': 'selectPublicationTopic',
        'click @ui.queryPublication': 'queryPublication',
        'change @ui.input': 'filterCollection'
    },

    onShow: function(child, construcotr, dates) {
        var self = this;
        self.$el.parent().show();
        if (!(dates && dates.length === 2) || !this.options.permissions.free_time) {
            dates = self.options.fixed_dates;
        }
        self.ui.queryPublication.hide();
        this.collection.fetch({
            success: function() {
                setTimeout(function() {
                    self.triggerMethod('fetched');
                }, 1000);
            },
            data: this.model.attributes
        });

        this.ui.reportRange.find('span').html(dates[0] + ' - ' + dates[1]);
        this.ui.reportRange.find('input').val(dates[0] + ',' + dates[1])

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
            self.ui.queryPublication.hide();
            this.collection.fetch({
                success: function () {

                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('publication-topic-rating/' + data.fromDate + "/" + data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    selectPublicationTopic: function(domEvent) {
        this.$(domEvent.toElement).toggleClass("select");
        if (this.$(".select").length > 0) {
            this.ui.queryPublication.show();
        } else {
            this.ui.queryPublication.hide();
        }
    },

    queryPublication: function (e) {
        var self = this;
        var topics = [];
        this.$(".select").each(function(i, item) {topics.push(self.$(item).text());});
        if (topics.length > 0 && this.model.get('posted_date__gte') && this.model.get('posted_date__lte')) {
            this.model.set("topic__in", JSON.stringify(topics));

            var history = 'publication-rating/' + this.model.get("region__in") + "/" +
                                                   this.model.get("type__in") + "/" +
                                                   this.model.get("topic__in") + "/" +
                                                   this.model.get('posted_date__gte') + "/" +
                                                   this.model.get('posted_date__lte');
            Backbone.history.navigate(history);
        }
    }

});

module.exports = Table;