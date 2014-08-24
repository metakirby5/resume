(function($, Transparency) { $(function() {

  // Config
  Transparency.matcher = function(element, key) {
    return (element.el.getAttribute('data-bind') === key ||
            element.el.getAttribute('data-extra') === key);
  };

  function localText(p) {
    // Get obj from data binding
    var item = p.element.dataset.bind;
    if (!item || !this[item] || !this[item].text)
      return;
    return this[item].text;
  }

  function localLink(p) {
    // Get obj from data binding
    var item = p.element.dataset.bind;
    if (!item || !this[item] || !this[item].url)
      return;
    return this[item].url;
  }

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

  function namedWebLink() {
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
      phone: {
        href: function() {return 'tel:' + this.phone;}
      },
      email: {
        href: function() {return 'mailto:' + this.email;}
      },
      link: {
        href: webLink
      },
      localLink: {
        text: localText,
        href: localLink
      },
      experience: {
        content: {
          value: {
            text: function() {return this.value;}
          }
        }
      },
      forkme: {
        text: function() {return this.forkme.text;},
        href: function() {return this.forkme.url;}
      },
      credits: {
        entry: {
          text: function() {return this.text;},
          href: namedWebLink
        }
      }
    });
  });
});})(window.jQuery, window.Transparency);