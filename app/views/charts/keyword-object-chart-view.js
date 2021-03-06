//keyword-object-chart-view.js

var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

var marketsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<optgroup label="<%= collection[i].market %>">\n' +
    '    <% for(var j in collection[i].keywords) { %>\n' +
    '    <option value="<%= collection[i].keywords[j] %>"><%= collection[i].keywords[j] %></option>\n' +
    '    <% } %>\n' +
    '</optgroup>\n' +
    '<% } %>');

var objectsTmpl = _.template(
    '<% for(var i in collection) { %>\n' +
    '<optgroup label="<%= collection[i].key_word %>">\n' +
    '    <% for(var j in collection[i].objects) { %>\n' +
    '    <option value="<%= collection[i].objects[j] %>"><%= collection[i].objects[j] %></option>\n' +
    '    <% } %>\n' +
    '</optgroup>\n' +
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
    template: require('../../templates/charts/keyword-object-chart-view.html'),

    childView: ThemeItem,
    childViewContainer: '.markets-selection',

    ui: {
        "dynamicChart": ".demo-vertical-bar-chart",
        "donutChart": ".demo-donut-chart",
        "reportRange": ".time-range",
        "input": ".time-range input",
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
            }
        },
        ToggleBehavior: {},
        DatePickerBehavior: {}
    },

    events: {
        'change @ui.input': 'filterCollectionDates',
        'change @ui.wizard': "wizardChange",
        'stepclick @ui.wizard': "stepClick",
        'click @ui.wizardNext': "wizardNext",
        'click @ui.wizardPrev': "wizardPrev"
    },

    filterCollectionDates: function(event, data) {
        if (!this.options.permissions.free_time) return;

        var self = this;
        if (data.fromDate && data.toDate) {
            self.model.set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate
            });
            this.query((self.model.has("object__in")) ? "object" : "key_word");
        } else {
            console.log("Some value is empty!");
        }
    },

    query: function(groupBy) {
        var self = this;
        //(groupBy === "key_word") ? "/charts/keyword/" : "/charts/object/",
        var url = this.model.get("url") || "/charts/keyword-fg/";
        $.ajax({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            dataType: "json",
            contentType: "application/json",
            url: url,
            data: _.omit(this.model.toJSON(), "url"),
            success: function( respond, textStatus, jqXHR ){
                self.buildDynamicGraph(self.processGraphData(respond, groupBy), groupBy);
                self.buildCircleGraph(self.processCircleGraphData(respond, groupBy), groupBy);
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

    processGraphData: function (data, groupBy) {
        var self = this;
        var maxDate = new Date(_.max(data, function(item) {return new Date(item.date)}).date);
        maxDate.setDate(maxDate.getDate() + 6);
        var minDate = new Date(_.min(data, function(item) {return new Date(item.date)}).date);
        minDate.setDate(minDate.getDate() - 6);
        var dateDict = _.chain(data)
            .map(function(item){ return item.date; })
            .uniq()
            .sortBy(function(item) {return new Date(item)})
            .map(function (item) { return {x: item, y: 0};})
            .value();
        return [_.chain(data)
            .groupBy(function(item) { return item[groupBy]; })
            .mapObject(function(val, key) {
                return _.chain(val)
                    .map(function(item){
                        return { x: item.date, y: item.views};
                    })
                    .sortBy(function(item) { return new Date(item.x); })
                    .union(dateDict)
                    .uniq("x")
                    .sortBy(function(item) { return new Date(item.x); })
                    .value();
            })
            .pairs()
            .map(function (item) {
                return {
                    label: item[0],
                    data: item[1],
                    backgroundColor: self.stringToColour(item[0]),
                    borderColor : "#111",
                    borderWidth : 1
                };
            })
            .value(), minDate, maxDate];
    },

    processCircleGraphData: function (data, groupBy) {
        var self = this;
        var results =  _.chain(data)
            .groupBy(function(item) { return item[groupBy]; })
            .mapObject(function(val, key) {
                return _.reduce(val, function(memo, item){
                    return memo + item.views;
                }, 0);
            })
            .pairs()
            .map(function (item) {
                return {
                    label: item[0],
                    data: item[1],
                    backgroundColor: self.stringToColour(item[0]),
                    borderColor : "#111",
                    borderWidth : 1
                };
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

    buildDynamicGraph: function (data, groupBy) {
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

    buildCircleGraph: function (data, groupBy) {
        var self = this;
        if (self.donutChart === undefined) {
            self.donutChart = new Chart(self.ui.donutChart, {
                type: 'doughnut',
                data: {
                    labels: _.map(data, function(item) { return item.label; }),
                    datasets: [{
                        data: _.map(data, function(item) { return item.data; }),
                        backgroundColor: _.map(data, function(item) { return item.backgroundColor; })
                    }]
                },
                options: {
                    maintainAspectRatio: false
                }
            });
        } else {
            self.donutChart.data.labels = _.map(data, function(item) { return item.label; });
            self.donutChart.data.datasets = [{
                data: _.map(data, function(item) { return item.data; }),
                backgroundColor: _.map(data, function(item) { return item.backgroundColor; })
            }];
            self.donutChart.update();
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
            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.queryObjectsList(function(objects){
                $wrapper.find(".objects-selection").html(objectsTmpl({collection: objects}));
                self.triggerMethod('fetched');
            });
        } else if (data.step === 2) {
            self.model.unset("object__in");
            self.model.unset("url");
            $btnNext.show();
            $btnSuccess.addClass("hidden");
            self.withoutObject = false;
        } else if (data.step === 1) {
            self.model.unset("object__in");
            self.model.unset("url");
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
            var groupBy = "key_word";

            if (url.length > 0) {
                this.model.set("url", url[0]);
            } else {
                return false;
            }

            if (this.withoutObject === true) {
                titleKey = "key_word__in";
            } else {
                var titleKey = "object__in";
                this.model.set("url", url[0].replace("keyword", "object"));
                groupBy = "object";
            }

            this.ui.dynamicChart = $wrapper.find(".demo-vertical-bar-chart");

            var provider = url[0].includes("-fg") ? "Factum" : "Admixer";

            $wrapper.find(".sd-chart-title").html(JSON.parse(this.model.get(titleKey)).join() + " " + provider);

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