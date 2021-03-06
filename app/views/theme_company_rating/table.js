// theme_company_rating_table
var Marionette = require('backbone.marionette');
var ThemeCompanyRatingCollection = require('../../collections/theme_company_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/theme_company_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new ThemeCompanyRatingCollection();
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
    template: require('../../templates/theme_company_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#theme-reportrange",
        "key_word": ".key-word",
        "table": "#datatable-themes-companies",
        "rowFilter": "#datatable-themes-companies .row-filter input",
        "input": "#theme-reportrange input",
        "selectQuery": "#query-type",
        "selectProvider": "#theme-provider-type",
        "querySd": "#query-sd"
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
        jQueryBehavior: {
            '@ui.selectQuery': {
                'multiselect': {
                    maxHeight: 300,
                    buttonClass: 'btn btn-default selectQuery',
                    onChange: function(option, checked) {
                        if (option.val() === 'social-demo') {
                            $('.selectProvider').removeClass('hidden');
                        } else {
                            $('.selectProvider').addClass('hidden');
                        }
                    }
                }
            },
            '@ui.selectProvider': {
                'multiselect': {
                    maxHeight: 300,
                    buttonClass: 'btn btn-default selectProvider'
                }
            }
        },
        DatePickerBehavior: {}
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.key_word': 'selectKeyWord',
        'change @ui.input': 'filterCollection',
        'click @ui.querySd': 'querySd'
    },

    onShow: function(child, construcotr, dates) {
        var self = this;
        self.$el.parent().show();
        if (!(dates && dates.length === 2) || !this.options.permissions.free_time) {
            dates = self.options.fixed_dates;
        }
        this.ui.querySd.hide();
        this.collection.fetch({
            success: function() {
                if (self.history) {
                    Backbone.history.navigate(self.history);
                }
                setTimeout(function() {
                    self.triggerMethod('fetched');
                    if (!self.options.permissions.publication && self.options.permissions.social_demo) {
                        $('.selectProvider').removeClass("hidden");
                    }
                }, 1000);
            },
            data: this.model.attributes
        });

        this.ui.reportRange.find('span').html(dates[0] + ' - ' + dates[1]);
        this.ui.reportRange.find('input').val(dates[0] + ',' + dates[1]);
        this.triggerMethod('addBreadcrumb', {"url": this.history, "title": "Темы/Компании", "lvl": 1});
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
            this.ui.querySd.hide();
            this.collection.fetch({
                success: function () {
                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('theme-company-rating/' + data.fromDate + "/" + data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    selectKeyWord: function(domEvent) {
        this.$(domEvent.toElement).toggleClass("select");
        if (this.$(".select").length > 0) {
            this.ui.querySd.show();
        } else {
            this.ui.querySd.hide();
        }
    },

    querySd: function (e) {
        var self = this;
        var key_words = [];
        this.$(".select").each(function(i, item) {key_words.push(self.$(item).text());});

        if (key_words.length > 0 && this.model.get('posted_date__gte') && this.model.get('posted_date__lte')) {
            if (this.model.has("market__in")) {
                this.model.unset("market__in");
            }

            this.model.set("page", 1);
            this.model.set("key_word__in", JSON.stringify(key_words));

            if (this.ui.selectQuery.val() === "publications") {
                var history = 'publication-rating/'+this.model.get('posted_date__gte')+"/"+this.model.get('posted_date__lte')+"/"+this.model.get("key_word__in");
            } else if(this.ui.selectQuery.val() === "social-demo") {
                if (this.ui.selectProvider.val() === "admixer") {
                    history = 'specific-social-demo-rating-admixer/'+this.model.get('posted_date__gte')+"/"+this.model.get('posted_date__lte')+"/"+this.model.get("key_word__in");
                } else if (this.ui.selectProvider.val() === "fg") {
                    history = 'specific-social-demo-rating-fg/'+this.model.get('posted_date__gte')+"/"+this.model.get('posted_date__lte')+"/"+this.model.get("key_word__in");
                }
            }
            Backbone.history.navigate(history);
        }
    }

});

module.exports = Table;