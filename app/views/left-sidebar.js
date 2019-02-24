var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

module.exports = Marionette.ItemView.extend({

    tagName: 'div',
    className: 'sidebar-scroll',
    template: require('../templates/left-sidebar.html'),

    templateHelpers: function() {
        return {
            permissions: this.options.permissions
        }
    },

    ui: {
        "main_menu": ".main-menu",
        "markets_query": "#markets-query",
        "region_query": "#region-query",
        "publications_query": "#publications-query",
        "publications_social_demo_query_admixer": "#publications-social-demo-query-admixer",
        "themes_social_demo_query_admixer": "#themes-social-demo-query-admixer",
        "publications_social_demo_query_fg": "#publications-social-demo-query-fg",
        "themes_social_demo_query_fg": "#themes-social-demo-query-fg",
        "keyword_chart_fg_sd": "#keyword-chart-fg-sd",
        "keyword_chart_fg": "#keyword-chart-fg",
        "keyword_chart": "#keyword-chart",
        "admin_data_upload": "#admin-data-upload",
        "admin_user_roles": "#admin-user-roles",
        "admin_keys_update": "#admin-keys-update",
        "admin_files": "#admin-files"
    },

    events: {
        'click .js-sub-menu-toggle': "subMenuToggle",
        'click @ui.markets_query': 'marketsQuery',
        'click @ui.region_query': 'regionQuery',
        'click @ui.publications_query': 'publicationsQuery',
        'click @ui.publications_social_demo_query_admixer': 'publicationsSocialDemoQueryAdmixer',
        'click @ui.themes_social_demo_query_admixer': 'themesSocialDemoQueryAdmixer',
        'click @ui.publications_social_demo_query_fg': 'publicationsSocialDemoQueryFg',
        'click @ui.themes_social_demo_query_fg': 'themesSocialDemoQueryFg',
        'click @ui.keyword_chart': 'keywordChart',
        'click @ui.keyword_chart_fg': 'keywordChartFg',
        'click @ui.keyword_chart_fg_sd': 'keywordChartFgSd',
        'click @ui.admin_data_upload': 'showDataUploader',
        'click @ui.admin_user_roles': 'showUserRoles',
        'click @ui.admin_keys_update': 'showKeysUpdate',
        'click @ui.admin_files': 'showAdminFiles'

    },

    subMenuToggle: function (e) {
        e.preventDefault();
        $li = this.$(e.target).parents("li").first();
        if (!$li.hasClass('active')) {
            $li.find(' > a .toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
            $li.addClass('active');
            $li.find('ul.sub-menu').first().slideDown(300);
        }
        else {
            $li.find(' > a .toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
            $li.removeClass('active');
            $li.find('ul.sub-menu').first().slideUp(300);
        }
    },

    expandMenu: function(target) {
        target.find(' > a .toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
        target.addClass('active');
        target.find('ul.sub-menu').first().slideDown(300);
    },

    activateMarketsQuery: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.markets_query.parents("li").addClass("active");
    },

    marketsQuery: function () {
        this.model.clear();
        Backbone.history.navigate('market-rating/');
        this.triggerMethod('show:market');
        return false;
    },

    activateRegionQuery: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.region_query.parents("li").addClass("active");
    },

    regionQuery: function () {
        this.model.clear();
        Backbone.history.navigate('region-rating/');
        this.triggerMethod('show:region');
        return false;
    },

    activatePublicationsQuery: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.publications_query.parents("li").addClass("active");
    },

    publicationsQuery: function () {
        this.model.clear();
        this.model.set("history", "publication-rating/");
        this.triggerMethod('show:publications');
    },

    activatePublicationsSocialDemoQueryAdmixer: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.publications_social_demo_query_admixer.parents("li").addClass("active");
    },

    publicationsSocialDemoQueryAdmixer: function () {
        this.activatePublicationsSocialDemoQueryAdmixer();
        this.model.clear();
        this.model.set("history", "general-social-demo-rating-by-publication-admixer");
        this.model.set("lvl", 0);
        this.triggerMethod('general:show:social:demo:admixer', "publication");
    },

    activateThemesSocialDemoQueryAdmixer: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.themes_social_demo_query_admixer.parents("li").addClass("active");
    },

    themesSocialDemoQueryAdmixer: function () {
        this.activateThemesSocialDemoQueryAdmixer();
        this.model.clear();
        this.model.set("lvl", 0);
        this.model.set("history", "general-social-demo-rating-by-theme-admixer");
        this.triggerMethod('general:show:social:demo:admixer', "key_word");
    },

    activatePublicationsSocialDemoQueryFg: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.publications_social_demo_query_fg.parents("li").addClass("active");
    },

    publicationsSocialDemoQueryFg: function () {
        this.activatePublicationsSocialDemoQueryFg();
        this.model.clear();
        this.model.set("lvl", 0);
        this.model.set("history", "general-social-demo-rating-by-publication-fg");
        this.triggerMethod('general:show:social:demo:fg', "publication");
    },

    activateThemesSocialDemoQueryFg: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.themes_social_demo_query_fg.parents("li").addClass("active");
    },

    themesSocialDemoQueryFg: function () {
        this.activateThemesSocialDemoQueryFg();
        this.model.clear();
        this.model.set("lvl", 0);
        this.model.set("history", "general-social-demo-rating-by-theme-fg");
        this.triggerMethod('general:show:social:demo:fg', "key_word");
    },

    activateKeywordChart: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.keyword_chart.parents("li").addClass("active");
    },

    activateKeywordFgChart: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.keyword_chart_fg.parents("li").addClass("active");
    },

    activateKeywordFgSdChart: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.keyword_chart_fg_sd.parents("li").addClass("active");
    },

    keywordChart: function () {
        this.activateKeywordChart();
        this.model.clear();
        this.model.set("history", "chart-keyword/");
        this.triggerMethod('show:chart:keyword');
    },

    keywordChartFg: function () {
        this.activateKeywordFgChart();
        this.model.clear();
        this.model.set("history", "chart-keyword-object-view/");
        this.triggerMethod('show:chart:keyword:fg');
    },

    keywordChartFgSd: function () {
        this.activateKeywordFgSdChart();
        this.model.clear();
        this.model.set("history", "chart-keyword-object-sd/");
        this.triggerMethod('show:chart:keyword:fg:sd');
    },

    activateShowDataUploader: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.admin_data_upload.parents("li").addClass("active");
    },

    showDataUploader: function (e) {
        e.preventDefault();
        this.activateShowDataUploader();
        this.model.clear();
        this.model.set("history", "admin-data-uploader");
        this.triggerMethod('show:admin:data:uploader');
    },

    activateShowUserRoles: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.admin_user_roles.parents("li").addClass("active");
    },

    showUserRoles: function (e) {
        e.preventDefault();
        this.activateShowUserRoles();
        this.model.clear();
        this.model.set("history", "admin-user-roles");
        this.triggerMethod('show:admin:user:roles');
    },

    activateShowKeysUpdate: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.admin_keys_update.parents("li").addClass("active");
    },

    showKeysUpdate: function (e) {
        e.preventDefault();
        this.activateShowKeysUpdate();
        this.model.clear();
        this.model.set("history", "admin-keys-update");
        this.triggerMethod('show:admin:keys:update');
    },

    activateShowAdminFiles: function () {
        this.ui.main_menu.find("li.active").removeClass("active");
        this.ui.admin_files.parents("li").addClass("active");
    },

    showAdminFiles: function (e) {
        e.preventDefault();
        this.activateShowAdminFiles();
        this.model.clear();
        this.model.set("history", "admin-files");
        this.triggerMethod('show:admin:files');
    },

});