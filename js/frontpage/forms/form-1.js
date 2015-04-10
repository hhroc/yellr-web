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
