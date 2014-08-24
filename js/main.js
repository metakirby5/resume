(function($) {
  $('html').render({
    first: 'Ethan',
    last: 'Chan',
    phone: '858.380.9082',
    addr: 'ADDR',
    email: 'chan.ethan.5@gmail.com',
    website: 'ethanchan.com',
    github: 'github.com/metakirby5',
    linkedin: 'linkedin.com/in/ethanjchan',
  }, {
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
        // Get url obj from first class applied
        var url = this[p.element.classList[0] || p.element.className] || null;
        // Add www if not already at start
        if (url && [0, -1].indexOf(url.indexOf('http://')) !== -1)
          url = 'http://' + url;
        return url;
      }
    }
  });
})(window.jQuery);