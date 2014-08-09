define([
  'views/AbstractView',
  'views/NavView',
  'templates/sidebar',

  'backbone'
], function (AbstractView, NavView, sidebarTemplate) {

  var SidebarView = AbstractView.extend({

    el: '#sidebar',

    template: sidebarTemplate,

    partials: {
      nav: new NavView()
    }

  });

  return SidebarView;

});
