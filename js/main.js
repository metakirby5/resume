(function($) {
  $('html').render({
    // Values
    first: 'Ethan',
    last: 'Chan',
    phone: '858.380.9082',
    addr: 'ADDR',
    email: 'chan.ethan.5@gmail.com',
    website: 'ethanchan.com',
    github: 'github.com/metakirby5',
    linkedin: 'linkedin.com/in/ethanjchan',
    credits: [
      {
        name: 'jQuery',
        url: 'http://jquery.com/',
      },
      {
        name: 'Transparency',
        url: 'http://leonidas.github.io/transparency/',
      },
      {
        name: 'HTML5 Boilerplate',
        url: 'http://html5boilerplate.com/',
      },
      {
        name: 'Twitter Bootstrap',
        url: 'http://getbootstrap.com/',
      }
    ],
  }, {
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
})(window.jQuery);