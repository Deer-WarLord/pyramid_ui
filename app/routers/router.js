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
        'theme-company-rating/:fromDate/:toDate': 'themeCompanyRatingFilter',

        'publication-rating/': 'publicationRatingAll',
        'publication-rating/:fromDate/:toDate(/:key_word)': 'publicationRatingFilter',
        'specific-social-demo-rating-admixer/:fromDate/:toDate/:key_word(/:publication)': "specificSocialDemoRatingAdmixer",
        'specific-social-demo-rating-fg/:fromDate/:toDate/:key_word(/:publication)': "specificSocialDemoRatingFg",

        'general-social-demo-rating-admixer/:fromDate/:toDate/:publication': "specificSocialDemoRatingByPublicationAdmixer",
        'general-social-demo-rating-fg/:fromDate/:toDate/:publication': "specificSocialDemoRatingByPublicationFG",

        'general-social-demo-rating-by-theme-admixer(/:fromDate/:toDate)': 'generalSocialDemoRatingThemeAggregatorAdmixer',
        'general-social-demo-rating-by-publication-admixer(/:fromDate/:toDate)': 'generalSocialDemoRatingPublicationAggregatorAdmixer',

        'general-social-demo-rating-by-theme-fg(/:fromDate/:toDate)': 'generalSocialDemoRatingThemeAggregatorFG',
        'general-social-demo-rating-by-publication-fg(/:fromDate/:toDate)': 'generalSocialDemoRatingPublicationAggregatorFG',

        'admin-data-uploader': 'admin_data_uploader',
        'admin-user-roles': 'admin_user_roles',
        'admin-keys-update': 'admin_keys_update',
        'admin-files': 'admin_files'
    }
});