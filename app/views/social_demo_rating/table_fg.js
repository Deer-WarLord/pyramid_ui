var Marionette = require('backbone.marionette');
var moment = require("../../assets/js/plugins/moment/moment");
var SocialDemoRatingCollection = require('../../collections/social_demo_rating_fg');

var SexGroupsMap = {
    "male": "Мужчин",
    "female": "Женщин"
};

var AgeGroupsMap = {
    "15-17": "от 15 до 17",
    "18-24": "от 18 до 24",
    "25-34": "от 25 до 34",
    "35-44": "от 35 до 44",
    "45+": "после 45"
};

var EducationGroupsMap = {
    "lte9": "С не полным среднем",
    "11": "С среднем",
    "bachelor": "С не полным высшим",
    "master": "С высшим"
};

var ChildrenGroupsMap = {
    "yes": "Есть",
    "no": "Нету"
};

var MaritalStatusMap = {
    "single": "Не женатых/замужем",
    "married": "Женатых/Замужем",
    "widow(er)": "Вдовцов/Вдов",
    "divorced": "Разведенных",
    "liveTogether": "Проживающих вместе"
};

var OccupationMap = {
    "businessOwner": "Владелецев бизнеса с наёмными сотрудниками",
    "entrepreneur": "Частных предпринимателей",
    "hiredManager": "Наёмных руководителей",
    "middleManager": "Руководителей среднего звена",
    "masterDegreeSpecialist": "Специалистов с высшим образованием",
    "employee": "Служащих",
    "skilledWorker": "Квалифицированных рабочих",
    "otherWorkers": "Других рабочих и технического персонала",
    "mobileWorker": "Мобильных работников",
    "militaryPoliceman": "Военнослужащих/Сотрудников правоохранительных органов",
    "student": "Студентов/Школьников",
    "pensioner": "Пенсионеров",
    "disabled": "Инвалидов",
    "housewife": "Домохозяек",
    "maternityLeave": "В декретном отпуске",
    "temporarilyUnemployed": "Временно безработных/ищущих работу",
    "other": "Другие"
};

var GroupMap = {
    "1": "Не имеют достаточно денег для приобретения продуктов",
    "2": "Имеют достаточно денег для приобретения продуктов",
    "3": "Имеют достаточно денег для приобретения продуктов и одежды",
    "4": "Имеют достаточно денег для приобретения товаров длительного пользования",
    "5": "Могут позволить себе покупать действительно дорогие вещи"
};

var IncomeMap = {
    "noAnswer": "Не ответили",
    "0-1000": "до 1000",
    "1001-2000": "от 1000 до 2000",
    "2001-3000": "от 2000 до 3000",
    "3001-4000": "от 3000 до 4000",
    "4001-5000": "от 4000 до 5000",
    "gt5001": "более 5000"
};

var RegionMap = {
    "west": "Запад",
    "center": "Центр",
    "east": "Восток",
    "south": "Юг"
};

var TypeNPMap = {
    "50+": "50+",
    "50-": "50-"
};


var Row = Marionette.LayoutView.extend({

    initialize: function(options) {
        this.aggregator = options.attributes.aggregator;
    },

    tagName: 'tr',

    getTemplate: function(){
        if (this.aggregator && this.aggregator === "publication"){
            return require('../../templates/social_demo_rating/fg/row_publication.html');
        } else {
            return require('../../templates/social_demo_rating/fg/row.html');
        }
    },

    templateHelpers: {

        getSex: function(sex) {
            var newData = {};
            for (var key in sex) {
                newData[SexGroupsMap[key]] = sex[key];
            }
            return newData;
        },

        getAge: function(age_groups) {
            var newData = {};
            for (var key in age_groups) {
                newData[AgeGroupsMap[key]] = age_groups[key];
            }
            return newData;
        },

        getEducation: function(education) {
            var newData = {};
            for (var key in education) {
                newData[EducationGroupsMap[key]] = education[key];
            }
            return newData;
        },

        getСhildrenLt16: function(children_lt_16) {
            var newData = {};
            for (var key in children_lt_16) {
                newData[ChildrenGroupsMap[key]] = children_lt_16[key];
            }
            return newData;
        },

        getMaritalStatus: function (marital_status) {
            var newData = {};
            for (var key in marital_status) {
                newData[MaritalStatusMap[key]] = marital_status[key];
            }
            return newData;
        },

        getOccupation: function (occupation) {
            var newData = {};
            for (var key in occupation) {
                newData[OccupationMap[key]] = occupation[key];
            }
            return newData;
        },

        getGroup: function (group) {
            var newData = {};
            for (var key in group) {
                newData[GroupMap[key]] = group[key];
            }
            return newData;
        },

        getIncome: function (income) {
            var newData = {};
            for (var key in income) {
                newData[IncomeMap[key]] = income[key];
            }
            return newData;
        },

        getRegion: function (region) {
            var newData = {};
            for (var key in region) {
                newData[RegionMap[key]] = region[key];
            }
            return newData;
        },

        getTypeNP: function (typeNP) {
            var newData = {};
            for (var key in typeNP) {
                newData[TypeNPMap[key]] = typeNP[key];
            }
            return newData;
        }
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
        this.childViewOptions = options.model;

        if (!this.options.permissions.free_time || !this.model.get("posted_date__gte")) {
            this.model.set({
                "posted_date__gte": this.options.fixed_dates[0],
                "posted_date__lte": this.options.fixed_dates[1]
            });
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/social_demo_rating/fg/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: 'tbody',

    ui: {
        "reportRange": "#fg-reportrange",
        "input": "#fg-reportrange input",
        "rowFilter": "#fg-datatable-social-demo_wrapper .row-filter input",
        "table": "#fg-datatable-social-demo"
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
                    "scrollX": true,
                    sDom: "RCt",
                    colVis: {
                        buttonText: 'Show / Hide Columns',
                        restore: "Restore",
                        showAll: "Show all"
                    }
                }
            }
        },
        ToggleBehavior: {},
        ExportBehavior: {},
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