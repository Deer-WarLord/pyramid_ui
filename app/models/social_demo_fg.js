var Backbone = require("backbone");
var DeepModel = require('backbone-nested-model');

var Sex = Backbone.Model.extend({
    defaults: {
    }
});

var Age = Backbone.Model.extend({
    defaults: {
    },
});

var Education = Backbone.Model.extend({
    defaults: {
    }
});

var ChildrenLt16 = Backbone.Model.extend({
    defaults: {
    }
});

var MaritalStatus = Backbone.Model.extend({
    defaults: {
    }
});

var Occupation = Backbone.Model.extend({
    defaults: {
    }
});

var Group = Backbone.Model.extend({
    defaults: {
    }
});

var Income = Backbone.Model.extend({
    defaults: {
    }
});

var Region = Backbone.Model.extend({
    defaults: {
    }
});

var TypeNP = Backbone.Model.extend({
    defaults: {
    }
});

module.exports = DeepModel.extend({

    defaults: {
        title__title: "",
        views: 0,
    },

    schema: {
        sex: Sex,
        age: Age,
        education: Education,
        children_lt_16: ChildrenLt16,
        marital_status: MaritalStatus,
        occupation: Occupation,
        group: Group,
        income: Income,
        region: Region,
        typeNP: TypeNP
    },

});