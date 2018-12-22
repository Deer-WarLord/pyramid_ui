var Marionette = require('backbone.marionette');
var moment = require("../../assets/js/plugins/moment/moment");
var SocialDemoRatingCollection = require('../../collections/social_demo_rating_admixer');

var GenderGroupsMap = {
    0: "Неизвестно",
    1: "Мужчин",
    2: "Женщин"
};

var AgeGroupsMap = {
    0: "Неизвестно",
    1: "до 18",
    2: "от 18 до 24",
    3: "от 25 до 34",
    4: "от 35 до 44",
    5: "после 45"
};

var BrowserGroupsMap = {
    0: "Неизвестно",
    1: "IE",
    2: "Firefox",
    3: "Chrome",
    4: "Safari",
    5: "Opera",
    6: "Yandex",
    7: "IE7andLower",
    8: "IE8",
    9: "IE9",
    10: "IE10",
    11: "IE11",
    12: "Edge"
};

var PlatformGroupsMap = {
    0: "Неизвестно",
    1: "IPad",
    2: "IPod",
    3: "IPhone",
    4: "Windows_Phone_7",
    5: "Android_tablet",
    6: "Android_phone",
    7: "BlackBerry",
    8: "Symbian",
    9: "Bada",
    10: "Win8_tablet",
    11: "Win_phone_8",
    12: "Palm",
    13: "Motorola",
    14: "WinCE",
    15: "Win95",
    16: "Win98",
    17: "WinME",
    18: "Win2000",
    19: "WinXP",
    20: "WinVista",
    21: "Win7",
    22: "Win8",
    23: "WinRT",
    24: "Mac",
    25: "Linux",
    26: "Irix",
    27: "Sun",
    28: "Win10",
    29: "Win_phone_10"
};

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/social_demo_rating/admixer/row.html'),
    templateHelpers: {

        getGendersGroup: function(gender_groups) {
            var newData = {};
            for (var key in gender_groups) {
                newData[GenderGroupsMap[key]] = gender_groups[key];
            }
            return newData;
        },

        getAgesGroup: function(age_groups) {
            var newData = {};
            for (var key in age_groups) {
                newData[AgeGroupsMap[key]] = age_groups[key];
            }
            return newData;
        },

        getBrowsersGroup: function(browsers) {
            var newData = {};
            for (var key in browsers) {
                newData[BrowserGroupsMap[key]] = browsers[key];
            }
            return newData;
        },

        getPlatformsGroup: function(platform) {
            var newData = {};
            for (var key in platform) {
                newData[PlatformGroupsMap[key]] = platform[key];
            }
            return newData;
        },
    }
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new SocialDemoRatingCollection([], {url: options.url});
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
        this.lvl = 3;
        if (this.model.has("lvl")) {
            this.lvl = this.model.get("lvl");
            this.model.unset("lvl");
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
    template: require('../../templates/social_demo_rating/admixer/table.html'),

    childView: Row,
    childViewContainer: 'tbody',

    templateHelpers: {

        keyContext: function(){
            return (this.aggregator === "publication") ? "СМИ" : "Темы/Компании";
        }

    },

    ui: {
        "reportRange": "#admixer-reportrange",
        "input": "#admixer-reportrange input",
        "rowFilter": "#admixer-datatable-social-demo .row-filter input",
        "table": "#admixer-datatable-social-demo",
        "socialDemoDialog": "#admixer-social-demo-plot"
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'change @ui.input': 'filterCollection'
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
        PlotBehavior: {},
        ToggleBehavior: {},
        ExportBehavior: {},
        BreadCrumbBehavior: {},
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
        this.triggerMethod('addBreadcrumb', {"url": this.history, "title": "Соц.Дем.Admixer", "lvl": this.lvl});
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
            self.model.set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate,
                "page": 1
            });
            this.collection.fetch({
                success: function() {
                    setTimeout(function() {
                        self.triggerMethod('fetched');
                    }, 1000);
                },
                data: self.model.attributes
            });
            Backbone.history.navigate(Backbone.history.fragment.split("/")[0] + "/" + self.model.getUrlArgs());
        } else {
            console.log("Some value is empty!");
        }
    }

});

module.exports = Table;