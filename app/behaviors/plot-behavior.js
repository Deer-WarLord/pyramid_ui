var Marionette = require('backbone.marionette');

var donutConfig = {
    series: {
        pie: {
            show: true,
            innerRadius: 30,
            label: {
                show: true,
                formatter: function (label, series) {
                    return "<div class=\"donut-label\">" + label + "<br/>" + Math.round(series.percent) + "%</div>";
                }
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

var gistConfig = {
    series: {
        bars: {
            show: true,
            barWidth: .2
        }
    },
    bars: {
        show: true,
        horizontal: true,
        barWidth: 0.2,
        fill: true,
        order: true,
        lineWidth: 0,
        fillColor: { colors: [ { opacity: 1 }, { opacity: 1 } ] }
    },
    grid: {
        hoverable: true,
        clickable: true,
        borderWidth: 0,
        tickColor: "#E4E4E4"

    },
    xaxis: {
        autoscaleMargin: 0.2
    },
    yaxis: {
        ticks: null
    },
    legend: {
        show: false
    },
    tooltip: true,
    tooltipOpts: {
        content: '%s: %x'
    }
};

module.exports = Marionette.Behavior.extend({

    ui: {
        "socialDemoItem": ".social-demo-item"
    },

    events: {
        'click @ui.socialDemoItem': 'showPlot'
    },

    showPlot: function(e) {
        e.preventDefault();
        var self = this;
        var total = 0;
        var data = [];
        var sdTable = $(event.target).closest("table");

        sdTable.find("tr").each(function(index, item) {
            data.push({label: item.dataset.role, data: item.dataset.index});
            total += +item.dataset.index;
        });

        var $td = sdTable.parent();
        var title = $($td.parents("div").get(1)).find('tr.row-headers > th').eq($td.index()).text();

        var donutData = _.map(data, function(item){ return {label: item.label, data: Math.round(item.data/total * 100.0)} });
        var index = 0;
        var gistData = [
            {
                data: _.map(donutData, function(item){ index++; return [item.data, index]; }),
                label: title
            }
        ];

        index = 0;
        gistConfig.yaxis.ticks = _.map(donutData, function(item){ index++; return [index, item.label]; });

        this.ui.socialDemoDialog.find(".modal-title").text(title);

        this.ui.socialDemoDialog.modal().on('shown.bs.modal', function (event) {
            self.ui.socialDemoDialog.find(".donut-chart").plot(donutData, donutConfig);

            self.ui.socialDemoDialog.find(".gist-donut").click(function(e) {
                if(self.$(e.target).data("key") === "donut") {
                    self.ui.socialDemoDialog.find(".donut-chart").plot(gistData, gistConfig);
                    self.$(e.target).data("key", "gist").text("Диаграмма");
                } else {
                    self.ui.socialDemoDialog.find(".donut-chart").plot(donutData, donutConfig);
                    self.$(e.target).data("key", "donut").text("Гистограмма");
                }

            });
        });
    }
});