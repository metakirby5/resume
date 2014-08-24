(function($, Transparency) { $(function() {

  // Make transparency only match data-bind and data-extra
  Transparency.matcher = function(element, key) {
    return (element.el.getAttribute('data-bind') === key ||
            element.el.getAttribute('data-extra') === key);
  };

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
      experience: {
        content: {
          value: {
            text: function() {return this.value;}
          }
        }
      },
      skills: {
        icon: {
          text: function() {return '';},
          class: function(p) {return p.element.className + ' ' + (this.icon || 'fa-code');}
        },
        name: {
          text: function(p) {return commaize(this.name, p.index, data.skills);}
        }
      },
      projects: {
        content: {
          value: {
            text: function() {return this.value;}
          }
        }
      },
      organizations: {
        namedate: {
          text: function(p) {
            return commaize(this.name + ' (' + this.date + ')', p.index, data.organizations);
          }
        }
      },
      credits: {
        entry: {
          text: function(p) {return commaize(this.name, p.index, data.credits);},
          href: namedWebLink
        }
      }
    });
  }).fail(function(jqXHR, msg, err) {
    console.log(msg, err);
    //window.location.replace('error.html?msg='+msg+'&err='+err);
  });
});})(window.jQuery, window.Transparency);