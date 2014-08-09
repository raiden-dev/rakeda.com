define([
  'backbone'
], function () {

  var AbstractView = Backbone.View.extend({

    bound: function (fn) {
      return fn.bind(this);
    },

    render: function (options) {
      options = options || {};
      var deferred = new $.Deferred();

      this.getTemplateData(options)
        .then(
          this.bound(function (data) {
            data = data || {};

            if (options.data) {
              data = _.extend(data, options.data);
            }

            this.$el.html(this.template(data));
          })
        )

        .then(
          this.bound(function () {
            _.each(this.partials, function (view) {
              view.setElement(view.$el.selector);
              view.render();
            });
          })
        )

        .then(this.onAfterRender.bind(this))

        .then(deferred.resolve)
      ;

      return deferred.promise();
    },

    getTemplateData: function () {
      return (new $.Deferred()).resolve().promise();
    },

    onAfterRender: $.noop

  });

  return AbstractView;

});
