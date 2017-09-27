if (Array.prototype.includes === undefined) {
  Array.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
  }
}

if (Array.prototype.find === undefined) {
  Array.prototype.find = function(callback) {
    for (let i = 0; i < this.length; i++) {
      let item = this[i];
      if (callback(item)) {
        return item;
      }
    }
    return null;
  }
}

if (Array.prototype.findIndex === undefined) {
  Array.prototype.findIndex = function(callback) {
    for (let i = 0; i < this.length; i++) {
      let item = this[i];
      if (callback(item)) {
        return i;
      }
    }
    return -1;
  }
}

if (String.prototype.includes === undefined) {
  String.prototype.includes = function(item) {
    return this.indexOf(item) > -1;
  }
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
}

if (window.Symbol === undefined) {
  window.Symbol = (function() {
    let counter = Math.round(Math.random() * 0xfffffff);
    return function() {
      return String(counter++);
    };
  })();
}

if (Array.from === undefined) {
  Array.from = function(iterable) {
    return Array.prototype.slice.call(iterable);
  }
}

if (Object.assign === undefined) {
  Object.assign = function(target, sources) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i];
      if (source !== null && source !== undefined) {
        for (let prop in source) {
          if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
          }
        }
      }
    }
    return target;
  }
}

if (Element.prototype.remove === undefined) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

try {
  let e = new Event('change', {bubbles: true});
} catch (e) {
  (function(EventPrototype) {
    Event = function(type, options) {
      let event = document.createEvent('Event');
      event.initEvent(
          type, Boolean(options.bubbles), Boolean(options.cancelable));
      return event;
    };
    Event.prototype = EventPrototype;
  })(Event);
}

if (Number.parseInt === undefined) {
  Number.parseInt = parseInt;
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
}
