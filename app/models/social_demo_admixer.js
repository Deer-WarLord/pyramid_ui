var Backbone = require("backbone");
var DeepModel = require('backbone-nested-model');

var IncomeGroups = Backbone.Model.extend({
    defaults: {
    }
});

var AgeGroups = Backbone.Model.extend({
    defaults: {
    },
});

var GenderGroups = Backbone.Model.extend({
    defaults: {
    }
});

var Regions = Backbone.Model.extend({
    defaults: {
    }
});

var Platforms = Backbone.Model.extend({
    defaults: {
    }
});

var Browsers = Backbone.Model.extend({
    defaults: {
    }
});


module.exports = DeepModel.extend({

    defaults: {
        aggregator: "",
        uniques: 0,
        views: 0,
    },
    schema: {
        income_groups: IncomeGroups,
        age_groups: AgeGroups,
        gender_groups: GenderGroups,
        regions: Regions,
        platforms: Platforms,
        browsers: Browsers
    },

});