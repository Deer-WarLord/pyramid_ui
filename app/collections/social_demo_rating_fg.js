var SocialDemo = require('../models/social_demo_fg');
var PageableCollection = require("backbone.paginator");

module.exports = PageableCollection.extend({

    initialize: function(models, options) {
        this.url = (options||{}).url || "defaultURL";
    },

    model: SocialDemo,

    state: {
        pageSize: 10,
    },
    queryParams: {
        currentPage: "page",
        totalRecords: "count",
    },
    parse: function (data, options) {
        var resp = [
            {"count": data.count},
             _.isArray(data.results) ? data.results: [data.results]
        ];

        var newState = this.parseState(resp, _.clone(this.queryParams), _.clone(this.state), options);
        if (newState) {
            this.state = this._checkState(_.extend({}, this.state, newState));
            if (!(options || {}).silent) this.trigger("pageable:state:change", this.state);
        }
        return this.parseRecords(resp, options);
    }

});