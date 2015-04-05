(function ($, window, document, undefined) {
    'use strict';

    /**
     * All the API calls for the front-page f Yellr
     */
    // get_assignments.json?client_id=<client_id>&language_code=<language_code>&lat=<lat>&lng=<lng>


    yellr.modules.server = {

        tag: 'server',

        // modules: {},

        // UUID: 0,
        // BASE_URL: 'http://yellr.net/',
        // URLS: {},
        // SETTINGS: {
        //     lat: 47,
        //     lng: 40,
        //     language: {
        //         code: 'en'
        //     }
        // },

        // ----------------------------------------
        init: function () {

            console.log(this.tag);


        },
        // ----------------------------------------

        get_assignments: function (callback) {

            /**
             * returns an array
             * if a callback is provided it will pass the array to that function
             */

            // load the things
            $.getJSON(yellr.URLS.assignments, function (response) {

                if (response.success) {

                    if (callback) {
                        callback(response.assignments);
                    }
                    else {
                        return response.assignments;
                    }
                } else {
                    console.log('lol - error in get_assignments');
                }
            });

        }

    }


}($, window, window.document));
