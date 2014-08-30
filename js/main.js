(function($, _, Transparency) {

  "use strict";

  // Constants
  var XS = 0,
      SM = 768,
      MD = 992,
      LG = 1200,
      VIDEO_ID = 'zKdwTgrow3E',
      EMBED = '<iframe style="visibility:hidden;display:none" src="//www.youtube.com/v/' + VIDEO_ID + '?hd=1&autoplay=1&loop=1&playlist=,"></iframe>',
      SECRET = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  // Globals
  var kkeys = [];

  // Utilities
  var pLog = _.curry(function(qty, text, args) {
    console.log.apply(console, [text + ': '].concat(Array.prototype.slice.call(arguments, 2, qty + 2)));
  });
  var getIdx = _.curry(function(idx, arr) {return arr[idx];});

  function commaize(str, index, arr) {
    return str + ((index !== arr.length - 1) ? ',' : '');
  }

  // Takes object with width:func(curWidth)
  function onWidths(obj) {
    // Initialize 0 if not already there
    if (!obj[0])
      obj[0] = function(){};

    var base = function() {
      var $width = $(window).width();
      var reduction = function(a, v, k) {return $width > k ? k : a;};
      obj[_.reduce(obj, reduction, 0)]($width);
    };

    $(base);
    $(window).resize(base);
  }

  function errRedirect(jqXHR, msg, err) {
    console.log(msg, err);
    if (document.location.hostname !== "localhost")
      window.location.replace('error.html?msg='+msg+'&err='+err);
  }

  // Make transparency only match data-bind and data-cmd
  Transparency.matcher = function(element, key) {
    return (element.el.getAttribute('data-bind') === key ||
            element.el.getAttribute('data-cmd') === key);
  };

  function hideIfNot(p) {
    var req = p.element.dataset.values;
    if (!req)
      return;

    req = req.split(' ');
    var reduction = function(a, b) {return a && !b;};

    if (_(req).reduce(reduction, true))
      return 'display: none';
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

  $(function() {
    // Fade in after ajax
    $('body').hide();

    // Ajax calls
    $.when(
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
            name: {
              href: namedWebLink
            },
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
      }).fail(errRedirect),

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
      }).fail(errRedirect)
    ).

    then(function() {
      var reduction = function(a, b) {return a && (b === 'success');};

      if (_(arguments).map(getIdx(1)).reduce(reduction, true))
        $('body').fadeIn('slow');
    });

    // Other listeners
    var widths = {};
    var pLog1 = pLog(1);
    widths[XS] = pLog1('XS');
    widths[SM] = pLog1('SM');
    widths[MD] = pLog1('MD');
    widths[LG] = pLog1('LG');
    onWidths(widths);

    // shhhh
    var secretFunc;
    $(document).keydown(secretFunc = function(e) {
      kkeys.push(e.keyCode);
      if (kkeys.length > SECRET.length)
        kkeys.shift();
      if (_.isEqual(kkeys, SECRET)) {
        $(document).unbind('keydown', secretFunc);
        $('body').append(EMBED);
      }
    });
  });

})(window.jQuery, window._, window.Transparency);