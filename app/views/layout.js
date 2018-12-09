var Marionette = require('backbone.marionette');

var TopBar = require("./top-bar");
var LeftSidebar = require("./left-sidebar");
var MarketRating = require('./market_rating/table');
var ThemeCompanyRating = require('./theme_company_rating/table');
var RegionRating = require('./region_rating/table');
var PublicationTypeRating = require('./publication_type_rating/table');
var PublicationTopicRating = require('./publication_topic_rating/table');
var PublicationRating = require('./publication_rating/table');
var SocialDemoRatingAdmixer = require('./social_demo_rating/table_admixer');
var SocialDemoRatingFG = require('./social_demo_rating/table_fg');
var KeywordChart = require('./charts/keyword-chart');
var KeywordChartFg = require('./charts/keyword-chart-fg');
var KeywordChartFgSd = require('./charts/keyword-chart-fg-sd');

var AdminDataUploader = require('./admin/DataUploader');
var AdminUserRoles = require('./admin/UserRoles');
var AdminKeysUpdate = require('./admin/KeysUpdate');
var AdminFileManager = require('./admin/FileManager');

var Query = require('../models/query');


module.exports = Marionette.LayoutView.extend({

    initialize: function(options) {
        this.initialData = options.initialData;
        this.model = new Query();
    },

    el: '#wrapper',

    template: require('../templates/layout.html'),

    regions: {
        top_bar: '#top-bar',
        left_sidebar: "#left-sidebar",
        market_rating_table: '#market-rating',
        theme_company_rating_table: '#theme-company-rating',
        region_rating_table: '#region-rating',
        publication_type_rating_table: '#publication-type-rating',
        publication_topic_rating_table: '#publication-topic-rating',
        publication_rating_table: '#publication-rating',
        specific_social_demo_rating_table: '#specific-social-demo-rating',
        general_social_demo_rating_table: '#general-social-demo-rating-table',
        themes_social_demo_rating_table: '#themes-social-demo-rating',
        publications_social_demo_rating_table: '#publications-social-demo-rating',
        keyword_chart: "#keyword-charts-region",
        admin_data_uploader: '#admin-data-uploader-region',
        admin_user_roles: '#admin-user-roles-region',
        admin_keys_update: '#admin-keys-update-region',
        admin_files: '#admin-files-region'
    },

    childEvents: {
        'show:market': 'onShowMarket',
        'show:market:dates': 'onShowMarketDates',
        'show:theme': 'onShowTheme',
        'show:region': 'onShowRegion',
        'show:region:dates': 'onShowRegionDates',
        'show:publication:type': 'onShowPublicationType',
        'show:publication:type:dates': 'onShowPublicationTypeDates',
        'show:publication:topic': 'onShowPublicationTopic',
        'show:publication:topic:dates': 'onShowPublicationTopicDates',
        'show:theme:dates': 'onShowThemeDates',
        'show:publications': 'onShowPublications',
        'query:change': 'onQueryChange',
        'specific:show:social:demo:admixer': 'onSpecificShowSocialDemoAdmixer',
        'specific:show:social:demo:fg': 'onSpecificShowSocialDemoFg',

        'general:show:social:demo:admixer': 'onGeneralShowSocialDemoAdmixer',
        'general:show:social:demo:fg': 'onGeneralShowSocialDemoFg',

        'show:chart:keyword': 'onShowChartKeyword',
        'show:chart:keyword:fg': 'onShowChartKeywordFg',
        'show:chart:keyword:fg:sd': 'onShowChartKeywordFgSd',

        'show:admin:data:uploader': 'onShowAdminDataUploader',
        'show:admin:user:roles': 'onShowAdminUserRoles',
        'show:admin:keys:update': 'onShowAdminKeysUpdate',
        'show:admin:files': 'onShowAdminFiles'
    },

    behaviors: {
        BreadCrumbBehavior: {}
    },

    onQueryChange: function (data) {
      this.model.set(data);
    },

    showBars: function() {
        this.$(".content").hide();
        if (this.left_sidebar.$el.length === 0) {
            this.showChildView('top_bar', new TopBar({model: this.initialData}));
            this.showChildView('left_sidebar', new LeftSidebar({
                model: this.model,
                permissions: this.initialData.permissions
            }));
        }
    },

    onShowMarket: function() {
        this.showBars();
        if (this.initialData.permissions.theme) {
            this.left_sidebar.currentView.activateMarketsQuery();
            this.showChildView('market_rating_table', new MarketRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        } else if (this.initialData.permissions.publication) {
            this.left_sidebar.currentView.activatePublicationsQuery();
            this.showChildView('publication_rating_table', new PublicationRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        } else {
            console.warn("Something wrong with user permissions");
        }
    },

    onShowMarketDates: function(dates) {
        if (this.initialData.permissions.theme && this.initialData.permissions.free_time) {
            this.model.set({
                "posted_date__gte": dates[0],
                "posted_date__lte": dates[1]
            });
            this.showBars();
            this.left_sidebar.currentView.activateMarketsQuery();
            this.showChildView('market_rating_table', new MarketRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }), dates);
        }
    },

    onShowTheme: function() {
        this.showBars();
        if (this.initialData.permissions.theme) {
            this.left_sidebar.currentView.activateMarketsQuery();
            this.showChildView('theme_company_rating_table', new ThemeCompanyRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        } else if (this.initialData.permissions.publication) {
            this.left_sidebar.currentView.activatePublicationsQuery();
            this.showChildView('publication_rating_table', new PublicationRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        } else {
            console.warn("Something wrong with user permissions");
        }
    },

    onShowThemeDates: function(data) {
        if (this.initialData.permissions.theme && this.initialData.permissions.free_time) {
            this.model.set({
                "posted_date__gte": data[0],
                "posted_date__lte": data[1],
                "market__in": data[2]
            });
            this.showBars();
            this.left_sidebar.currentView.activateMarketsQuery();
            this.showChildView('theme_company_rating_table', new ThemeCompanyRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }), data);
        }
    },

    onShowRegion: function () {
        if (this.initialData.permissions.publication) {
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('region_rating_table', new RegionRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowRegionDates: function(dates) {
        if (this.initialData.permissions.publication && this.initialData.permissions.free_time) {
            this.model.set({
                "posted_date__gte": dates[0],
                "posted_date__lte": dates[1]
            });
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('region_rating_table', new RegionRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }), dates);
        }
    },

    onShowPublicationType: function () {
        if (this.initialData.permissions.publication) {
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('publication_type_rating_table', new PublicationTypeRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowPublicationTypeDates: function(params) {
        if (this.initialData.permissions.publication && this.initialData.permissions.free_time) {
            this.model.set({
                "posted_date__gte": params[0],
                "posted_date__lte": params[1],
                "region__in": params[2]
            });
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.triggerMethod('initBreadcrumb');
            this.showChildView('publication_type_rating_table', new PublicationTypeRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }), params);
        }
    },

    onShowPublicationTopic: function () {
        if (this.initialData.permissions.publication) {
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('publication_topic_rating_table', new PublicationTopicRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowPublicationTopicDates: function(params) {
        if (this.initialData.permissions.publication && this.initialData.permissions.free_time) {
            this.model.set({
                "posted_date__gte": params[0],
                "posted_date__lte": params[1],
                "region__in": params[2],
                "type__in": params[3]
            });
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('publication_topic_rating_table', new PublicationTopicRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }), params);
        }
    },

    onShowPublications: function () {
        if (this.initialData.permissions.publication) {
            this.showBars();
            this.left_sidebar.currentView.activateRegionQuery();
            this.showChildView('publication_rating_table', new PublicationRating({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onSpecificShowSocialDemoAdmixer: function () {
        if (this.initialData.permissions.social_demo && this.initialData.permissions.publication) {
            this.showBars();
            this.left_sidebar.currentView.activateMarketsQuery();
            this.showChildView('specific_social_demo_rating_table', new SocialDemoRatingAdmixer({
                model: this.model,
                url: "/aggregator/specific-social-demo-rating-admixer/",
                aggregator: "СМИ",
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onSpecificShowSocialDemoFg: function () {

        if (this.model.get("publication")) {
            var url = "/aggregator/special-by-theme-publication-social-demo-rating-fg/";
            var isAggregatorAllow = this.initialData.permissions.publication;
        } else {
            url = "/aggregator/special-by-theme-social-demo-rating-fg/";
            isAggregatorAllow = this.initialData.permissions.theme;
        }

        if (this.initialData.permissions.social_demo && isAggregatorAllow) {
            this.showBars();
            this.left_sidebar.currentView.activateMarketsQuery();

            this.showChildView('specific_social_demo_rating_table', new SocialDemoRatingFG({
                model: this.model,
                url: url,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onGeneralShowSocialDemoAdmixer: function () {

        var aggregator = arguments[arguments.length - 1];

        if (aggregator === "key_word") {
            var isAggregatorAllow = this.initialData.permissions.theme;
        } else {
            isAggregatorAllow = this.initialData.permissions.publication;
        }

        if (this.initialData.permissions.social_demo && isAggregatorAllow) {
            this.showBars();

            if (aggregator === "key_word") {
                var region = "themes_social_demo_rating_table";
                this.$(this.regions.themes_social_demo_rating_table).show();
            } else {
                region = "publications_social_demo_rating_table";
                this.$(this.regions.publications_social_demo_rating_table).show();
            }

            this.model.set("aggregator", aggregator);

            this.showChildView(region, new SocialDemoRatingAdmixer({
                model: this.model,
                url: "/aggregator/general-social-demo-rating-admixer/",
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onGeneralShowSocialDemoFg: function () {

        var aggregator = arguments[arguments.length - 1];

        if (aggregator === "key_word") {
            var url = "/aggregator/general-by-themes-social-demo-rating-fg/";
            var isAggregatorAllow = this.initialData.permissions.theme;
        } else {
            url = "/aggregator/general-by-publications-social-demo-rating-fg/";
            isAggregatorAllow = this.initialData.permissions.publication;
        }

        if (this.initialData.permissions.social_demo && isAggregatorAllow) {
            this.showBars();
            this.$(this.regions.general_social_demo_rating_table).show();
            this.model.set("aggregator", aggregator);
            this.showChildView('general_social_demo_rating_table', new SocialDemoRatingFG({
                model: this.model,
                url: url,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowChartKeyword: function () {
        if (this.initialData.permissions.theme) {
            this.showBars();
            this.$(this.regions.keyword_chart).show();
            this.showChildView('keyword_chart', new KeywordChart({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowChartKeywordFg: function () {
        if (this.initialData.permissions.theme) {
            this.showBars();
            this.$(this.regions.keyword_chart).show();
            this.showChildView('keyword_chart', new KeywordChartFg({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    onShowChartKeywordFgSd: function () {
        if (this.initialData.permissions.theme) {
            this.showBars();
            this.$(this.regions.keyword_chart).show();
            this.showChildView('keyword_chart', new KeywordChartFgSd({
                model: this.model,
                permissions: this.initialData.permissions,
                fixed_dates: this.initialData.dates
            }));
        }
    },

    _generalShowSocialDemoFg: function(aggregator) {
        this.onGeneralShowSocialDemoFg(aggregator);
    },

    _generalShowSocialDemoAdmixer: function(aggregator) {
        this.onGeneralShowSocialDemoAdmixer(aggregator);
    },

    onShowAdminDataUploader: function () {
        if (this.initialData.permissions.admin) {
            this.showBars();
            this.$(this.regions.admin_data_uploader).show();
            this.showChildView('admin_data_uploader', new AdminDataUploader({model: this.model}));
        }
    },
    
    onShowAdminUserRoles: function () {
        if (this.initialData.permissions.admin) {
            this.showBars();
            this.$(this.regions.admin_user_roles).show();
            this.showChildView('admin_user_roles', new AdminUserRoles({model: this.model}));
        }
    },
    
    onShowAdminKeysUpdate: function () {
        if (this.initialData.permissions.admin) {
            this.showBars();
            this.$(this.regions.admin_keys_update).show();
            this.showChildView('admin_keys_update', new AdminKeysUpdate({model: this.model}));
        }
    },
    
    onShowAdminFiles: function () {
        if (this.initialData.permissions.admin) {
            this.showBars();
            this.$(this.regions.admin_files).show();
            this.showChildView('admin_files', new AdminFileManager({model: this.model}));
        }
    }

});
