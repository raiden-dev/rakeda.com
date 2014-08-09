define([
  'views/AbstractView',
  'templates/nav',

  'backbone'
], function (AbstractView, navTemplate) {

  var NavView = AbstractView.extend({

    el: '#nav',

    template: navTemplate

  });

  return NavView;

});
