(function($, Transparency) {

  // Make transparency only match data-bind and data-extra
  Transparency.matcher = function(element, key) {
    return (element.el.getAttribute('data-bind') === key ||
            element.el.getAttribute('data-extra') === key);
  };

  function hideIfNot(p) {
    // Get required data items
    var req = p.element.dataset.bind;
    if (!req)
      return;

    req = req.split(' ');
    for (var i = 0; i < req.length; i++) {
      if (!this[req[i]])
        return 'display: none';
    }
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

  function commaize(str, index, arr) {
    return str + (index !== arr.length - 1 ? ',' : '');
  }

  $(function() {
    $.getJSON('data/data.json', function(data) {
      $('html').render(data, {
        'hide-if-not': {
          text: function() {
            return '';
          },
          style: hideIfNot
        },
        fullname: {
          text: function() {
            return (this.first || '') + (this.first && this.last ? ' ' : '') + (this.last || '');
          }
        },
        phone: {
          href: function() {
            if (this.phone)
              return 'tel:' + this.phone.replace(/\s+/g, '');
          }
        },
        email: {
          href: function() {
            if (this.email)
              return 'mailto:' + this.email;
          }
        },
        location: {
          href: function() {
            if (this.location)
              return 'https://www.google.com/maps/place/' + this.location.replace(/\s+/g, '+');
          }
        },
        link: {
          href: webLink
        },
        experience: {
          content: {
            value: {
              text: function() {
                return this.value;
              }
            }
          }
        },
        skills: {
          icon: {
            text: function() {
              return '';
            },
            class: function(p) {
              return p.element.className + ' ' + (this.icon || 'fa-code');
            }
          },
          name: {
            text: function(p) {
              if (this.name && data.skills)
                return commaize(this.name, p.index, data.skills);
            }
          }
        },
        projects: {
          content: {
            value: {
              text: function() {
                return this.value;
              }
            }
          }
        },
        organizations: {
          namedate: {
            text: function(p) {
              if (this.name && this.date && data.organizations)
                return commaize(this.name + ' (' + this.date + ')', p.index, data.organizations);
            }
          }
        }
      });
    }).fail(function(jqXHR, msg, err) {
      console.log(msg, err);
      if (document.location.hostname !== "localhost")
        window.location.replace('error.html?msg='+msg+'&err='+err);
    });

    $.getJSON('data/credits.json', function(data) {
      $('#credits-list').render(data, {
        entry: {
          text: function(p) {
            if (this.name && data)
              return commaize(this.name, p.index, data);
          },
          href: namedWebLink
        }
      });
    }).fail(function(jqXHR, msg, err) {
      console.log(msg, err);
      if (document.location.hostname !== "localhost")
        window.location.replace('error.html?msg='+msg+'&err='+err);
    });
  });

})(window.jQuery, window.Transparency);