//keyword-object-chart-sd.js

var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

var FACTRUM_SD_MAP = {
    "sex": {
        "male": "Мужчины",
        "female": "Женщины"
    },
    "age": {
        "15-17": "от 15 до 17",
        "18-24": "от 18 до 24",
        "25-34": "от 25 до 34",
        "35-44": "от 35 до 44",
        "45+": "после 45"
    },
    "education": {
        "lte9": "Неполное cреднее",
        "11": "Среднее",
        "bachelor": "Неполное высшее",
        "master": "Высшее"
    },
    "children_lt_16": {
        "yes": "Есть",
        "no": "Нет"
    },
    "marital_status": {
        "single": "Не женат\\не замужем",
        "married": "Женат\\земужем",
        "widow(er)": "Вдовец\\Вдова",
        "divorced": "Разведен (а)",
        "liveTogether": "Проживают вместе"
    },
    "occupation": {
        "businessOwner": "Владелецев бизнеса с наёмными сотрудниками",
        "entrepreneur": "Частные предприниматели",
        "hiredManager": "Наемные руководители",
        "middleManager": "Руководители среднего звена",
        "masterDegreeSpecialist": "Специалисты с высшим образованием",
        "employee": "Служащие",
        "skilledWorker": "Квалифицированные рабочие",
        "otherWorkers": "Другие рабочие и технический персонал",
        "mobileWorker": "Мобильные работники",
        "militaryPoliceman": "Военнослужащие\\сотрудники правоохранительных органов",
        "student": "Студент\\школник",
        "pensioner": "Пенсионеры",
        "disabled": "Инвалиды",
        "housewife": "Домохозяйки",
        "maternityLeave": "В декретном отпуске",
        "temporarilyUnemployed": "Временно безработные",
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
        "0-1000": "до 1000 грн.",
        "1001-2000": "от 1000 грн. до 2000 грн.",
        "2001-3000": "от 2000 грн. до 3000 грн.",
        "3001-4000": "от 3000 грн. до 4000 грн.",
        "4001-5000": "от 4000 грн. до 5000 грн.",
        "gt5001": "более 5000 грн."
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
        1: "Мужчины",
        2: "Женщины"
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
        "<option value=\"gender\">Гендер</option>\n" +
        "<option value=\"platform\">Платформа</option>\n" +
        "<option value=\"browser\">Браузер</option>\n" +
        "<option value=\"age\">Возраст</option>\n" +
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

var objectsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<optgroup label="<%= collection[i].key_word %>">\n' +
    '    <% for(var j in collection[i].objects) { %>\n' +
    '    <option value="<%= collection[i].objects[j] %>"><%= collection[i].objects[j] %></option>\n' +
    '    <% } %>\n' +
    '</optgroup>\n' +
    '<% } %>');

var simpleObjectsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<option value="<%= collection[i].object %>"><%= collection[i].object %></option>\n' +
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
    template: require('../../templates/charts/keyword-object-chart-sd.html'),

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
        "selectObject": "select.objects-selection",
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
            '@ui.selectObject': {
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
        'stepclick @ui.wizard': "stepClick",
        'click @ui.wizardNext': "wizardNext",
        'click @ui.wizardPrev': "wizardPrev"
    },

    filterCollectionSd: function(event, val, isTrue) {
        this.model.set("sd", val);
        this.ui.dynamicChart = this.$(event.target).parents(".widget").find(".demo-vertical-bar-chart");
        var url = this.model.get("url") || "/charts/keyword-fg-sd/";
        var sdMap = (url.includes("-fg-")) ? FACTRUM_SD_MAP : ADMIXER_SD_MAP;
        this.buildDynamicGraph(this.processGraphData(this.respond, sdMap, url, val));
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
            this.query((self.model.has("object__in")) ? "object" : "key_word");
        } else {
            console.log("Some value is empty!");
        }
    },

    query: function(groupBy) {
        var self = this;
        //(groupBy === "key_word") ? "/charts/keyword/" : "/charts/object/",
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
                self.respond = respond;
                self.buildDynamicGraph(self.processGraphData(respond, sdMap, url, groupBy));
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log(jqXHR);
            }
        });
    },

    queryObjectsList: function(successCb) {
        var self = this;
        $.ajax({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            dataType: "json",
            contentType: "application/json",
            url: "/charts/objects/",
            data: this.model.toJSON(),
            success: successCb,
            error: function( jqXHR, textStatus, errorThrown ){
                console.log(jqXHR);
            }
        });
    },

    stringToColour: function(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    },

    processGraphData: function (data, sdMap, url, groupBy) {
        var self = this;
        var sdKey = this.model.get("sd");
        var maxDate = new Date(_.max(data, function(item) {return new Date(item.date)}).date);
        var minDate = new Date(_.min(data, function(item) {return new Date(item.date)}).date);
        maxDate.setDate(maxDate.getDate() + 6);
        minDate.setDate(minDate.getDate() - 6);
        var dateDict = _.chain(data)
            .map(function(item){ return item.date; })
            .uniq()
            .sortBy(function(item) {return new Date(item)})
            .map(function (item) { return {x: item, y: 0};})
            .value();

        var result = {};

        _.each(_.values(sdMap[sdKey]), function(el){
            result[el] = [];
        });

        if (url.includes("-fg-") && !url.includes("object")) {
            _.each(data, function (el_i) {
                _.each(sdMap[sdKey], function (el_j_v, el_j_k) {
                    var views = el_i[sdKey][el_j_k];
                    views = (views !== undefined) ? views/100.0 * el_i.views : 0;
                    result[el_j_v].push([el_i.date, views]);
                })
            });
        } else {
            _.each(data, function (el_i) {
                _.each(sdMap[sdKey], function (el_j_v, el_j_k) {
                    var views = el_i[sdKey][el_j_k];
                    result[el_j_v].push([el_i.date, views]);
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
        }).pairs().map(function (item) {
            return {
                label: item[0],
                data: _.chain(item[1])
                        .sortBy(function (el) {
                            return el[0];})
                        .map(function(el){
                            return {x:el[0], y:el[1]};})
                        .value(),
                backgroundColor: self.stringToColour(item[0]),
                borderColor : "#111",
                borderWidth : 1
            };
        }).value();

        return [result, minDate, maxDate];
    },

    buildDynamicGraph: function (data) {
        var self = this;
        if (self.barChart === undefined) {
            self.barChart = new Chart(this.ui.dynamicChart, {
                type: 'bar',
                data: {
                    datasets: data[0]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: 'week',
                                displayFormats: {
                                    quarter: 'll'
                                },
                                min: data[1],
                                max: data[2]
                            }
                        }]
                    },
                    'onClick' : function (evt, item) {
                        var el = this.getElementAtEvent(evt);
                        if (el.length > 0) {
                            var provider = (self.model.get("url").includes("-fg-")) ?
                                'specific-social-demo-rating-fg/' : 'specific-social-demo-rating-admixer/';
                            var fromDate = data[1];
                            fromDate.setDate(fromDate.getDate() + 6);
                            var toDate = data[2];
                            toDate.setDate(toDate.getDate() - 6);

                            var history = provider +
                                moment(fromDate).format('YYYY-MM-DD') + "/" +
                                moment(toDate).format('YYYY-MM-DD') + "/" +
                                self.model.get("key_word__in");
                            Backbone.history.navigate(history);
                        }
                    }
                }
            });
        } else {
            self.barChart.data.datasets = data[0];
            self.barChart.options.scales.xAxes[0].time.min = data[1];
            self.barChart.options.scales.xAxes[0].time.max = data[2];
            self.barChart.update();
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
    },

    addChart: function (event) {
        var chartSdTmpl = require('../../templates/charts/keyword-object-chart-sd-tmpl.html');
        this.$el.append(chartSdTmpl({"uid": Math.round(event.timeStamp)}));
        this.$(".markets-selection").html(simpleMarketsTmpl({collection: this.collection.toJSON()}));
        this.triggerMethod('fetched');
    },

    stepClick: function(e, data) {
        var self = this;
        var $wrapper = $(e.target).parents(".wizard-wrapper");
        var $btnNext = $wrapper.find('.btn-primary.btn-next');
        var $btnSuccess = $wrapper.find('.btn-success.btn-next');
        if (data.step === 4){
            $btnNext.hide();
            $btnSuccess.removeClass("hidden");
        } else if (data.step === 3) {
            self.model.unset("object__in");
            self.model.unset("url");
            self.model.unset("sd");
            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.queryObjectsList(function(objects){
                $wrapper.find(".objects-selection").html(objectsTmpl({collection: objects}));
                self.triggerMethod('fetched');
            });
        } else if (data.step === 2) {
            self.model.unset("object__in");
            self.model.unset("url");
            self.model.unset("sd");
            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.withoutObject = false;
        } else if (data.step === 1) {
            self.model.unset("object__in");
            self.model.unset("url");
            self.model.unset("sd");
            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.withoutObject = false;
        }
    },

    wizardChange: function (e, data) {

        var self = this;
        var $wrapper = $(e.target).parents(".wizard-wrapper");
        var $btnNext = $wrapper.find('.btn-primary.btn-next');
        var $btnSuccess = $wrapper.find('.btn-success.btn-next');

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
            $btnSuccess.addClass("hidden");
            self.withoutObject = false;

        } else if(data.step === 2 && data.direction === 'next') {
            themes = _.map($wrapper.find('.form2').serializeArray(), function (item) {
                return item.value;
            });

            if (themes.length > 0) {
                this.model.set("key_word__in", JSON.stringify(themes));
            } else {
                return false;
            }

            this.queryObjectsList(function(objects){
                $wrapper.find(".objects-selection").html(objectsTmpl({collection: objects}));
                self.triggerMethod('fetched');
            });

            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.withoutObject = false;

        } else if(data.step === 3 && data.direction === 'next') {

            var objects = _.map($wrapper.find('.form3').serializeArray(), function (item) {
                return item.value;
            });

            self.withoutObject = false;

            if (objects.length > 0) {
                this.model.set("object__in", JSON.stringify(objects));
            } else {
                this.model.unset("object__in");
                self.withoutObject = true;
            }

            $btnNext.hide();
            $btnSuccess.removeClass("hidden");

        } else if (data.step === 4 && data.direction === 'next' ) {

            var url = _.map($wrapper.find('.form4').serializeArray(), function (item) {
                return item.value;
            });

            if (url.length <= 0) {
                return false;
            }

            this.model.set("url", url[0]);
            if (url[0].includes("-fg-")) {
                var listTemplate = fgListTmpl;
                this.model.set("sd", "sex");
            } else {
                listTemplate = admixerListTmpl;
                this.model.set("sd", "gender");
            }

            var groupBy = "key_word";
            if (this.withoutObject === true) {
                titleKey = "key_word__in";

            } else {
                var titleKey = "object__in";
                this.model.set("url", url[0].replace("keyword", "object"));
                groupBy = "object";
            }

            this.ui.dynamicChart = $wrapper.find(".demo-vertical-bar-chart");

            $wrapper.find(".sd-chart-title").html(JSON.parse(this.model.get(titleKey)).join());

            $wrapper.find(".sd-chart-list").html(listTemplate);
            this.triggerMethod('fetched');
            this.triggerMethod("updateDateControls", $wrapper.find(".time-range"), $wrapper.find(".time-range input"), this.options, this.model);
            this.query(groupBy);
            $btnNext.hide();
            $btnSuccess.addClass("hidden");

        } else if (data.step === 5 && data.direction === 'previous'){
            $btnNext.hide();
            $btnSuccess.removeClass("hidden");
        } else {
            $btnNext.show();
            $btnSuccess.addClass("hidden");
        }
    },

    wizardNext: function (event) {
        this.isSuccessButton = this.$(event.target).hasClass('btn-success');
        this.$(event.target).parents(".wizard-wrapper").find(".wizard").wizard('next');
    },

    wizardPrev: function () {
        this.$(event.target).parents(".wizard-wrapper").find(".wizard").wizard('previous');
    }

});