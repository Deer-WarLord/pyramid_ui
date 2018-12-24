var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

var FACTRUM_SD_MAP = {
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

var ADMIXER_SD_MAP = {
    "platform": {
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
    },
    "browser": {
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
    },
    "region": {

    },
    "age": {
        0: "Неизвестно",
        1: "до 18",
        2: "от 18 до 24",
        3: "от 25 до 34",
        4: "от 35 до 44",
        5: "после 45"
    },
    "gender": {
        0: "Неизвестно",
        1: "Мужчин",
        2: "Женщин"
    },
    "income": {

    }
};

var fgListTmpl = "<div class=\"control-inline toolbar-item-group sd-chart-list\">\n" +
    "<select class=\"sd-list\" name=\"sdList\">\n" +
        "<option value=\"sex\">Пол</option>\n" +
        "<option value=\"age\">Возраст</option>\n" +
        "<option value=\"education\">Образование</option>\n" +
        "<option value=\"children_lt_16\">Дети младше 16</option>\n" +
        "<option value=\"marital_status\">Семейный статус</option>\n" +
        "<option value=\"occupation\">Род занятий</option>\n" +
        "<option value=\"group\">Групп населения</option>\n" +
        "<option value=\"income\">Доход</option>\n" +
        "<option value=\"region\">Регион</option>\n" +
        "<option value=\"typeNP\">ТипНП</option>\n" +
    "</select>\n" +
    "<input class=\"sd-list-query\" type=\"hidden\"/>\n" +
"</div>";

var admixerListTmpl = "<div class=\"control-inline toolbar-item-group sd-chart-list\">\n" +
    "<select class=\"sd-list\" name=\"sdList\">\n" +
        "<option value=\"platform\">Платформа</option>\n" +
        "<option value=\"browser\">Браузер</option>\n" +
        "<option value=\"age\">Возраст</option>\n" +
        "<option value=\"gender\">Гендер</option>\n" +
        "<!--<option value=\"region\">Регион</option>-->\n" +
        "<!--<option value=\"income\">Групп населения</option>-->\n" +
    "</select>\n" +
    "<input class=\"sd-list-query\" type=\"hidden\"/>\n" +
"</div>";


var marketsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<optgroup label="<%= collection[i].market %>">\n' +
    '    <% for(var j in collection[i].keywords) { %>\n' +
    '    <option value="<%= collection[i].keywords[j] %>"><%= collection[i].keywords[j] %></option>\n' +
    '    <% } %>\n' +
    '</optgroup>\n' +
    '<% } %>');

var simpleMarketsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<option value="<%= collection[i].market %>"><%= collection[i].market %></option>\n' +
    '<% } %>');

var Themes = Backbone.Collection.extend({
    url: 'charts/themes'
});

