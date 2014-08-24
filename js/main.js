(function($) {

  function webLink(p) {
    // Get dest obj from data binding
    var dest = p.element.dataset.bind;
    if (!dest || !this[dest])
      return;
    var url = this[dest];

    // Add protocol if not already at start
    if (url.indexOf('http://'))
      url = 'http://' + url;
    return url;
  }

  function namedLink(p) {
    // Requires url to be in values scope
    var url = this.url;
    if (!url)
      return;

    // Add protocol if not already at start
    if (url.indexOf('http://'))
      url = 'http://' + url;
    return url;
  }

  $.getJSON('data.json', function(data) {
    $('html').render(data, {
      fullname: {
        text: function() {return this.first + ' ' + this.last;}
      },
      email: {
        href: function() {return 'mailto:' + this.email;}
      },
      link: {
        href: webLink
      },
      forkme: {
        text: function() {return this.forkme.text;},
        href: function() {return this.forkme.url;}
      },
      credits: {
        entry: {
          text: function() {return this.text;},
          href: namedLink
        }
      }
    });
  });
})(window.jQuery);