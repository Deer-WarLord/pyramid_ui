// datepicker_behavior
var Marionette = require('backbone.marionette');
var moment = require("../assets/js/plugins/moment/moment");

function initDateRange(reportRangeID, input, options) {


    if (!options.permissions.free_time) {
        reportRangeID.find('span').html(options.fixed_dates[0] + ' - ' + options.fixed_dates[1]);
        input.val(options.fixed_dates[0] + ',' + options.fixed_dates[1]);
        return;
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
        startDate: '01/10/2018',
        endDate: '01/12/2018',
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
        initDateRange(reportRangeID, input, options);
    },

    onUpdateDateControls: function (reportRangeID, input, options) {
        initDateRange(reportRangeID, input, options);
    }

});
