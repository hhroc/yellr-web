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
