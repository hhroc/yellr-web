/*!
 * yellr-web v0.0.1 (http://yellr.net)
 * Copyright 2014-2015 hhroc
 * Licensed under MIT (https://github.com/hhroc/yellr-web/blob/master/LICENSE)
 */

(function ($, window, document, undefined) {
    'use strict';

    window.yellr = {

        tag: 'Y E L L R',

        forms: {},
        modules: {},

        UUID: 0,
        BASE_URL: 'https://yellr.net/',
        URLS: {},
        SETTINGS: {
            lat: 47,
            lng: 40,
            language: {
                code: 'en'
            }
        },

        // ----------------------------------------
        init: function () {

            // initialize all modules
            for (var module in this.modules) {
                this.modules[module].init();
            }




            // setup the homepage
            if ($('#index').length) {

                // setup the header form
                yellr.forms.form_1.init();


                // make call to the server
                // ----------------------------------------
                // 1 - get assignments
                yellr.modules.server.get_assignments(function (assignments) {

                    // render JSON into HTML with Handlerbars.js
                    yellr.utils.render_template({
                        template: '#assignment-li-template',
                        target: '#latest-assignments',
                        context: {
                            assignments: assignments
                        }
                    });
                    $('#latest-assignments').css('opacity', 1);
                    $('#latest-assignments + i').css('display', 'none');
                    $(document).foundation('reveal', 'reflow');
                });


                // 2 - get stories
                yellr.modules.server.get_stories(function (stories) {

                    // render JSON into HTML with Handlerbars.js
                    yellr.utils.render_template({
                        template: '#stories-li-template',
                        target: '#latest-stories',
                        context: {
                            stories: stories
                        }
                    });
                    $('#latest-stories').css('opacity', 1);
                    $('#latest-stories + i').css('display', 'none');
                    $(document).foundation('reveal', 'reflow');
                });


                // 3 - get local posts
                yellr.modules.server.get_local_posts(function (local_posts) {

                    // render JSON into HTML with Handlerbars.js
                    yellr.utils.render_template({
                        template: '#latest-posts-li-template',
                        target: '#latest-posts',
                        context: {
                            local_posts: local_posts
                        }
                    });
                    $('#latest-posts').css('opacity', 1);
                    $('#latest-posts + i').css('display', 'none');
                    $(document).foundation('reveal', 'reflow');
                });
            }

        },

        // ----------------------------------------

        utils: {

            feedback: function (feedback_string) {
                alert(feedback_string);
            },

            render_template: function(settings) {
                /**
                * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
                *
                * settings = {
                *   template: '#script-id',
                *   target: '#query-string',
                *   context: {}
                * }
                */


                // get Handlebar template
                if (!settings.template || settings.template ==='') {
                    // if template is empty, clear HTML of target
                    $(settings.target).html('');
                    return;
                }

                var template = Handlebars.compile($(settings.template).html());

                // render it (check it we have a context)
                var html = template( settings.context ? settings.context : {} );

                // replace html, or return HTML frag
                if (settings.append) $(settings.target).append(html);
                else if (settings.prepend) $(settings.target).prepend(html);
                else $(settings.target).html(html);

            }


        }
    }

    $(document).ready(function () {
        $(document).foundation();
        yellr.init();
    });

}($, window, window.document));

(function ($, window, document, undefined) {
    'use strict';


    yellr.modules.user = {

        tag: 'user',

        // ----------------------------------------
        init: function () {

            // generate the UUID
            yellr.UUID = this.guid();


            // generate the URLS
            yellr.URLS.get_assignments =     yellr.BASE_URL+
                                            'get_assignments.json?cuid=' + yellr.UUID +
                                            '&language_code=' + yellr.SETTINGS.language.code +
                                            '&lat=' + yellr.SETTINGS.lat +
                                            '&lng=' + yellr.SETTINGS.lng;
            yellr.URLS.get_stories =         yellr.BASE_URL +
                                            'get_stories.json?cuid=' + yellr.UUID +
                                            '&lat=' + yellr.SETTINGS.lat +
                                            '&lng=' + yellr.SETTINGS.lng +
                                            '&language_code=' + yellr.SETTINGS.language.code;
            yellr.URLS.upload_media =        yellr.BASE_URL +
                                            'upload_media.json?cuid=' + yellr.UUID +
                                            '&language_code=' + yellr.SETTINGS.language.code +
                                            '&lat=' + yellr.SETTINGS.lat +
                                            '&lng=' + yellr.SETTINGS.lng;
            yellr.URLS.publish_post =        yellr.BASE_URL +
                                            'publish_post.json?cuid=' + yellr.UUID +
                                            '&language_code=' + yellr.SETTINGS.language.code +
                                            '&lat=' + yellr.SETTINGS.lat +
                                            '&lng=' + yellr.SETTINGS.lng;
            yellr.URLS.get_local_posts =    yellr.BASE_URL +
                                            'get_local_posts.json?cuid=' + yellr.UUID +
                                            '&lat=' + yellr.SETTINGS.lat +
                                            '&lng=' + yellr.SETTINGS.lng +
                                            '&language_code=' + yellr.SETTINGS.language.code;
            yellr.URLS.server_info =        yellr.BASE_URL +
                                            'server_info.json';

            console.log(this.tag, yellr.UUID);

        },
        // ----------------------------------------


        guid: function (len, radix) {
            /*!
                Math.uuid.js (v1.4)
                http://www.broofa.com
                mailto:robert@broofa.com
                http://www.broofa.com/2008/09/javascript-uuid-function/

                Copyright (c) 2010 Robert Kieffer
                Dual licensed under the MIT and GPL licenses.
            */

            var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var chars = CHARS, uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                      r = 0 | Math.random()*16;
                      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        }

    }


}($, window, window.document));

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

