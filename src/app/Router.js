define([
  'views/SidebarView',
  'templates/projects',

  'backbone'
], function (SidebarView, projects) {

  projects = JSON.parse(projects());

  var sidebar = new SidebarView();
  sidebar.render({ force: true });

  $('body').on('click', '.js-link', function (evt) {
    evt.preventDefault();
    var state = $(evt.currentTarget).attr('href');
    Backbone.history.navigate(state, { trigger: true });
  });

  var Router = Backbone.Router.extend({

    routes: {
      '':              'all',
      'web':           'web',
      'ui':            'ui',
      'other':         'other',
      'me':            'me',
      'contact':       'contacts',
      'project/:name': 'project',
      '*404':          'notFound'
    },

    all: function () {
      require(['views/AllView'],
      function (AllView) {
        sidebar.partials.nav.render({ data: {
          all: {
            isActive: true
          }
        }});
        (new AllView()).render({ force: true });
      });
    },

    web: function () {
      require(['views/WebView'],
      function (WebView) {
        sidebar.partials.nav.render({ data: {
          web: {
            isActive: true
          }
        }});
        (new WebView()).render({ force: true });
      });
    },

    ui: function () {
      require(['views/UiView'],
      function (UiView) {
        sidebar.partials.nav.render({ data: {
          ui: {
            isActive: true
          }
        }});
        (new UiView()).render({ force: true });
      });
    },

    other: function () {
      require(['views/OtherView'],
      function (OtherView) {
        sidebar.partials.nav.render({ data: {
          other: {
            isActive: true
          }
        }});
        (new OtherView()).render({ force: true });
      });
    },

    me: function () {
      require(['views/MeView'],
      function (MeView) {
        sidebar.partials.nav.render({ data: {
          me: {
            isActive: true
          }
        }});
        (new MeView()).render({ force: true });
      });
    },

    project: function (name) {
      if (projects[name]) {
        require(['views/ProjectView'],
        function (ProjectView) {
          sidebar.partials.nav.render();

          var project = new ProjectView();
          project.render({ force: true, name: name });
        });
      }
      else {
        this.notFound();
      }
    },

    notFound: function () {
      require(['views/NotFoundView'],
      function (NotFoundView) {
        sidebar.partials.nav.render();
        (new NotFoundView()).render({ force: true });
      });
    }

  });

  return Router;

});
