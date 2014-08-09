define([
  'views/AbstractView',
  'templates/all',

  'backbone'
], function (AbstractView, allTemplate) {

  // Handlebars.registerPartial('nav', navTemplate);

  var AllView = AbstractView.extend({

    el: '#main',

    template: allTemplate

  });

  return AllView;

});
