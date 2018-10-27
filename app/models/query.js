var Backbone = require("backbone");
var jqueryParam = require('jquery-param');

module.exports = Backbone.Model.extend({

    defaults: {},

    getParams: function(){
        return jqueryParam(this.toJSON());
    },

    getUrlArgs: function(){

        var args = "";

        if (this.get("posted_date__gte") && this.get("posted_date__lte")) {
            args = this.get("posted_date__gte") + "/" + this.get("posted_date__lte");

            if (this.get("key_word")) {
                args += "/" + this.get("key_word");
            }

            if (this.get("publication")) {
                args += "/" + this.get("publication");
            }

        }

        return args;
    },

    isValidForPublications: function () {
        return (this.get("posted_date__gte") && this.get("posted_date__lte") && this.get("key_word__in"))
    }

});