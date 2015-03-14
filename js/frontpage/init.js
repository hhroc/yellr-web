(function ($, window, document, undefined) {
    'use strict';

    window.ajl = {

        tag: 'Yellr Frontpage',

        modules: {},

        init: function () {
            console.log(this.tag);

            // initialize all modules
            for (var module in this.modules) {
                this.modules[module].init();
            }

        }
    }

    $(document).ready(function () {
        $(document).foundation();
        ajl.init();
    });

}($, window, window.document));
