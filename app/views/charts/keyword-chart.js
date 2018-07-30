var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

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
    template: require('../../templates/charts/keyword-chart.html'),

    childView: ThemeItem,
    childViewContainer: '#themes-list',

    ui: {
        "dynamicChart": "#demo-vertical-bar-chart",
        "donutChart": "#demo-donut-chart",
        "reportRange": "#time-range",
        "input": "#time-range input",
        "themesList": "#themes-list",
        "inputThemeList": "#theme-list-query"
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
                        this.$select.parent().children("#theme-list-query").trigger("change", [option.val(), checked]);
                    }
                }
            }
        },
        ToggleBehavior: {},
        DatePickerBehavior: {}
    },

    events: {
        'change @ui.inputThemeList': 'filterCollection',
        'change @ui.input': 'filterCollectionDates'
    },

    filterCollection: function(event, val, isTrue) {
        var keywords = JSON.parse(this.model.get("key_word__in") || "[]");
        if (isTrue) {
            keywords.push(val);
        } else {
            keywords = _.without(keywords, val);
        }
        this.model.set("key_word__in", JSON.stringify(keywords));
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
            url: "/charts/keyword/",
            data: this.model.toJSON(),
            success: function( respond, textStatus, jqXHR ){
                self.buildDynamicGraph(self.processGraphData(respond));
                self.buildCircleGraph(self.processCircleGraphData(respond));
            },
            error: function( jqXHR, textStatus, errorThrown ){
                console.log(jqXHR);
            }
        });
    },

    processGraphData: function (data) {
        var self = this;
        return _.chain(data)
                .groupBy(function(item) { return item.key_word; })
                .mapObject(function(val, key) {
                    return _.map(val,function(item){
                        return [self.gt.apply(self, item.date.split("-")), item.publication_amount]
                    });
                })
                .pairs()
                .map(function (item) {
                    return {label: item[0], data: item[1]};
                })
                .value();
    },

    processCircleGraphData: function (data) {

        var results =  _.chain(data)
                        .groupBy(function(item) { return item.key_word; })
                        .mapObject(function(val, key) {
                            return _.reduce(val, function(memo, item){
                                return memo + item.publication_amount;
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
    }

});