define([
  'views/AbstractView',
  'templates/ui',

  'backbone'
], function (AbstractView, uiTemplate) {

  var UiView = AbstractView.extend({

    el: '#main',

    template: uiTemplate

  });

  return UiView;

});
