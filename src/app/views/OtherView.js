define([
  'views/AbstractView',
  'templates/other',

  'backbone'
], function (AbstractView, otherTemplate) {

  var OtherView = AbstractView.extend({

    el: '#main',

    template: otherTemplate

  });

  return OtherView;

});
