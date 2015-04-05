(function ($, window, document, undefined) {
    'use strict';

    window.yellr = {

        tag: 'Yellr Frontpage',

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

            console.log(this.tag);

            // initialize all modules
            for (var module in this.modules) {
                this.modules[module].init();
            }

            // generate the UUID
            this.UUID = this.utils.guid();
            console.log('UUID created: ', this.UUID);

            // generate the URLS
            this.URLS.assignments =    this.BASE_URL+'get_assignments.json?client_id='+this.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
            this.URLS.notifications =  this.BASE_URL+'get_notifications.json?client_id='+this.UUID,
            this.URLS.messages =       this.BASE_URL+'get_messages.json?client_id='+this.UUID,
            this.URLS.stories =        this.BASE_URL+'get_stories.json?client_id='+this.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code,
            this.URLS.profile =        this.BASE_URL+'todo',
            this.URLS.upload =         this.BASE_URL+'upload_media.json',
            this.URLS.post =           this.BASE_URL+'publish_post.json',
            this.URLS.server_info =    this.BASE_URL+'server_info.json',
            this.URLS.send_message =   this.BASE_URL+'create_response_message.json'
            console.log(this.URLS);

            console.log(this.SETTINGS);


            $('#submit-tip').click(function () {
              console.log('get all the forms');
            });

            $('#textarea').keydown(function (event) {
                $("#display").text((event.metaKey || event.ctrlKey) && event.keyCode == 13);
            });


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
            }

        }
    }

    $(document).ready(function () {
        $(document).foundation();
        yellr.init();
    });

}($, window, window.document));
