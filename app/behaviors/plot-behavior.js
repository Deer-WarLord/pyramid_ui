var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    ui: {
        "socialDemoItem": ".social-demo-item"
    },

    events: {
        'click @ui.socialDemoItem': 'showPlot'
    },

    _donutLabelFormatter: function (label, series) {
        return "<div class=\"donut-label\">" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    },

    showPlot: function(e) {
        e.preventDefault();
        var self = this;
        var total = 0;
        var data = [];

        $(event.target).closest("table").find("tr").each(function(index, item) {
            data.push({label: item.dataset.role, data: item.dataset.index});
            total += +item.dataset.index;
        });

        data = _.map(data, function(item){ return {label: item.label, data: Math.round(item.data/total * 100.0)} });

        this.ui.socialDemoDialog.modal().on('shown.bs.modal', function (event) {

            self.ui.socialDemoDialog.find(".donut-chart").plot(data, {
                series: {
                    pie: {
                        show: true,
                        innerRadius: 30,
                        label: {
                            show: true,
                            formatter: this._donutLabelFormatter
                        }
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                    hoverable: true
                }
            });
        });

    }
});