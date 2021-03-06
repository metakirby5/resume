(function($, _, jsyaml, Transparency) {

"use strict";

// # Constants
var XS = 0,
    SM = 768,
    MD = 992,
    LG = 1200,
    VIDEO_ID = 'zKdwTgrow3E',
    EMBED = '<iframe style="display:none" src="//www.youtube.com/v/' + VIDEO_ID + '?hd=1&autoplay=1&loop=1&playlist=,"></iframe>',
    SECRET = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

// # Globals
var $window = $(window),
    $document = $(document),
    $html = $('html'),
    $body = $('body'),
    kkeys = [];

// # Utilities
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
  $window.resize(base);
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

// # Directive helpers
var hideIfNotData = _.curry(function(key, p) {
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
  if (this.hiddenPrint)
    return [p.element.className, 'hidden-print'].join(' ');
};

var noText = function() {
  return '';
};

var targetBlank = function() {
  return '_blank';
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

// # Directive blocks
var card = {
  container: {
    class: hiddenPrint
  },
  name: {
    href: namedWebLink,
    target: targetBlank
  },
  content: {
    value: {
      html: function() {
        return this.value;
      }
    },
    style: hideIfNotData('bind')
  },
  image: {
    text: noText,
    style: defaultBGI,
    href: namedWebLink,
    target: targetBlank
  },
  cta: {
    text: noText,
    href: namedWebLink,
    target: targetBlank
  },
  'cta-content': {
    style: function() {
      if (!this.url)
        return 'display: none';
    }
  }
};

// # Page ready
$(function() {

  // Fade in after ajax
  $body.hide();

  // Ajax calls
  $.when(
    $.get('data/data.yaml', function(data) {
      $html.render(jsyaml.safeLoad(data), {
        'hide-if-not': {
          style: hideIfNotData('values')
        },
        'hide-if-not-bound': {
          style: hideIfNotData('bind')
        },
        fullname: {
          text: function() {
            return [this.first, this.last].join(' ');
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
          target: targetBlank
        },
        link: {
          href: webLink,
          target: targetBlank
        },
        experience: card,
        skills: {
          icon: {
            text: noText,
            class: function(p) {
              return [p.element.className, this.icon || 'fa-code'].join(' ');
            }
          }
        },
        projects: card,
        education: {
          meta: {
            class: function(p) {
              if (!this.classes)
                return [p.element.className, 'no-classes'].join(' ');
            }
          },
          main: {
            style: function() {
              if (!this.classes)
                return 'display: none';
            }
          },
          classes: {
            item: {
              class: hiddenPrint
            }
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

    $.get('data/credits.yaml', function(data) {
      $('#credits-list').render(jsyaml.safeLoad(data), {
        entry: {
          text: function() {
            return this.name;
          },
          href: namedWebLink,
          target: targetBlank
        }
      });
    }).fail(errRedirect)
  ).

  then(function() {
    var reduction = function(a, b) {return a && (b === 'success');};

    if (_(arguments).map(getIdx(1)).reduce(reduction, true)) {
      var $cards = $('.card:not(.visible-print .card)');
      $cards.addClass('prereveal');
      $body.fadeIn('slow');
      $cards.each(function(idx) {
        var thiz = this;
        setTimeout(function() {
          $(thiz).removeClass('prereveal');
        }, 100 * (idx + 1));
      });

      // Expandable education classes
      $('.showmore').click(function(e) {
        e.preventDefault();

        var $card = $(this).parent();
        var $icon = $($(this).children()[0]);
        var listFull = 'full',
            iconCollapsed = 'fa-chevron-down',
            iconFull = 'fa-chevron-up';

        if ($card.hasClass(listFull)) {
          $card.removeClass(listFull);
          $icon.removeClass(iconFull);
          $icon.addClass(iconCollapsed);
        }
        else {
          $card.addClass(listFull);
          $icon.removeClass(iconCollapsed);
          $icon.addClass(iconFull);
        }
      });
    } else
      errRedirect(null, 'Not all ajax calls returned success', arguments);
  });

  // Log breakpoints (that's all for now)
  // var widths = {};
  // var pLog1 = pLog(1);
  // widths[XS] = pLog1('XS');
  // widths[SM] = pLog1('SM');
  // widths[MD] = pLog1('MD');
  // widths[LG] = pLog1('LG');
  // onWidths(widths);

  // Hide print button if can't print
  if (!window.print) {
    $('#printme-button').hide();
    $('#yaml-button').removeClass('col-sm-6');
  }

//   // Fadeaways
//   var processFadeaways = function() {
//     $('.fadeaway').removeClass('disable');
//
//     if ($window.scrollTop() + $window.height() >= $document.height() - 1)
//       $('.fadeaway.bottom').addClass('disable');
//   };
//   $window.scroll(processFadeaways);

  // shhhh
  var secretFunc;
  $document.keydown(secretFunc = function(e) {
    kkeys.push(e.keyCode);
    if (kkeys.length > SECRET.length)
      kkeys.shift();
    if (_.isEqual(kkeys, SECRET)) {
      $document.unbind('keydown', secretFunc);
      $body.append(EMBED);
    }
  });
});

})(window.jQuery, window._, window.jsyaml, window.Transparency);
