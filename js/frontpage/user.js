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
