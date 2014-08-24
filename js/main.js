(function($) {
  $.getJSON('data.json', function(data) {
    $('html').render(data, {
      // Directives
      fullname: {
        text: function(p) {
          return this.first + ' ' + this.last;
        }
      },
      email: {
        href: function(p) {
          return 'mailto:' + this.email;
        }
      },
      link: {
        href: function(p) {
          // Get dest obj from data binding
          var dest = p.element.dataset.bind;
          if (!dest || !this[dest])
            return;

          var url = this[dest];
          // Add protocol if not already at start
          if ([0, -1].indexOf(url.indexOf('http://')) !== -1)
            url = 'http://' + url;
          return url;
        }
      },
    });
  });
})(window.jQuery);