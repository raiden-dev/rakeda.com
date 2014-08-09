define([
  'views/AbstractView',
  'templates/web',

  'backbone'
], function (AbstractView, webTemplate) {

  var WebView = AbstractView.extend({

    el: '#main',

    template: webTemplate

  });

  return WebView;

});
