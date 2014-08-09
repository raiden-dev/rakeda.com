(function () {

  function helpers(Handlebars) {

    Handlebars.registerHelper('ts', function () {
      return Math.round((new Date()).getTime() / 1000);
    });

    Handlebars.registerHelper('set', function (src, ext) {
      if (src && ext) {
        for (var key in ext.hash) {
          src[key] = ext.hash[key];
        }
      }
    });

    Handlebars.registerHelper('json', function (obj) {
      return new Handlebars.SafeString(JSON.stringify(obj));
    });

    Handlebars.registerHelper('copyright', function (startYear) {
      var curYear = (new Date()).getFullYear(),
          years = (curYear > startYear) ? startYear + '-' + curYear : startYear;

      return new Handlebars.SafeString(years);
    });

  }

  if (typeof define === 'function') {
    return define(['handlebars'], helpers);
  }
  else {
    return module.exports.register = helpers;
  }

}());
