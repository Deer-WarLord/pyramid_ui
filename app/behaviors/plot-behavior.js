var Marionette = require('backbone.marionette');

module.exports = Marionette.Behavior.extend({

    ui: {
        "socialDemoItem": ".social-demo-item"
    },

    events: {
        'click @ui.socialDemoItem': 'showPlot'
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

    drawDonut: function(donutData) {
        if (this.modalChart !== undefined) {
            this.modalChart.destroy();
        }
        this.modalChart = new Chart(this.$(".modal-chart"), {
            type: 'doughnut',
            data: {
                labels: _.map(donutData, function (item) {
                    return item.label;
                }),
                datasets: [{
                    data: _.map(donutData, function (item) {
                        return item.data;
                    }),
                    backgroundColor: _.map(donutData, function (item) {
                        return item.backgroundColor;
                    })
                }]
            },
            options: {
                maintainAspectRatio: false
            }
        });
    },

    drawGist: function(gistData) {
        if (this.modalChart !== undefined) {
            this.modalChart.destroy();
        }
        this.modalChart = new Chart(this.$(".modal-chart"), {
            type: 'horizontalBar',
            data: {
                labels: _.map(gistData, function (item) {
                    return item.label;
                }),
                datasets: [{
                    data: _.map(gistData, function (item) {
                        return item.data;
                    }),
                    backgroundColor: _.map(gistData, function (item) {
                        return item.backgroundColor;
                    })
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: {
                    display: false
                }
            }
        });
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
        title += " " + $td.parent().children().eq(0).text();
        title += " c " + this.view.model.get("posted_date__gte") + " по " + this.view.model.get("posted_date__lte");

        var donutData = _.map(data, function(item){
            return {
                label: item.label,
                data: Math.round(item.data/total * 100.0),
                backgroundColor: self.stringToColour(item.label)
            }
        });

        this.ui.socialDemoDialog.find(".modal-title").text(title);

        this.ui.socialDemoDialog.modal().off('shown.bs.modal').on('shown.bs.modal', function (event) {
            event.preventDefault();
            var gistDonutSwitch = self.ui.socialDemoDialog.find(".gist-donut");

            if(gistDonutSwitch.attr("data-key") === "donut") {
                self.drawDonut(donutData);
            } else {
                self.drawGist(donutData);
            }

            gistDonutSwitch.off("click").on("click", function(e) {
                if(self.$(e.target).attr("data-key") === "donut") {
                    self.drawGist(donutData);
                    self.$(e.target).text("Диаграмма");
                    self.$(e.target).attr("data-key", "gist");
                } else {
                    self.drawDonut(donutData);
                    self.$(e.target).text("Гистограмма");
                    self.$(e.target).attr("data-key", "donut");
                }
            });
        });
    }
});