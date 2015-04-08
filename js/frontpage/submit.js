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

            /**
             * there will always be a text tip
             *     - title
             *     - optional description
             *
             *  there could also be extra media
             */


            var $text_title = $('#init-input').val();

            if ($text_title === '') {
                alert('Title is empty.');
                return;
            }
            console.log($text_title);

            var media_caption = $('#media_caption').val();
            console.log(media_caption);

            var media_objects = [];

            $('#report-form-1').ajaxSubmit({
                url: yellr.URLS.upload,
                // data: {
                //     media_type: 'text',
                //     media_text: $text_title
                // },
                success: function (response) {
                    console.log(response);
                    if (response.success) {
                        media_objects.push(response.media_id);
                        yellr.modules.submit.publish_post(media_objects, function () {
                            console.log('lol things?S');
                        });

                    } else {
                        console.log('Something went wrong with upload_media...');
                    }
                },
                clearForm: true
            });



            // ----------------------------------------
            // console.log('get all the forms');

            // var $forms = $('.form-container form');
            // var media_objects = [];


            // console.log($forms.length);

            // for (var i = 0; i < $forms.length; i++) {
            //   var form = $forms[i];
            //   console.log(i, form);

            //   // make sure the form is not empty [returns true or false]
            //   if (this.validate_form(form)) {

            //     $(form).ajaxSubmit({
            //       url: yellr.URLS.upload,
            //       data: {
            //         client_id: yellr.UUID
            //       },
            //       success: function (response) {
            //         console.log(response);
            //         if (response.success) {
            //           // add the media_id to our local array
            //           media_objects.push(response.media_id);
            //           if (media_objects.length === $forms.length) {
            //             yellr.modules.submit.publish_post(media_objects, function () {
            //                 console.log('lol things?S');
            //               // reset to text
            //               // yellr.utils.render_template({
            //               //   template: '#text-form-template',
            //               //   target: '.forms-wrapper'
            //               // });
            //             });
            //           }
            //         } else {
            //           console.log('Something went wrong with upload_media...');
            //           console.log(response);
            //         }
            //       },
            //       clearForm: true
            //     });
            //     // end ajaxSubmit
            //   }
            // }
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
                assignment_id: null,
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
