var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

var SD_MAP = {
    "sex": {
        "male": "Мужчин",
        "female": "Женщин"
    },
    "age": {
        "15-17": "от 15 до 17",
        "18-24": "от 18 до 24",
        "25-34": "от 25 до 34",
        "35-44": "от 35 до 44",
        "45+": "после 45"
    },
    "education": {
        "lte9": "С не полным среднем",
        "11": "С среднем",
        "bachelor": "С не полным высшим",
        "master": "С высшим"
    },
    "children_lt_16": {
        "yes": "Есть",
        "no": "Нету"
    },
    "marital_status": {
        "single": "Не женатых/замужем",
        "married": "Женатых/Замужем",
        "widow(er)": "Вдовцов/Вдов",
        "divorced": "Разведенных",
        "liveTogether": "Проживающих вместе"
    },
    "occupation": {
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
    },
    "group": {
        "1": "Не имеют достаточно денег для приобретения продуктов",
        "2": "Имеют достаточно денег для приобретения продуктов",
        "3": "Имеют достаточно денег для приобретения продуктов и одежды",
        "4": "Имеют достаточно денег для приобретения товаров длительного пользования",
        "5": "Могут позволить себе покупать действительно дорогие вещи"
    },
    "income": {
        "noAnswer": "Не ответили",
        "0-1000": "до 1000",
        "1001-2000": "от 1000 до 2000",
        "2001-3000": "от 2000 до 3000",
        "3001-4000": "от 3000 до 4000",
        "4001-5000": "от 4000 до 5000",
        "gt5001": "более 5000"
    },
    "region": {
        "west": "Запад",
        "center": "Центр",
        "east": "Восток",
        "south": "Юг"
    },
    "typeNP": {
        "50+": "50+",
        "50-": "50-"
    }
};

var Themes = Backbone.Collection.extend({
    url: 'charts/themes'
});


var ThemeItem = Marionette.ItemView.extend({
    initialize: function() {
        this.$el.attr("label", this.model.get("market"));
    },
    tagName: "optgroup",
    template: require('../../templates/theme_item.html')
});

