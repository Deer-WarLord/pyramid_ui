var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    ui: {
        "socialDemoItem": ".social-demo-item",
        "socialDemoDialog": "#admixer-social-demo-plot"
    },

    events: {
        'click @ui.socialDemoItem': 'showPlot'
    },

    _donutLabelFormatter: function (label, series) {
        return "<div class=\"donut-label\">" + label + "<br/>" + Math.round(series.percent) + "%</div>";
    },

    showPlot: function(e) {
        e.preventDefault();

        var data = [];
        var total = 0;

        $(event.target).closest("table").find("tr").each(function(index, item) {
            data.push({label: item.dataset.role, data: item.dataset.index});
            total += +item.dataset.index;
        });

        var p_data = _.map(data, function(item){ return {label: item.label, data: Math.round(item.data/total * 100.0)} });

        this.ui.socialDemoDialog.modal();

        var data = [
            { label: "Stock",  data: 55},
            { label: "Mutual Fund",  data: 8},
            { label: "Fixed Assets", data: 18},
            { label: "Forex", data: 12},
            { label: "Others", data: 7}
        ];

        $.plot('#demo-donut-chart', data, {
            series: {
                pie: {
                    show: true,
                    //innerRadius: 0,
                    stroke: {
                        width: 0,
                        color: "#F9F9F9"
                    },
                    label: {
                        show: true,
                        radius: 3/4,
                        formatter: this._donutLabelFormatter
                    }
                },
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true
            },
            colors: ["#f98114", "#88f914", "#f91465", "#1461f9", "#f9d614"],
        });
    },
});