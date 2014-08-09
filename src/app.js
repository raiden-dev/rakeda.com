require.config({
  baseUrl: '/js/app',

  paths: {
    templates:  '/templates',
    hbs:        '/js/hbs',

    backbone:   '/js/lib/backbone',
    jquery:     '/js/lib/jquery',
    underscore: '/js/lib/underscore',
    handlebars: '/js/lib/handlebars'
  },

  shim: {
    backbone: {
      deps: ['jquery', 'underscore']
    }
  }
});

require([
  'Router',

  'backbone',
  'hbs/helpers'
], function (Router) {

  new Router();
  Backbone.history.start({ pushState: true });

});