(function ($, window, document, undefined) {
    'use strict';


    yellr.forms.form_1 = {

        tag: 'form 1',

        // ----------------------------------------
        init: function () {


            /**
             * ============================================================
             * ============================================================
             */
            // this wholesection needs to be cleaned up
            // just UI things
            // ----------------------------------------
            var form_is_active = false;
            var $input = $('#init-input'),
                $extras = $('#form-extras');

                $input.on('focus', function () {
                    $extras.css('height', $extras.children().height());
                });

                // $input.on('blur', function () {
                //     $extras.css('height', 0);
                // });

                $input.on('keydown', function () {
                    if (form_is_active === false) {
                        $input.off('blur');
                        form_is_active = true;
                    }
                });

                $input.on('change', function () {
                    if ($input.val() === '') {
                        $extras.css('height', 0);
                        form_is_active = false;
                        $input.on('blur', function () {
                            $extras.css('height', 0);
                        });
                    }
                });
            // ----------------------------------------



            // submitting and adding media to a submission
            var $form_container = $('#form-container');


            $('#report-form-1-submit').click(function () {

                var media_objects = [];
                var $forms = $('#form-container').children();
                var $text_form = $('#homepage-intro-form');
                var total = 1 + $forms.length; // text + media objects, 1 + n


                // 1 - submit text
                $text_form.ajaxSubmit({
                    url: yellr.URLS.upload_media,
                    clearForm: true,
                    dataType: 'json',
                    data: {
                        description: $('#media_caption').val()
                    },
                    success: function (_response) {
                        // console.log(_response);
                        $('#media_caption').val('');
                        if (_response.success) {
                            media_objects.push(_response.media_id);
                            if (media_objects.length === total) {
                                yellr.modules.server.publish_post([_response.media_id], function () {
                                    // console.log('tip submitted');
                                });
                            } else {
                                console.log('Something went wrong with upload_media...');
                                console.log(_response);
                            }
                        }

                    }
                });

                // 2 - submit all the media forms
                $.each($forms, function (i, ele) {
                    var $form = $(ele);
                    console.log($form);

                    $form.ajaxSubmit({
                        url: yellr.URLS.upload_media,
                        clearForm: true,
                        success: function (_response) {
                            if (_response.success) {
                                media_objects.push(_response.media_id);
                                if (media_objects.length === total) {
                                    yellr.modules.server.publish_post([_response.media_id], function () {
                                        // console.log('tip submitted');
                                    });
                                }
                            } else {
                                console.log('Something went wrong with upload_media...');
                                console.log(_response);
                            }
                        }
                    });
                    // end ajaxSubmit
                });
            });

            function add_form(_type) {

                // used to target the new form
                var id_string = Foundation.utils.random_str(6);

                // render  HTML form
                yellr.utils.render_template({
                    template: '#media-form-template',
                    target: '#form-container',
                    append: true,
                    context: {
                        media_type: _type,
                        id_string: id_string
                    }
                });

                // reference to the new form
                var $new_form = $($form_container.children()[$form_container.length - 1]);
                // hook up the cancel btn
                var $cancel_btn = $new_form.find('*[data-cancel]');

                $cancel_btn.on('click', function () {
                    // var form =
                    TweenMax.to($new_form, 0.3, {
                        opacity: 0,
                        ease: Ease.easeIn,
                        // ease: Elastic.easeOut,
                        onComplete: function () {
                            $new_form.remove();
                            $extras.css('height', $extras.children().height());
                        }
                    });
                });


                // cosmetic
                $extras.css('height', $extras.children().height());
            }


            $('#add-photo-btn').click(function () {
                add_form('image');
            });
            $('#add-video-btn').click(function () {
                yellr.utils.feedback('Feature coming soon!');
                // add_form('video');
            });
            $('#add-audio-btn').click(function () {
                yellr.utils.feedback('Feature coming soon!');
                // add_form('audio');
            });

            /**
             * ----------------------------------------
             * ----------------------------------------
             */




        }

    }


}($, window, window.document));
