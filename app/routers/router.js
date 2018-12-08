var Marionette = require('backbone.marionette');
var Controller = require('../controllers/controller');

module.exports = Marionette.AppRouter.extend({

    initialize: function(options) {
        this.controller = new Controller(options);
    },
    appRoutes: {
        'market-rating/': 'marketRatingAll',
        'market-rating/:fromDate/:toDate': 'marketRatingFilter',

        'theme-company-rating/': 'themeCompanyRatingAll',
        'theme-company-rating/:market/:fromDate/:toDate': 'themeCompanyRatingFilter',

        'region-rating/': 'regionRatingAll',
        'region-rating/:fromDate/:toDate': 'regionRatingFilter',

        'publication-type-rating/': 'publicationTypeRatingAll',
        'publication-type-rating/:region__in/:fromDate/:toDate': 'publicationTypeRatingFilter',

        'publication-topic-rating/': 'publicationTopicRatingAll',
        'publication-topic-rating/:region__in/:type__in/:fromDate/:toDate': 'publicationTopicRatingFilter',

        'publication-rating/': 'publicationRatingAll',
        'publication-rating/:region/:type/:topic/:fromDate/:toDate': 'publicationRatingFilterTopic',
        'publication-rating/:fromDate/:toDate(/:key_word)': 'publicationRatingFilter',


        'specific-social-demo-rating-admixer/:fromDate/:toDate/:key_word(/:publication)': "specificSocialDemoRatingAdmixer",
        'specific-social-demo-rating-fg/:fromDate/:toDate/:key_word(/:publication)': "specificSocialDemoRatingFg",

        'general-social-demo-rating-admixer/:fromDate/:toDate/:publication': "specificSocialDemoRatingByPublicationAdmixer",
        'general-social-demo-rating-fg/:fromDate/:toDate/:publication': "specificSocialDemoRatingByPublicationFG",

        'general-social-demo-rating-by-theme-admixer(/:fromDate/:toDate)': 'generalSocialDemoRatingThemeAggregatorAdmixer',
        'general-social-demo-rating-by-publication-admixer(/:fromDate/:toDate)': 'generalSocialDemoRatingPublicationAggregatorAdmixer',

        'general-social-demo-rating-by-theme-fg(/:fromDate/:toDate)': 'generalSocialDemoRatingThemeAggregatorFG',
        'general-social-demo-rating-by-publication-fg(/:fromDate/:toDate)': 'generalSocialDemoRatingPublicationAggregatorFG',

        'chart-keyword/': "chartKeyword",
        'chart-keyword-fg/': "chartKeywordFg",
        'chart-keyword-fg-sd/': "chartKeywordFgSd",

        'admin-data-uploader': 'admin_data_uploader',
        'admin-user-roles': 'admin_user_roles',
        'admin-keys-update': 'admin_keys_update',
        'admin-files': 'admin_files'
    }
});