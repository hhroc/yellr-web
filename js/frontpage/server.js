(function ($, window, document, undefined) {
    'use strict';

    /**
     * All the API calls for the front-page of Yellr
     */


    yellr.modules.server = {

        tag: 'server',

        init: function () {
          console.log(this.tag);
        },

        // ----------------------------------------

        get_assignments: function (_callback) {

            /**
             * if a callback is provided it will pass the array to that function
             */

            // load the things
            $.getJSON(yellr.URLS.get_assignments, function (_response) {

                if (_response.success) {

                    if (_callback) _callback(_response.assignments);
                    else console.log(_response.assignments);

                } else {

                    console.log('lol - error in get_assignments');

                }
            });

        },


        get_stories: function (_callback) {

            // load the things
            $.getJSON(yellr.URLS.get_stories, function (_response) {

                if (_response.success) {

                    if (_callback) _callback(_response.stories);
                    else console.log(_response.stories);

                } else {

                    console.log('lol - error in get_stories');

                }
            });
        },


        get_local_posts: function (_callback) {

            // load the things
            $.getJSON(yellr.URLS.get_local_posts, function (_response) {

                console.log(_response);
                if (_response.success) {

                    if (_callback) _callback(_response.stories);
                    else console.log(_response.stories);

                } else {

                    console.log('lol - error in get_local_posts');

                }
            });
        },



        publish_post: function(_media_objects, _assignment_id, _callback) {

            var assignment_id = _assignment_id || null;
            console.log(assignment_id);

            $.post(yellr.URLS.publish_post, {
                assignment_id: null,
                media_objects: JSON.stringify(_media_objects)
            }, function() {
                // console.log('post published');
                // generate new UUID after every post to help protect anonymity
                yellr.modules.user.init();
            }).done(function () {
                if (_callback) _callback();
            });

        }



    }


}($, window, window.document));
