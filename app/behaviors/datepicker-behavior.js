// datepicker_behavior
var Marionette = require('backbone.marionette');
var moment = require("../assets/js/plugins/moment/moment");

function initDateRange(reportRangeID, input, options, model) {

    reportRangeID.find('span').html(options.fixed_dates[0] + ' - ' + options.fixed_dates[1]);

    if (!options.permissions.free_time) {
        input.val(options.fixed_dates[0] + ',' + options.fixed_dates[1]);
        return;
    }

    var startDate = '10/01/2018';
    var endDate = '12/01/2018';

    if (model && model.has("posted_date__gte")) {

        var fromDate = model.get("posted_date__gte");
        var toDate = model.get("posted_date__lte");

        reportRangeID.find('span').html(fromDate + ' - ' + toDate);

        startDate = new Date(model.get("posted_date__gte")).toLocaleDateString("en-US");
        endDate = new Date(model.get("posted_date__lte")).toLocaleDateString("en-US");
    }

    var callback = function (start, end) {
        var fromDate = start.format('YYYY-MM-DD');
        var toDate = end.format('YYYY-MM-DD');

        reportRangeID.find('span').html(fromDate + ' - ' + toDate);
        input.val(fromDate + ',' + toDate).trigger("change", {
            fromDate: fromDate,
            toDate: toDate
        });
    };
    reportRangeID.daterangepicker({
        startDate: startDate,
        endDate: endDate,
        minDate: '01/01/2017',
        maxDate: '12/31/2019',
        dateLimit: {days: 360},
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 Days': [moment().subtract('days', 6), moment()],
            'Last 30 Days': [moment().subtract('days', 29), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
        },
        opens: 'left',
        buttonClasses: ['submit-daterange btn btn-default'],
        applyClass: 'btn-small btn-primary',
        cancelClass: 'btn-small',
        format: 'MM/DD/YYYY',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    }, callback);
}

module.exports = Marionette.Behavior.extend({

    onDomRefresh: function () {
        var reportRangeID = this.view.ui.reportRange;
        var input = this.view.ui.input;
        var options = this.view.options;
        var model = this.view.model;
        initDateRange(reportRangeID, input, options, model);
    },

    onUpdateDateControls: function (reportRangeID, input, options, model) {
        initDateRange(reportRangeID, input, options, model);
    }

});
