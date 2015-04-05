/*!
 * yellr-web v0.0.1 (http://yellr.net)
 * Copyright 2014-2015 hhroc
 * Licensed under MIT (https://github.com/hhroc/yellr-web/blob/master/LICENSE)
 */

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

        // // hook up the submit button
        // document.querySelector('.submit-btn').onclick = function (e) {
        //   e.preventDefault();
        //   yellr.utils.submit_form();
        // }




        },



        submit_form: function(callback) {

            var forms = document.querySelectorAll('.forms-wrapper form'),
                form_counter = 0,
                media_objects = [];

            console.log(forms.length);
            for (var i = 0; i < forms.length; i++) {
              var form = forms[i];
              console.log(i, form);

              // make sure the form is not empty [returns true or false]
              if (yellr.utils.validate_form(form)) {

                $(form).ajaxSubmit({
                  url: yellr.URLS.upload,
                  data: {
                    client_id: yellr.UUID
                  },
                  success: function (response) {
                    if (response.success) {
                      // add the media_id to our local array
                      form_counter++;
                      media_objects.push(response.media_id);
                      if (form_counter === forms.length) {
                        yellr.utils.publish_post(media_objects, function () {
                          // reset to text
                          yellr.utils.render_template({
                            template: '#text-form-template',
                            target: '.forms-wrapper'
                          });
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
              } else {
                // keep counter going, little hackish
                form_counter++;
              }
            }
        },


        validate_form: function (form) {
        // return value:
        var valid = false;

        // what kind of form is it?
        if (form.id === 'text-form') {
          // make sure textarea is not empty
          if (form.querySelector('textarea').value !== '') valid = true;
          else yellr.utils.notify('The text form is empty.');

        } else {
          // we are submitting media
          // make sure input(name="media_file") is not empty
          if (form.querySelector('input[name="media_file"]').value) valid = true;
          else yellr.utils.notify('Missing media file.');
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
              yellr.utils.save();
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
