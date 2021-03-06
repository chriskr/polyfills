if (Array.from === undefined) {
  Array.from = function(iterable) {
    return Array.prototype.slice.call(iterable);
  }
  console.info('Patched Array.from');
}

if (Array.prototype.includes === undefined) {
  Array.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
  }
  console.info('Patched Array.prototype.includes');
}

if (Array.prototype.find === undefined) {
  Array.prototype.find = function(callback) {
    for (var i = 0; i < this.length; i++) {
      var item = this[i];
      if (callback(item)) {
        return item;
      }
    }
    return null;
  }
  console.info('Patched Array.prototype.find');
}

if (Array.prototype.findIndex === undefined) {
  Array.prototype.findIndex = function(callback) {
    for (var i = 0; i < this.length; i++) {
      var item = this[i];
      if (callback(item)) {
        return i;
      }
    }
    return -1;
  }
  console.info('Patched Array.prototype.findIndex');
}

if (window.Symbol === undefined) {
  window.Symbol = (function(key) {
    var counter = Math.round(Math.random() * 0xfffffff);
    return function() {
      return '__key(' + (key || '') + ')__' + String(counter++) +'__';
    };
  })();
  Symbol.iterator = Symbol('iterator');
  console.info('Patched Symbol');
}

var GeneratorPolyfill = function(iterable) {
  this.iterable_ = iterable;
  this.pointer_ = 0;
  this.done_ = false;
};

GeneratorPolyfill.generator = Array.prototype[Symbol.iterator] || function() {
  return new GeneratorPolyfill(this);
};

GeneratorPolyfill.prototype = new function() {
  this.next = function f() {
    if (!this.done_) {
      this.done_ = this.pointer_ >= this.iterable_.length;
    }
    var value = undefined;
    if (!this.done_) {
      value = this.iterable_[this.pointer_++];
    }
    return {value: value, done: this.done_};
  }

  this.return = function(value) {
    this.done_ = true;
    return {value: value, done: this.done_};
  }
};

(function() {
  var getName = function(class_) {
    if (class_.name !== undefined) {
      return class_.name;
    }
    var str = String(class_);
    var match = /[A-Z][^ \(\]]+/.exec(str);
    if (match) {
      return match[0];
    }
    return str;
  }
  var classes = [Array, NodeList];
  for (var i = 0, class_; class_ = classes[i]; i++) {
    if (class_.prototype[Symbol.iterator] === undefined) {
      class_.prototype[Symbol.iterator] = GeneratorPolyfill.generator;
      console.info(
          'Patched ' + getName(class_) + '.prototype[Symbol.iterator]');
    }
  }
})();

if (String.prototype.includes === undefined) {
  String.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
  }
  console.info('Patched String.prototype.includes');
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (String.prototype.repeat === undefined) {
  String.prototype.repeat = function(count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  }
  console.info('Patched String.prototype.repeat');
}

if (Object.assign === undefined) {
  Object.assign = function(target, sources) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (source !== null && source !== undefined) {
        for (var prop in source) {
          if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
          }
        }
      }
    }
    return target;
  }
  console.info('Patched Object.assign');
}

if (Element.prototype.remove === undefined) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
  console.info('Patched Element.prototype.remove');
}

try {
  var e = new Event('change', {bubbles: true});
} catch (e) {
  (function(EventPrototype) {
    Event = function(type, options) {
      var event = document.createEvent('Event');
      event.initEvent(
          type, Boolean(options.bubbles), Boolean(options.cancelable));
      return event;
    };
    Event.prototype = EventPrototype;
  })(Event);
  console.info('Patched new Event(type, options)');
}

if (Number.parseInt === undefined) {
  Number.parseInt = parseInt;
  console.info('Patched Number.parseInt');
}

if (document.createElement('div').classList.toggle('foo', false) === true) {
  DOMTokenList.prototype.toggle = (function(toggle) {
    return function(className, state) {
      if (state === undefined) {
        return toggle.call(this, className);
      }
      if (state) {
        this.add(className);
      } else {
        this.remove(className);
      }
      return this.contains(className);
    };
  })(DOMTokenList.prototype.toggle);
  console.info('Patched DOMTokenList.prototype.toggle');
}

if (SVGElement.prototype.__lookupGetter__('classList') === undefined) {
  var classListGetter =  HTMLElement.prototype.__lookupGetter__('classList');
  if (classListGetter) {
    SVGElement.prototype.__defineGetter__('classList', function() {
      return classListGetter.call(this);
    });
    console.info('Patched SVGElement.prototype.classList');
  }
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
      Element.prototype.msMatchesSelector || function(selector) {
        var candidates = this.parentNode.querySelectorAll(selector);
        for (var i = 0, candidate; candidate = candidates[i]; i++) {
          if (candidate === this) {
            return true
          }
        }
        return false;
      };
  console.info('Patched Element.prototype.matches');
}


if (!Element.prototype.closest) {
  Element.prototype.closest = function(selector) {
    var ele = this;
    while (ele && ele.nodeType === Node.ELEMENT_NODE) {
      if (ele.matches(selector)) {
        return ele;
      }
      ele = ele.parentNode;
    }
    return null;
  };
  console.info('Patched Element.prototype.closest');
}
