(function($, _, Transparency) {

  "use strict";

  // Constants
  var XS = 0,
      SM = 768,
      MD = 992,
      LG = 1200,
      VIDEO_ID = 'zKdwTgrow3E',
      EMBED = '<iframe style="position:fixed" width="1" height="1" frameborder="0" src="//www.youtube.com/v/' + VIDEO_ID + '?hd=1&autoplay=1&loop=1&playlist=,"></iframe>',
      SECRET = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  // Globals
  var kkeys = [];

  // Utilities
  var pLog = _.curry(function(qty, text, args) {
    console.log.apply(console, [text + ': '].concat([].slice.call(arguments, 2, qty + 2)));
  });
  var getIdx = _.curry(function(idx, arr) {return arr[idx];});

  // Takes object with width:func(curWidth)
  function onWidths(obj) {
    // Initialize 0 if not already there
    if (!obj[0])
      obj[0] = _.noop;

    var base = function() {
      var $width = window.outerWidth;
      var reduction = function(a, v, k) {return $width >= +k && +k > +a ? +k : +a;};
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

  var hideIfNot = _.curry(function(key, p) {
    var req = p.element.dataset[key];
    if (!req)
      return;

    req = req.split(' ');
    var thiz = this;
    var reduction = function(a, b) {return a && !thiz[b];};

    if (_(req).reduce(reduction, true))
      return 'display: none';
  });

  var hiddenPrint = function(p) {
    return p.element.className + ' ' + (this.hiddenPrint ? 'hidden-print' : '');
  };

  var noText = function() {
    return '';
  };

  var defaultBGI = function() {
    return 'background-image: url(' + (this.image || 'img/default.png') + ')';
  };

  var webLink = function(p) {
    // Get dest obj from data binding
    var dest = p.element.dataset.bind;
    if (!dest || !this[dest])
      return;
    var url = this[dest];

    // Add protocol if not already at start
    if (url.indexOf('http://') && url.indexOf('https://'))
      url = 'http://' + url;
    return url;
  };

  var namedWebLink = function() {
    // Requires url to be in values scope
    var url = this.url;
    if (!url)
      return;

    // Add protocol if not already at start
    if (url.indexOf('http://') && url.indexOf('https://'))
      url = 'http://' + url;
    return url;
  };

  $(function() {
    // Fade in after ajax
    $('body').hide();

    // Ajax calls
    $.when(
      $.getJSON('data/data.json', function(data) {
        $('html').render(data, {
          'hide-if-not': {
            text: noText,
            style: hideIfNot('values')
          },
          'hide-if-not-bound': {
            text: noText,
            style: hideIfNot('bind')
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
            },
            target: function() {return '_blank';}
          },
          link: {
            href: webLink,
            target: function() {return '_blank';}
          },
          experience: {
            container: {
              class: hiddenPrint
            },
            name: {
              href: namedWebLink,
              target: function() {return '_blank';}
            },
            content: {
              value: {
                text: function() {
                  return this.value;
                }
              },
              style: hideIfNot('bind')
            },
            url: {
              text: noText,
              href: webLink,
              target: function() {return '_blank';}
            },
            image: {
              text: noText,
              style: defaultBGI
            }
          },
          education: {
            classes: {
              style: hideIfNot('bind')
            }
          },
          skills: {
            icon: {
              text: noText,
              class: function(p) {
                return p.element.className + ' ' + (this.icon || 'fa-code');
              }
            }
          },
          projects: {
            container: {
              class: hiddenPrint
            },
            name: {
              href: namedWebLink,
              target: function() {return '_blank';}
            },
            content: {
              value: {
                text: function() {
                  return this.value;
                }
              },
              style: hideIfNot('bind')
            },
            url: {
              text: noText,
              href: webLink,
              target: function() {return '_blank';}
            },
            image: {
              text: noText,
              style: defaultBGI
            }
          },
          organizations: {
            namedate: {
              text: function(p) {
                return this.name + (this.date ? ' (' + this.date + ')' : '');
              }
            }
          }
        });
      }).fail(errRedirect),

      $.getJSON('data/credits.json', function(data) {
        $('#credits-list').render(data, {
          entry: {
            text: function() {
              return this.name;
            },
            href: namedWebLink,
            target: function() {return '_blank';}
          }
        });
      }).fail(errRedirect)
    ).

    then(function() {
      var reduction = function(a, b) {return a && (b === 'success');};

      if (_(arguments).map(getIdx(1)).reduce(reduction, true))
        $('body').fadeIn('slow');
      else
        errRedirect(null, 'Not all ajax calls returned success', arguments);
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