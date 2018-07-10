// datepicker_behavior
var Marionette = require('backbone.marionette');
var moment = require("../assets/js/plugins/moment/moment");

module.exports = Marionette.Behavior.extend({

    onDomRefresh: function() {
        var reportRangeID = this.view.ui.reportRange;
        var input = this.view.ui.input;

        if (!this.view.options.permissions.free_time) {
            reportRangeID.find('span').html(this.view.options.fixed_dates[0] + ' - ' + this.view.options.fixed_dates[1]);
            input.val(this.view.options.fixed_dates[0] + ',' + this.view.options.fixed_dates[1]);
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
            startDate: '10/01/2017',
            endDate: '10/30/2017',
            minDate: '01/01/1970',
            maxDate: '12/31/2024',
            dateLimit: {days: 60},
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
});
