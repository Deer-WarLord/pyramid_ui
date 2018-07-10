// table_publication
var Marionette = require('backbone.marionette');
var moment = require("../../assets/js/plugins/moment/moment");
var PublicationRatingCollection = require('../../collections/publication_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/publication_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new PublicationRatingCollection();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
        if (!this.options.permissions.free_time || !this.model.get("posted_date__gte")) {
            this.model.set({
                "posted_date__gte": this.options.fixed_dates[0],
                "posted_date__lte": this.options.fixed_dates[1]
            });
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/publication_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#publication-reportrange",
        "input": "#publication-reportrange input",
        "table": "#datatable-publications",
        "rowFilter": "#datatable-publications .row-filter input",
        "publication": ".publication",
        "selectProvider": "#publication-provider-type"
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.publication': 'getSocialDemo',
        'change @ui.input': 'filterCollection'
    },

    behaviors: {
        TableBehavior: {
            '@ui.table': {
                "DataTable": {
                    bDestroy: true,
                    "order": [[ 1, "desc" ]],
                    sDom: "RC"+
                    "t",
                    colVis: {
                        buttonText: 'Show / Hide Columns',
                        restore: "Restore",
                        showAll: "Show all"
                    }
                }
            }
        },
        ToggleBehavior: {},
        jQueryBehavior: {
            '@ui.selectProvider': {
                'multiselect': {
                    maxHeight: 300,
                    buttonClass: 'btn btn-default selectProvider'
                }
            }
        },
        DatePickerBehavior: {}
    },

    onShow: function() {
        var self = this;
        self.$el.parent().show();
        this.ui.table.DataTable().destroy();
        var reportRange = $(Object.getPrototypeOf(this).ui.reportRange);
        this.collection.fetch({
            success: function() {
                if (self.history) {
                    Backbone.history.navigate(self.history);
                }
                setTimeout(function() {
                    self.triggerMethod('fetched');
                    if (self.model.getParams() !== '') {
                        var dates = [self.model.get('posted_date__gte'), self.model.get('posted_date__lte')];
                        reportRange.find('span').html(dates[0] + ' - ' + dates[1]);
                        reportRange.find('input').val(dates[0] + ',' + dates[1]);
                    }
                }, 1000);
            },
            data: this.model.attributes
        });
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
            self.$(self.ui.table).dataTable().fnDestroy();
            self.model.clear().set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate
            });
            this.collection.fetch({
                success: function() {
                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('publication-rating/'+data.fromDate+"/"+data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    getSocialDemo: function(domEvent) {
        this.model.set("publication", domEvent.toElement.innerHTML);
        this.model.set("page", 1);
        var params = "";

        if (this.model.isValidForPublications()) {

            params = this.model.get('posted_date__gte')+"/"+
                     this.model.get('posted_date__lte')+"/"+
                     this.model.get("key_word")+"/"+
                    this.model.get("publication");

            if (this.ui.selectProvider.val() === "admixer") {
                this.model.set('history', 'specific-social-demo-rating-admixer/' + params);
                this.triggerMethod('specific:show:social:demo:admixer');

            } else if (this.ui.selectProvider.val() === "fg") {
                this.model.set('history', 'specific-social-demo-rating-fg/' + params);
                this.triggerMethod('specific:show:social:demo:fg');
            }

        } else {

            params = this.model.get('posted_date__gte')+"/"+
                     this.model.get('posted_date__lte')+"/"+
                     this.model.get("publication");

            if (this.ui.selectProvider.val() === "admixer") {
                this.model.set('history', 'general-social-demo-rating-admixer/' + params);
                this.triggerMethod('general:show:social:demo:admixer', "publication");
            } else if (this.ui.selectProvider.val() === "fg") {
                this.model.set('history', 'general-social-demo-rating-fg/' + params);
                this.triggerMethod('general:show:social:demo:fg', "publication");
            }
        }
    }
});

module.exports = Table;