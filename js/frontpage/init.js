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
