define([
  'views/AbstractView',
  'templates/not-found',

  'backbone'
], function (AbstractView, notFoundTemplate) {

  var NotFoundView = AbstractView.extend({

    el: '#main',

    template: notFoundTemplate

  });

  return NotFoundView;

});
