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