module.exports = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new Themes();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/charts/keyword-chart-sd.html'),

    childView: ThemeItem,
    childViewContainer: '.themes-list',

    ui: {
        "dynamicChart": ".demo-vertical-bar-chart",
        "donutChart": "#demo-donut-chart",
        "reportRange": ".time-range",
        "input": ".time-range input",
        "themesList": ".themes-list",
        "inputThemeList": ".theme-list-query",
        "sdList": ".sd-list",
        "inputSdList": ".sd-list-query",
        "addChart": "#add-chart"
    },

    behaviors: {
        jQueryBehaviorOnFetch: {
            '@ui.themesList': {
                'multiselect': {
                    maxHeight: 300,
                    enableFiltering: true,
                    buttonClass: 'btn btn-default btn-sm themesList',
                    nonSelectedText: 'Выберите тему',
                    onChange : function(option, checked) {
                        this.$select.parent().children(".theme-list-query").trigger("change", [option.val(), checked]);
                    }
                }
            },
            '@ui.sdList': {
                'multiselect': {
                    maxHeight: 300,
                    enableFiltering: true,
                    buttonClass: 'btn btn-default btn-sm sdList',
                    nonSelectedText: 'Выберите cоц. демо',
                    onChange : function(option, checked) {
                        this.$select.parent().children(".sd-list-query").trigger("change", [option.val(), checked]);
                    }
                }
            }
        },
        ToggleBehavior: {},
        DatePickerBehavior: {}
    },

    events: {
        'change @ui.inputThemeList': 'filterCollection',
        'change @ui.inputSdList': 'filterCollectionSd',
        'change @ui.input': 'filterCollectionDates',
        'click @ui.addChart': "addChart"
    },

    filterCollection: function(event, val, isTrue) {
        this.model.set("key_word", val);
        this.ui.dynamicChart = this.$(event.target).parents(".widget").find(".demo-vertical-bar-chart");
        this.query();
    },

    filterCollectionSd: function(event, val, isTrue) {
        this.model.set("sd", val);
        this.ui.dynamicChart = this.$(event.target).parents(".widget").find(".demo-vertical-bar-chart");
        this.query();
    },

    filterCollectionDates: function(event, data) {
        if (!this.options.permissions.free_time) return;

        var self = this;
        if (data.fromDate && data.toDate) {
            self.model.set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate
            });
            this.ui.dynamicChart = this.$(event.target).parents(".widget").find(".demo-vertical-bar-chart");
            this.query();
        } else {
            console.log("Some value is empty!");
        }
    },

    query: function() {
        var self = this;
        $.ajax({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            dataType: "json",
            contentType: "application/json",
            url: "/charts/keyword-fg-sd/",
            data: this.model.toJSON(),
            success: function( respond, textStatus, jqXHR ){
                self.buildDynamicGraph(self.processGraphData(respond));
                // self.buildCircleGraph(self.processCircleGraphData(respond));
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log(jqXHR);
            }
        });
    },

    processGraphData: function (data) {
        var self = this;
        var sdKey = this.model.get("sd");

        if (sdKey === undefined){
            var result = _.chain(data)
                .groupBy(function(item) { return item.key_word; })
                .mapObject(function(val, key) {
                    return _.map(val,function(item){
                        return [self.gt.apply(self, item.date.split("-")), item.views]
                    });
                })
                .pairs()
                .map(function (item) {
                    return {label: item[0], data: item[1]};
                })
                .value();
        } else {
            result = {};
            var keys = _.keys(SD_MAP[sdKey]);

            _.each(keys, function(el){
                result[el] = [];
            });

            _.each(data, function (el_i) {
                _.each(keys, function (el_j) {
                    var views = el_i[sdKey][el_j];
                    views = (views !== undefined) ? views/100.0 * el_i.views : 0;
                    result[el_j].push([self.gt.apply(self, el_i.date.split("-")), views]);
                })
            });

            result = _.chain(result).pairs()
                      .map(function (item) {
                            return {label: item[0], data: item[1]};
                        })
                      .value();
        }

        return result;
    },

    processCircleGraphData: function (data) {

        var results =  _.chain(data)
                        .groupBy(function(item) { return item.key_word; })
                        .mapObject(function(val, key) {
                            return _.reduce(val, function(memo, item){
                                return memo + item.views;
                            }, 0);
                        })
                        .pairs()
                        .map(function (item) {
                            return {label: item[0], data: item[1]};
                        })
                        .value();

        var total = results.reduce(function(memo, item) {
            return memo + item.data
        }, 0);

        results.forEach(function(item) {
            item.data = (item.data * 100 / total).toFixed(2);
        });

        return results;
    },

    // get day function
    gt: function(y, m, d) {
        return new Date(y, m-1, d).getTime();
    },

    buildDynamicGraph: function (data) {
        var config = {
            bars: {
                show: true,
                barWidth: 4,
                fill: true,
                order: true,
                lineWidth: 4,
                fillColor: { colors: [ { opacity: 1 }, { opacity: 1 } ] }
            },
            grid: {
                hoverable: true,
                clickable: true,
                borderWidth: 0,
                tickColor: "#E4E4E4"
            },
            yaxis: {
                font: { color: "#555" }
            },
            xaxis: {
                mode: "time",
                timezone: "browser",
                timeformat: "%d/%m/%y",
                font: { color: "#555" },
                tickColor: "#fafafa"
            },
            legend: {
                labelBoxBorderColor: "transparent",
                backgroundColor: "transparent"
            },
            tooltip: true,
            tooltipOpts: {
                content: '%s: %y'
            }
        };
        console.log(data);
        $.plot(this.ui.dynamicChart, data, config);
    },

    buildCircleGraph: function (data) {

        var donutLabelFormatter = function (label, series) {
            return "<div class=\"donut-label\">" + label + "<br/>" + Math.round(series.percent) + "%</div>";
        };

        var config = {
            series: {
                pie: {
                    show: true,
                    innerRadius: .4,
                    stroke: {
                        width: 4,
                        color: "#ffffff"
                    },
                    label: {
                        show: true,
                        radius: 3/4,
                        formatter: donutLabelFormatter
                    }
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true
            }
        };

        $.plot('#demo-donut-chart', data, config);
    },

    onShow: function() {
        var self = this;
        this.collection.fetch({
            success: function() {
                if (self.history) {
                    Backbone.history.navigate(self.history);
                }
                self.triggerMethod('fetched');
            },
            data: this.model.attributes
        });
        self.query();
    },

    addChart: function () {
        this.$el.append(require('../../templates/charts/keyword-chart-sd-tmpl.html'));
        var marketsTmpl = _.template(
            '<% for(var i in collection) { %>\n' +
            '<optgroup label="<%= collection[i].market %>">\n' +
            '    <% for(var j in collection[i].keywords) { %>\n' +
            '    <option value="<%= collection[i].keywords[j] %>"><%= collection[i].keywords[j] %></option>\n' +
            '    <% } %>\n' +
            '</optgroup>\n' +
            '<% } %>');
        this.$(".themes-list").html(marketsTmpl({collection: this.collection.toJSON()}));
        this.triggerMethod("updateDateControls", this.$(".time-range").last(), this.$(".time-range input").last, this.options);
        this.triggerMethod('fetched');
    }

});