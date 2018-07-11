var Marionette = require('backbone.marionette');
var Layout = require('../views/layout');
var jqueryParam = require('jquery-param');

var DatePickerBehavior = require('../behaviors/datepicker-behavior');
var jQueryBehavior = require('../behaviors/jquery-behavior');
var TableBehavior = require('../behaviors/table-behavior');
var ToggleBehavior = require('../behaviors/toggle-behavior');
var PlotBehavior = require('../behaviors/plot-behavior');

Marionette.Behaviors.behaviorsLookup = function() {
    return {
        "DatePickerBehavior": DatePickerBehavior,
        "PlotBehavior": PlotBehavior,
        "jQueryBehavior": jQueryBehavior,
        "ToggleBehavior": ToggleBehavior,
        "TableBehavior": TableBehavior
    };
};

module.exports = Marionette.Controller.extend({

    initialize: function(options) {
        var layout = new Layout(options);
        layout.render();
        if (Backbone.history.location.hash.length <= 1) {
            layout.triggerMethod('show:market');
        }
        this.options.layout = layout;
        this.permissions = options.initialData.permissions;
    },

    marketRatingAll: function() {
        if (this.permissions.theme) {
            this.getOption('layout').triggerMethod('show:market');
        }
    },

    marketRatingFilter: function(fromDate, toDate) {
        if (this.permissions.theme) {
            this.getOption('layout').triggerMethod('show:market:dates', [fromDate, toDate]);
        }
    },

    themeCompanyRatingAll: function() {
        if (this.permissions.theme) {
            this.getOption('layout').triggerMethod('show:theme');
        }
    },
    
    themeCompanyRatingFilter: function(market, fromDate, toDate) {
        if (this.permissions.theme) {
            this.getOption('layout').triggerMethod('show:theme:dates', [fromDate, toDate, market]);
        }
    },
    
    publicationRatingAll: function() {
        if (this.permissions.publication) {
            this.getOption('layout').model.clear();
            this.getOption('layout').triggerMethod('show:publications');
        }
    },

    publicationRatingFilter: function(fromDate, toDate, key_word) {
        if (this.permissions.publication) {
            this.getOption('layout').model.set({
                "posted_date__gte": fromDate,
                "posted_date__lte": toDate
            });

            if (key_word) {
                this.getOption('layout').model.set("key_word", key_word);
            }

            this.getOption('layout').triggerMethod('show:publications');
        }
    },

    specificSocialDemoRatingAdmixer: function(fromDate, toDate, key_word, publication) {
        if (this.permissions.social_demo) {
            this.getOption('layout').model.set({
                "posted_date__gte": fromDate,
                "posted_date__lte": toDate,
                "key_word": key_word
            });

            if (publication) {
                this.getOption('layout').model.set("publication", publication);
            }

            this.getOption('layout').triggerMethod('specific:show:social:demo:admixer');
        }
    },

    specificSocialDemoRatingFg: function(fromDate, toDate, key_word, publication){
        if (this.permissions.social_demo) {
            this.getOption('layout').model.set({
                "posted_date__gte": fromDate,
                "posted_date__lte": toDate,
                "key_word": key_word
            });

            if (publication) {
                this.getOption('layout').model.set("publication", publication);
            }

            this.getOption('layout').triggerMethod('specific:show:social:demo:fg');
        }
    },

    specificSocialDemoRatingByPublicationAdmixer: function(fromDate, toDate, publication){
        if (this.permissions.social_demo) {
            this.getOption('layout').model.set({
                "posted_date__gte": fromDate,
                "posted_date__lte": toDate,
                "publication": publication
            });
            this.getOption('layout').triggerMethod('general:show:social:demo:admixer', "publication");
        }
    },

    specificSocialDemoRatingByPublicationFG: function (fromDate, toDate, publication) {
        if (this.permissions.social_demo) {
            this.getOption('layout').model.set({
                "posted_date__gte": fromDate,
                "posted_date__lte": toDate,
                "publication": publication
            });

            this.getOption('layout').triggerMethod('general:show:social:demo:fg', "publication");
        }
    },

    generalSocialDemoRatingThemeAggregatorAdmixer: function (fromDate, toDate) {
        if (this.permissions.social_demo) {
            if (fromDate && toDate) {
                this.getOption('layout').model.set({
                    "posted_date__gte": fromDate,
                    "posted_date__lte": toDate
                });
            }
            this.getOption('layout')._generalShowSocialDemoAdmixer("key_word");
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#social-demo-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admixer-sub-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.activateThemesSocialDemoQueryAdmixer();
        }
    },

    generalSocialDemoRatingPublicationAggregatorAdmixer: function (fromDate, toDate) {
        if (this.permissions.social_demo) {
            if (fromDate && toDate) {
                this.getOption('layout').model.set({
                    "posted_date__gte": fromDate,
                    "posted_date__lte": toDate
                });
            }
            this.getOption('layout')._generalShowSocialDemoAdmixer("publication");
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#social-demo-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admixer-sub-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.activatePublicationsSocialDemoQueryAdmixer();
        }
    },

    generalSocialDemoRatingThemeAggregatorFG: function (fromDate, toDate) {
        if (this.permissions.social_demo) {
            if (fromDate && toDate) {
                this.getOption('layout').model.set({
                    "posted_date__gte": fromDate,
                    "posted_date__lte": toDate
                });
            }
            this.getOption('layout')._generalShowSocialDemoFg("key_word");
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#social-demo-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#fg-sub-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.activateThemesSocialDemoQueryFg();
        }
    },

    generalSocialDemoRatingPublicationAggregatorFG: function (fromDate, toDate) {
        if (this.permissions.social_demo) {
            if (fromDate && toDate) {
                this.getOption('layout').model.set({
                    "posted_date__gte": fromDate,
                    "posted_date__lte": toDate
                });
            }
            this.getOption('layout')._generalShowSocialDemoFg("publication");
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#social-demo-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#fg-sub-sub-menu'));
            this.getOption('layout').left_sidebar.currentView.activatePublicationsSocialDemoQueryFg();
        }
    },

    admin_data_uploader: function () {
        if (this.permissions.admin) {
            this.getOption('layout').onShowAdminDataUploader();
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admin-menu'));
            this.getOption('layout').left_sidebar.currentView.activateShowDataUploader();
        }
    },

    admin_user_roles: function () {
        if (this.permissions.admin) {
            this.getOption('layout').onShowAdminUserRoles();
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admin-menu'));
            this.getOption('layout').left_sidebar.currentView.activateShowUserRoles();
        }
    },

    admin_keys_update: function () {
        if (this.permissions.admin) {
            this.getOption('layout').onShowAdminKeysUpdate();
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admin-menu'));
            this.getOption('layout').left_sidebar.currentView.activateShowKeysUpdate();
        }
    },

    admin_files: function () {
        if (this.permissions.admin) {
            this.getOption('layout').onShowAdminFiles();
            this.getOption('layout').left_sidebar.currentView.expandMenu($('#admin-menu'));
            this.getOption('layout').left_sidebar.currentView.activateShowAdminFiles();
        }
    }

});