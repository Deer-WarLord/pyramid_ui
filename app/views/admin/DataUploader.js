var Marionette = require('backbone.marionette');
var Cookies = require('js-cookie');

module.exports = Marionette.ItemView.extend({

    initialize: function(options){
        this.model = options.model;
        if (this.model.has("history")) {
            this.history = this.model.get("history");
            this.model.unset("history");
        }
        if (this.history) {
            Backbone.history.navigate(this.history);
        }
        this.fileErrorsTemplate = require('../../templates/admin/file_erros.html')
    },

    tagName: 'div',
    className: 'main-content',
    template: require('../../templates/admin/data-uploader.html'),

    ui: {
        "selectProvider": "#provider",
        "title": "#title",
        "file": "#file",
        "submit": "#submit-data",
        "form": "#data-uploader-form",
        "alert": ".alert"
    },

    events: {
        "submit form": "submitData",
    },

    behaviors: {
        jQueryBehavior: {
            '@ui.selectProvider': {
                'multiselect': {
                    maxHeight: 300,
                    buttonClass: 'btn btn-default selectProvider'
                }
            },
        }
    },

    submitData: function (e) {

        e.preventDefault();
        var data = new FormData(e.target);
        //data.append("file", this.$(this.ui.file)[0].files[0]);
        var self = this;

        $(".parsley-required").html("");
        self.ui.alert.removeClass("in").addClass("out");
        $.ajax({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
            },
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/archive-async/",
            data: data,
            processData: false,
            contentType: false,
            success: function( respond, textStatus, jqXHR ){
                if( typeof respond.error === 'undefined' ){
                    self.ui.alert.removeClass("out").addClass("in");
                    e.target.reset();
                } else {
                    console.log('ОШИБКИ ОТВЕТА сервера: ' + respond.error );
                }
            },
            error: function( jqXHR, textStatus, errorThrown ){

                if (_.isArray(jqXHR.responseJSON)) {
                    $(self.ui.file).parent().find("ul").html(self.fileErrorsTemplate({items: jqXHR.responseJSON}));
                } else {
                    for (var key in jqXHR.responseJSON) {
                        $(self.ui[key]).parent().find("li").html(jqXHR.responseJSON[key][0]);
                    }
                }
            }
        });
    },

});