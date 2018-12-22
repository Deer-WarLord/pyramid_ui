// table_publication
var Marionette = require('backbone.marionette');
var moment = require("../../assets/js/plugins/moment/moment");
var Cookies = require('js-cookie');
var PublicationRatingCollection = require('../../collections/publication_rating');

var Row = Marionette.LayoutView.extend({
    tagName: 'tr',
    template: require('../../templates/publication_rating/row.html')
});

var Table = Marionette.CompositeView.extend({

    initialize: function(options){
        this.collection = new PublicationRatingCollection();
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
        if (!this.options.permissions.free_time || !this.model.get("posted_date__gte")) {
            this.model.set({
                "posted_date__gte": this.options.fixed_dates[0],
                "posted_date__lte": this.options.fixed_dates[1]
            });
        }
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/publication_rating/table.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    childView: Row,
    childViewContainer: '#datatable-publications tbody',

    ui: {
        "reportRange": "#publication-reportrange",
        "input": "#publication-reportrange input",
        "table": "#datatable-publications",
        "rowFilter": "#datatable-publications .row-filter input",
        "publication": ".publication",
        "publicationList": ".publication-list",
        "selectProvider": "#publication-provider-type",
        "modalDialog": "#myModal",
        "querySd": "#query-sd"
    },

    events: {
        'keyup @ui.rowFilter': 'filterColumn',
        'click @ui.publication': 'selectPublication',
        'click @ui.querySd': 'querySd',
        'click @ui.publicationList': 'getPublicationList',
        'change @ui.input': 'filterCollection',
        'hidden.bs.modal @ui.modalDialog': 'onHideModal'
    },

    behaviors: {
        TableBehavior: {
            '@ui.table': {
                "DataTable": {
                    bDestroy: true,
                    "order": [[ 1, "desc" ]],
                    sDom: "RC"+
                    "t",
                    colVis: {
                        buttonText: 'Show / Hide Columns',
                        restore: "Restore",
                        showAll: "Show all"
                    }
                }
            }
        },
        ToggleBehavior: {},
        ExportBehavior: {},
        BreadCrumbBehavior: {},
        jQueryBehavior: {
            '@ui.selectProvider': {
                'multiselect': {
                    maxHeight: 300,
                    buttonClass: 'btn btn-default selectProvider'
                }
            }
        },
        DatePickerBehavior: {}
    },

    onShow: function() {
        var self = this;
        self.$el.parent().show();
        this.ui.table.DataTable().destroy();
        var reportRange = $(Object.getPrototypeOf(this).ui.reportRange);
        this.ui.querySd.hide();
        this.collection.fetch({
            success: function() {
                if (self.history) {
                    Backbone.history.navigate(self.history);
                }
                setTimeout(function() {
                    self.$('.publication, .publication-list').tooltip();
                    self.triggerMethod('fetched');
                    if (self.model.getParams() !== '') {
                        var dates = [self.model.get('posted_date__gte'), self.model.get('posted_date__lte')];
                        reportRange.find('span').html(dates[0] + ' - ' + dates[1]);
                        reportRange.find('input').val(dates[0] + ',' + dates[1]);
                    }
                }, 1000);
            },
            data: this.model.attributes
        });
        this.triggerMethod('addBreadcrumb', {"url": this.history, "title": "Публикации", "lvl": 3});
    },

    filterColumn: function (event) {
        var dtTable = this.ui.table.DataTable();
        dtTable.column(event.currentTarget.parentElement.getAttribute("data-index") + ':visible')
                .search(event.currentTarget.value)
                .draw();

    },

    filterCollection: function(event, data) {

        if (!this.options.permissions.free_time) return;

        var self = this;
        if (data.fromDate && data.toDate) {
            self.$(self.ui.table).dataTable().fnDestroy();
            self.model.clear().set({
                "posted_date__gte": data.fromDate,
                "posted_date__lte": data.toDate
            });
            this.ui.querySd.hide();
            this.collection.fetch({
                success: function() {
                    self.$('.publication, .publication-list').tooltip();
                    self.triggerMethod('fetched');
                },
                data: self.model.attributes
            });
            Backbone.history.navigate('publication-rating/'+data.fromDate+"/"+data.toDate);
        } else {
            console.log("Some value is empty!");
        }
    },

    selectPublication: function(domEvent) {
        this.$(domEvent.toElement).toggleClass("select");
        if (this.$(".select").length > 0) {
            this.ui.querySd.show();
        } else {
            this.ui.querySd.hide();
        }
    },

    querySd: function(domEvent) {
        this.model.set("page", 1);
        var params = "";

        var self = this;
        var publications = [];
        this.$(".select").each(function(i, item) {publications.push(self.$(item).text());});

        this.model.set("publication__in", JSON.stringify(publications));

        if (this.model.isValidForPublications()) {

            params = this.model.get('posted_date__gte')+"/"+
                     this.model.get('posted_date__lte')+"/"+
                     this.model.get("key_word__in")+"/"+
                     this.model.get("publication__in");

            if (this.ui.selectProvider.val() === "admixer") {
                var history = 'specific-social-demo-rating-admixer/' + params;

            } else if (this.ui.selectProvider.val() === "fg") {
                history = 'specific-social-demo-rating-fg/' + params;
            }

        } else if (publications.length > 0) {

            params = this.model.get('posted_date__gte')+"/"+
                     this.model.get('posted_date__lte')+"/"+
                     this.model.get("publication__in");

            if (this.ui.selectProvider.val() === "admixer") {
                history = 'general-social-demo-rating-admixer/' + params;
            } else if (this.ui.selectProvider.val() === "fg") {
                history = 'general-social-demo-rating-fg/' + params;
            }
        }
        Backbone.history.navigate(history);
    },

    getPublicationList: function (e) {
        var publication = this.$(e.target).data("key");
        var self = this;
        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            url: '/noksfishes/publications-title-date/?publication='+publication,
            type: 'GET',
            success: function(data, status, callback) {
                var table = self.$("#publications-list").DataTable({
                    bDestroy: true,
                    sDom: "t",
                    data: data,
                    scrollY: "300px",
                    scrollCollapse: true,
                    paging: false,
                    columns: [
                        { data: 'title' },
                        { data: 'posted_date' },
                        { data: 'count' }
                    ]
                });
                self.$("#myModalLabel").html(publication);
                self.$("#myModal").fadeIn();
            }
        });
    },

    onHideModal: function () {
        this.$("#myModalLabel").html("СМИ");
        var table = this.$("#publications-list").DataTable();
        table.clear();
        table.destroy();
    }

});

module.exports = Table;