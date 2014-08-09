define([
  'views/AbstractView',
  'templates/project',

  'backbone'
], function (AbstractView, projectTemplate) {

  var ProjectView = AbstractView.extend({

    el: '#main',

    template: projectTemplate,

    getTemplateData: function (options) {
      var deferred = new $.Deferred();

      require(['templates/' + options.name],
      function (projectNameTemplate) {
        Handlebars.partials.projectName = projectNameTemplate;
        deferred.resolve();
      }.bind(this));

      return deferred.promise();
    },

    onAfterRender: function () {
      this.$el.find('.js-scroll').off('click').on('click', function () {
        $('html, body').animate({
          scrollTop: $(window).height()
       }, 500);
      });
    }

  });

  return ProjectView;

});
