(function ($, window, document, undefined) {
    'use strict';

    window.yellr = {

        tag: 'Y E L L R',

        modules: {},

        UUID: 0,
        BASE_URL: 'http://yellr.net/',
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

            // generate the UUID
            this.UUID = this.utils.guid();


            // generate the URLS
            this.URLS.assignments =     this.BASE_URL+'get_assignments.json?cuid='+this.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
            this.URLS.stories =         this.BASE_URL+'get_stories.json?cuid='+this.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code,
            this.URLS.notifications =   this.BASE_URL+'get_notifications.json?client_id='+this.UUID,
            this.URLS.messages =        this.BASE_URL+'get_messages.json?client_id='+this.UUID,
            this.URLS.profile =         this.BASE_URL+'todo',
            this.URLS.upload =          this.BASE_URL+'upload_media.json?cuid='+this.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
            this.URLS.post =            this.BASE_URL+'publish_post.json?cuid='+this.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
            this.URLS.server_info =     this.BASE_URL+'server_info.json',
            this.URLS.send_message =    this.BASE_URL+'create_response_message.json',
            this.URLS.get_local_posts = this.BASE_URL+'get_local_posts.json?cuid='+this.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code


            $('#submit-tip').click(function () {
                yellr.modules.submit.submit_tip();
            });

            $('#textarea').keydown(function (event) {
                $("#display").text((event.metaKey || event.ctrlKey) && event.keyCode == 13);
            });

            this.pages.init();
            this.pages.showPage('local');

            // get latest assignments for homepage
            if ($('#index').length) {

                // make call to the server

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
                });
            }

        },
        // ----------------------------------------

        pages: {
            _pages: [
                'local',
                'assignments',
                'stories',
                'post',
                'about',
            ],
            init: function() {
                for(var i=0; i<this._pages.length; i++) {
                    $('#nav-page-' + window.yellr.pages._pages[i]).on('click', function() {
                        var pageName = $(this).attr('id').split('-')[2];
                        console.log('onClick(): ' + pageName);
                        window.yellr.pages.showPage(pageName);
                    });
                }
            },
            showPage: function(pageName) {
                console.log('showPage(): ' + pageName);
                if ( window.yellr.pages._pages.indexOf(pageName) > -1 ) {
                    console.log('showPage() - inside.');
                    $('.page').hide();
                    $('#page-' + pageName).show();
                    for(var i=0; i<this._pages.length; i++) {
                        $('#nav-page-' + this._pages[i]).addClass('page-button-deselected');
                    }
                    $('#nav-page-' + pageName).removeClass('page-button-deselected');
                    $('#nav-page-' + pageName).addClass('page-button-selected');
                }
            }
        },


        // ----------------------------------------
        utils: {

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

    yellr.modules.submit = {

        tag: 'submit.js',

        init: function () {
            console.log(this.tag);

            // get all the forms
            this.$forms = $('.submit-form');

            // submit text
            // submit photo
            // submit video
            // submit audio


            // this.$forms.each(function (i, ele) {
            //     // on submit --> cal ajaxSubmit
            //     $(ele).submit(function (event) {
            //         event.preventDefault();
            //         $(this).ajaxSubmit({

            //             url: yellr.URLS.upload,
            //             data: {
            //                 client_id: yellr.UUID,
            //                 media_type: 'image'
            //             },
            //             success: function (response) {
            //                 console.log(response);
            //                 if (response.success) {
            //                     console.log('photo uploaded');
            //                 } else {
            //                     console.log('something went wrong');
            //                 }
            //             }

            //         });

            //         // return false to prevent normal browser submit and page navigation
            //         return false;
            //     });
            // });


            // [POST]
            // media_type:

            //     This field holds the type of the media.  Valid types include:

            //         text - a text post.  there is no limit on it's length.
            //         audio - an audio recording (should be in mp3 format)
            //         video - a video recording (should be in mpg format)
            //         image - an image (should be in jpg format)

            //     If a media_type of 'text' is used, then the media_text field must contain a non-zero length string.  If
            //     any other media_type is used, then the media_file field must contain file data.  Not following these
            //     rules will produce a { "success": false } response.

            // [POST]
            // media_file:

            //     This is of type file, and will be the media object that is being uploaded.  This is an optional field,
            //     but the media_type filed must be 'text' if this is not included, else { "success": false } will be
            //     returned.

            // [POST]
            // media_text

            //     This is of type text, and will hold the text of the media post.  This is an optional field, but the
            //     media_type field must be 'audio', 'video', or 'image' if this is not include, else a
            //     { "success": false } will be returned.

            // [POST]
            // media_caption

            //     This is of type text, and will hold an additional description of the media type.  This is an optional
            //     and does not need to be included.




        // // add extra media
        // document.querySelector('#add-extra-media div.flex').onclick = function(e) {
        //   if (e.target.nodeName === 'I' || e.target.nodeName === 'DIV') {
        //     // what type of media are we going to add?
        //     var form_type = (e.target.nodeName === 'I') ? e.target.parentNode.className : e.target.className,
        //         form_template = '#'+form_type.split('add-')[1].split(' ')[0] + '-form-template';

        //     // add the form
        //     yellr.utils.render_template({
        //       template: form_template,
        //       target: '.forms-wrapper',
        //       append: true
        //     });
        //   }
        // };



        },



        submit_tip: function(callback) {

            console.log('get all the forms');

            var $forms = $('.form-container form');
            var media_objects = [];


            console.log($forms.length);

            for (var i = 0; i < $forms.length; i++) {
              var form = $forms[i];
              console.log(i, form);

              // make sure the form is not empty [returns true or false]
              if (this.validate_form(form)) {

                $(form).ajaxSubmit({
                  url: yellr.URLS.upload,
                  data: {
                    client_id: yellr.UUID
                  },
                  success: function (response) {
                    console.log(response);
                    if (response.success) {
                      // add the media_id to our local array
                      media_objects.push(response.media_id);
                      if (media_objects.length === $forms.length) {
                        yellr.modules.submit.publish_post(media_objects, function () {
                            console.log('lol things?S');
                          // reset to text
                          // yellr.utils.render_template({
                          //   template: '#text-form-template',
                          //   target: '.forms-wrapper'
                          // });
                        });
                      }
                    } else {
                      console.log('Something went wrong with upload_media...');
                      console.log(response);
                    }
                  },
                  clearForm: true
                });
                // end ajaxSubmit
              }
            }
        },


        validate_form: function (form) {

            var $form = $(form);
            var valid = false;

            // what kind of form is it?
            if ($form.attr('data-media-type') === 'text') {
                // make sure textarea is not empty
                console.log($form.find('textarea').val());
                if ($form.find('textarea').val() !== '') valid = true;
                else {
                    alert('form is empty');
                    // yellr.utils.notify('The text form is empty.');
                }

            } else {
                // we are submitting media
                // make sure input(name="media_file") is not empty
                if (form.querySelector('input[name="media_file"]').value) valid = true;
                else {
                    alert('form is empty');
                    yellr.utils.notify('Missing media file.');
                }
            }


            return valid;
        },



        publish_post: function(media_objects, callback) {

            $.post(yellr.URLS.post, {
                title: 'Web Submission',
                client_id: yellr.UUID,
                assignment_id: null,
                language_code: yellr.SETTINGS.language.code,
                lat: yellr.SETTINGS.lat,
                lng: yellr.SETTINGS.lng,
                media_objects: JSON.stringify(media_objects)
            }, function(e) {
                console.log('post published');
                // generate new UUID after every post to help protect anonymity
                yellr.UUID = yellr.utils.guid();
                // yellr.utils.save();
            }).done(function () {
                if (callback) callback();
            });

        }





    }

}($, window, window.document));

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
             * if a callback is provided it will pass the array to that function
             */

            // load the things
            $.getJSON(yellr.URLS.assignments, function (response) {

                if (response.success) {

                    if (callback) callback(response.assignments);
                    else console.log(response.assignments);

                } else {

                    console.log('lol - error in get_assignments');

                }
            });

        },


        get_stories: function (callback) {

            // load the things
            $.getJSON(yellr.URLS.stories, function (response) {

                if (response.success) {

                    if (callback) callback(response.stories);
                    else console.log(response.stories);

                } else {

                    console.log('lol - error in get_stories');

                }
            });
        },


        get_local_posts: function (callback) {

            // load the things
            $.getJSON(yellr.URLS.get_local_posts, function (response) {

                console.log(response);
                // if (response.success) {

                //     if (callback) callback(response.stories);
                //     else console.log(response.stories);

                // } else {

                //     console.log('lol - error in get_local_posts');

                // }
            });
        }

    }


}($, window, window.document));
