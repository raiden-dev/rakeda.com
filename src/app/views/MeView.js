define([
  'views/AbstractView',
  'templates/me',

  'backbone'
], function (AbstractView, meTemplate) {

  var MeView = AbstractView.extend({

    el: '#main',

    template: meTemplate

  });

  return MeView;

});
