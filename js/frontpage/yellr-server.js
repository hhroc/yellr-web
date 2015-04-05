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

        get_assignments: function () {
            console.log('get_assignments');
            // get_assignments.json?client_id=<client_id>&language_code=<language_code>&lat=<lat>&lng=<lng>


            // load the things
            $.getJSON(yellr.URLS.assignments, function (response) {
                console.log(response);
                if (response.success) {

                    // // parse UTC time
                    // response[dataType] = response[dataType].filter(function (val, i, arr) {
                    //   if (val.expire_datetime) val.expire_datetime = moment(val.expire_datetime).fromNow(true);
                    //   return true;
                    // });


                    // // set the new data to the DATA object
                    // yellr.DATA[dataType] = response[dataType];
                    // yellr.utils.save();

                } else {
                    console.log('lol');
                    // yellr.utils.notify('Something went wrong loading '+dataType + ' from the server.');
                }
            }).done(function () {
                console.log('done');
              // if (callback) callback();
            });






        }

    }


}($, window, window.document));
