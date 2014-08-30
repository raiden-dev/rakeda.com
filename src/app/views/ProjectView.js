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
      var $splash = this.$el.find('.project__splash'),
          $objects = this.$el.find('.project__objects'),
          $loader = this.$el.find('.loader');

      $splash.hide();
      $objects.hide();
      $loader.show();

      var $img = this.$el.find('img'),
          imgCount = $img.length,
          imgLoaded = 0,
          imgLoadDeferred = new $.Deferred();

      var $video = this.$el.find('video'),
          videoCount = $video.length,
          videoLoaded = 0,
          videoLoadDeferred = new $.Deferred();

      if ($video.length) {
        $video.on('loadeddata', function () {
          videoLoaded++;

          if (videoLoaded === videoCount) {
            videoLoadDeferred.resolve();
          }
        });
      }
      else {
        videoLoadDeferred.resolve();
      }

      if ($img.length) {
        $img.on('load', function () {
          imgLoaded++;

          if (imgLoaded === imgCount) {
            imgLoadDeferred.resolve();
          }
        });
      }
      else {
        imgLoadDeferred.resolve();
      }

      $.when(imgLoadDeferred, videoLoadDeferred)
        .done(function () {
          $loader.hide();
          $splash.show();
          $objects.show();
        });

      $(window).off('scroll').on('scroll', function () {
        var $arrow = this.$el.find('.js-scroll'),
            windowHeight = $(window).height(),
            offsetBottom = windowHeight - $arrow.offset().top - $arrow.height(),
            opacity = 1 - $(window).scrollTop() / (windowHeight - offsetBottom);

        if (opacity >= 0) {
          $arrow.css('opacity', opacity);
        }
      }.bind(this));

      this.$el.find('.js-scroll').off('click').on('click', function () {
        $('html, body').animate({
          scrollTop: $(window).height()
       }, 500);
      });
    }

  });

  return ProjectView;

});