var ThemeItem = Marionette.ItemView.extend({
    initialize: function() {
        this.$el.attr("value", this.model.get("market"));
    },
    tagName: "option",
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
    childViewContainer: '.markets-selection',

    ui: {
        "dynamicChart": ".demo-vertical-bar-chart",
        "reportRange": ".time-range",
        "input": ".time-range input",
        "sdList": ".sd-list",
        "inputSdList": ".sd-list-query",
        "addChart": "#add-chart",
        "selectMarket": ".markets-selection",
        "selectThemeCompany": "select.themes-selection",
        "wizard": ".wizard",
        "wizardNext": ".wizard-wrapper .btn-next",
        "wizardPrev": ".wizard-wrapper .btn-prev"
    },

    behaviors: {
        jQueryBehaviorOnFetch: {
            '@ui.selectMarket': {
                'multiselect': {
                    maxHeight: 400,
                    enableFiltering: true,
                    buttonClass: 'btn btn-default btn-sm',
                    nonSelectedText: 'Рынки'
                }
            },
            '@ui.selectThemeCompany': {
                "select2": {}
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
        'change @ui.inputSdList': 'filterCollectionSd',
        'change @ui.input': 'filterCollectionDates',
        'click @ui.addChart': "addChart",
        'change @ui.wizard': "wizardChange",
        'click @ui.wizardNext': "wizardNext",
        'click @ui.wizardPrev': "wizardPrev"
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
        var url = this.model.get("url") || "/charts/keyword-fg-sd/";
        var sdMap = (url.includes("-fg-")) ? FACTRUM_SD_MAP : ADMIXER_SD_MAP;
        $.ajax({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            dataType: "json",
            contentType: "application/json",
            url: url,
            data: _.omit(this.model.toJSON(), "url"),
            success: function( respond, textStatus, jqXHR ){
                self.buildDynamicGraph(self.processGraphData(respond, sdMap, url));
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log(jqXHR);
            }
        });
    },

    processGraphData: function (data, sdMap, url) {
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

            _.each(_.values(sdMap[sdKey]), function(el){
                result[el] = [];
            });

            if (url.includes("-fg-")) {
                _.each(data, function (el_i) {
                    _.each(sdMap[sdKey], function (el_j_v, el_j_k) {
                        var views = el_i[sdKey][el_j_k];
                        views = (views !== undefined) ? views/100.0 * el_i.views : 0;
                        result[el_j_v].push([self.gt.apply(self, el_i.date.split("-")), views]);
                    })
                });
            } else {
                _.each(data, function (el_i) {
                    _.each(sdMap[sdKey], function (el_j_v, el_j_k) {
                        var views = el_i[sdKey][el_j_k];
                        result[el_j_v].push([self.gt.apply(self, el_i.date.split("-")), views]);
                    })
                });
            }

            result = _.chain(result).mapObject(function(val, key) {
                    return _.chain(val)
                            .groupBy(function(item) {return item[0];})
                            .mapObject(function(val, key){
                                return _.reduce(val, function(s, item) {
                                    return s + item[1]}, 0);
                            })
                            .pairs().value();
            }).pairs().map(function (item) { return {label: item[0], data: item[1]};}).value();

        }

        return result;
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
        try {
            $.plot(this.ui.dynamicChart, data, config);
        } catch (err) {
            alert("По этому запросу данных не найдено");
        }

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

    addChart: function (event) {
        var chartSdTmpl = require('../../templates/charts/keyword-chart-sd-tmpl.html');
        this.$el.append(chartSdTmpl({"uid": Math.round(event.timeStamp)}));
        this.$(".markets-selection").html(simpleMarketsTmpl({collection: this.collection.toJSON()}));
        this.triggerMethod('fetched');
    },

    wizardChange: function (e, data) {

        var $wrapper = $(e.target).parents(".wizard-wrapper");
        var $btnNext = $wrapper.find('.btn-next');

        if((data.step === 1 && data.direction === 'next')) {

            var markets = _.map($wrapper.find('.form1').serializeArray(), function (item) { return item.value; });

            if (markets.length > 0) {
                var themes = _.filter(this.collection.toJSON(), function (item) { return _.contains(markets, item.market); });
                $wrapper.find(".themes-selection").html(marketsTmpl({collection: themes}));
                this.triggerMethod('fetched');
            } else {
                return false;
            }

            $btnNext.show();
            $btnNext.text('Далее ').
            append('<i class="fa fa-arrow-right"></i>')
                .removeClass('btn-success').addClass('btn-primary');
        } else if(data.step === 2 && data.direction === 'next') {
            themes = _.map($wrapper.find('.form2').serializeArray(), function (item) {
                return item.value;
            });

            if (themes.length > 0) {
                this.model.set("key_word__in", JSON.stringify(themes));
            } else {
                return false;
            }

            $btnNext.show();
            $btnNext.text(' Построить график').prepend('<i class="fa fa-check-circle"></i>')
                .removeClass('btn-primary').addClass('btn-success');

        } else if (data.step === 3 && data.direction === 'next' ) {

            var url = _.map($wrapper.find('.form3').serializeArray(), function (item) {
                return item.value;
            });

            if (url.length > 0) {
                this.model.set("url", url[0]);
                var listTemplate = (url[0].includes("-fg-")) ? fgListTmpl : admixerListTmpl;
            } else {
                return false;
            }

            this.ui.dynamicChart = $wrapper.find(".demo-vertical-bar-chart");
            $wrapper.find(".sd-chart-title").html(JSON.parse(this.model.get("key_word__in")).join());
            $wrapper.find(".sd-chart-list").html(listTemplate);
            this.triggerMethod('fetched');
            this.triggerMethod("updateDateControls", $wrapper.find(".time-range"), $wrapper.find(".time-range input"), this.options);
            this.query();
            $btnNext.hide();

        } else if (data.step === 4 && data.direction === 'previous'){
            $btnNext.show();
            $btnNext.text(' Построить график').prepend('<i class="fa fa-check-circle"></i>')
                .removeClass('btn-primary').addClass('btn-success');
        } else {
            $btnNext.show();
            $btnNext.text('Далее ').
            append('<i class="fa fa-arrow-right"></i>')
                .removeClass('btn-success').addClass('btn-primary');
        }
    },

    wizardNext: function (event) {
        this.$(event.target).parents(".wizard-wrapper").find(".wizard").wizard('next');
    },

    wizardPrev: function () {
        this.$(event.target).parents(".wizard-wrapper").find(".wizard").wizard('previous');
    }

});