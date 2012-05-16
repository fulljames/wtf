/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build underscore bean domready qwery knockoutify
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.no.de
  * License MIT
  */
(function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + identifier] || window[identifier]
    if (!module) throw new Error("Ender Error: Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  /**
   * main Ender return object
   * @constructor
   * @param {Array|Node|string} s a CSS selector or DOM node(s)
   * @param {Array.|Node} r a root node(s)
   */
  function Ender(s, r) {
    var elements
      , i

    this.selector = s
    // string || node || nodelist || window
    if (typeof s == 'undefined') {
      elements = []
      this.selector = ''
    } else if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      elements = ender._select(s, r)
    } else {
      elements = isFinite(s.length) ? s : [s]
    }
    this.length = elements.length
    for (i = this.length; i--;) this[i] = elements[i]
  }

  /**
   * @param {function(el, i, inst)} fn
   * @param {Object} opt_scope
   * @returns {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  Ender.prototype.$ = ender // handy reference to self


  function ender(s, r) {
    return new Ender(s, r)
  }

  ender['_VERSION'] = '0.4.3-dev'

  ender.fn = Ender.prototype // for easy compat to jQuery plugins

  ender.ender = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  ender._select = function (s, r) {
    if (typeof s == 'string') return (r || document).querySelectorAll(s)
    if (s.nodeName) return [s]
    return s
  }


  // use callback to receive Ender's require & provide
  ender.noConflict = function (callback) {
    context['$'] = old
    if (callback) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      callback(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = context['ender'] || ender

}(this));


(function () {

  var module = { exports: {} }, exports = module.exports;

  //     Underscore.js 1.3.3
  //     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
  //     Underscore is freely distributable under the MIT license.
  //     Portions of Underscore are inspired or borrowed from Prototype,
  //     Oliver Steele's Functional, and John Resig's Micro-Templating.
  //     For all details and documentation:
  //     http://documentcloud.github.com/underscore
  
  (function() {
  
    // Baseline setup
    // --------------
  
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
  
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
  
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
  
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  
    // Create quick reference variables for speed access to core prototypes.
    var slice            = ArrayProto.slice,
        unshift          = ArrayProto.unshift,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;
  
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind;
  
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) { return new wrapper(obj); };
  
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root['_'] = _;
    }
  
    // Current version.
    _.VERSION = '1.3.3';
  
    // Collection Functions
    // --------------------
  
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (_.has(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    };
  
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      if (obj.length === +obj.length) results.length = obj.length;
      return results;
    };
  
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduce && obj.reduce === nativeReduce) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
      }
      each(obj, function(value, index, list) {
        if (!initial) {
          memo = value;
          initial = true;
        } else {
          memo = iterator.call(context, memo, value, index, list);
        }
      });
      if (!initial) throw new TypeError('Reduce of empty array with no initial value');
      return memo;
    };
  
    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
      }
      var reversed = _.toArray(obj).reverse();
      if (context && !initial) iterator = _.bind(iterator, context);
      return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
    };
  
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, iterator, context) {
      var result;
      any(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };
  
    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
      each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results[results.length] = value;
      });
      return results;
    };
  
    // Return all the elements for which a truth test fails.
    _.reject = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      each(obj, function(value, index, list) {
        if (!iterator.call(context, value, index, list)) results[results.length] = value;
      });
      return results;
    };
  
    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function(obj, iterator, context) {
      var result = true;
      if (obj == null) return result;
      if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
      each(obj, function(value, index, list) {
        if (!(result = result && iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = false;
      if (obj == null) return result;
      if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
      each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if a given value is included in the array or object using `===`.
    // Aliased as `contains`.
    _.include = _.contains = function(obj, target) {
      var found = false;
      if (obj == null) return found;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
      found = any(obj, function(value) {
        return value === target;
      });
      return found;
    };
  
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
      var args = slice.call(arguments, 2);
      return _.map(obj, function(value) {
        return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
      });
    };
  
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
      return _.map(obj, function(value){ return value[key]; });
    };
  
    // Return the maximum element or (element-based computation).
    _.max = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
      if (!iterator && _.isEmpty(obj)) return -Infinity;
      var result = {computed : -Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed >= result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
      if (!iterator && _.isEmpty(obj)) return Infinity;
      var result = {computed : Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed < result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Shuffle an array.
    _.shuffle = function(obj) {
      var shuffled = [], rand;
      each(obj, function(value, index, list) {
        rand = Math.floor(Math.random() * (index + 1));
        shuffled[index] = shuffled[rand];
        shuffled[rand] = value;
      });
      return shuffled;
    };
  
    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, val, context) {
      var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
      return _.pluck(_.map(obj, function(value, index, list) {
        return {
          value : value,
          criteria : iterator.call(context, value, index, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria, b = right.criteria;
        if (a === void 0) return 1;
        if (b === void 0) return -1;
        return a < b ? -1 : a > b ? 1 : 0;
      }), 'value');
    };
  
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = function(obj, val) {
      var result = {};
      var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
      each(obj, function(value, index) {
        var key = iterator(value, index);
        (result[key] || (result[key] = [])).push(value);
      });
      return result;
    };
  
    // Use a comparator function to figure out at what index an object should
    // be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator) {
      iterator || (iterator = _.identity);
      var low = 0, high = array.length;
      while (low < high) {
        var mid = (low + high) >> 1;
        iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
      }
      return low;
    };
  
    // Safely convert anything iterable into a real, live array.
    _.toArray = function(obj) {
      if (!obj)                                     return [];
      if (_.isArray(obj))                           return slice.call(obj);
      if (_.isArguments(obj))                       return slice.call(obj);
      if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
      return _.values(obj);
    };
  
    // Return the number of elements in an object.
    _.size = function(obj) {
      return _.isArray(obj) ? obj.length : _.keys(obj).length;
    };
  
    // Array Functions
    // ---------------
  
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
      return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
    };
  
    // Returns everything but the last entry of the array. Especcialy useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };
  
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
      if ((n != null) && !guard) {
        return slice.call(array, Math.max(array.length - n, 0));
      } else {
        return array[array.length - 1];
      }
    };
  
    // Returns everything but the first entry of the array. Aliased as `tail`.
    // Especially useful on the arguments object. Passing an **index** will return
    // the rest of the values in the array from that index onward. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = function(array, index, guard) {
      return slice.call(array, (index == null) || guard ? 1 : index);
    };
  
    // Trim out all falsy values from an array.
    _.compact = function(array) {
      return _.filter(array, function(value){ return !!value; });
    };
  
    // Return a completely flattened version of an array.
    _.flatten = function(array, shallow) {
      return _.reduce(array, function(memo, value) {
        if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
        memo[memo.length] = value;
        return memo;
      }, []);
    };
  
    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
      return _.difference(array, slice.call(arguments, 1));
    };
  
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator) {
      var initial = iterator ? _.map(array, iterator) : array;
      var results = [];
      // The `isSorted` flag is irrelevant if the array only contains two elements.
      if (array.length < 3) isSorted = true;
      _.reduce(initial, function (memo, value, index) {
        if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
          memo.push(value);
          results.push(array[index]);
        }
        return memo;
      }, []);
      return results;
    };
  
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
      return _.uniq(_.flatten(arguments, true));
    };
  
    // Produce an array that contains every item shared between all the
    // passed-in arrays. (Aliased as "intersect" for back-compat.)
    _.intersection = _.intersect = function(array) {
      var rest = slice.call(arguments, 1);
      return _.filter(_.uniq(array), function(item) {
        return _.every(rest, function(other) {
          return _.indexOf(other, item) >= 0;
        });
      });
    };
  
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
      var rest = _.flatten(slice.call(arguments, 1), true);
      return _.filter(array, function(value){ return !_.include(rest, value); });
    };
  
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
      var args = slice.call(arguments);
      var length = _.max(_.pluck(args, 'length'));
      var results = new Array(length);
      for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
      return results;
    };
  
    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function(array, item, isSorted) {
      if (array == null) return -1;
      var i, l;
      if (isSorted) {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
      if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
      for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
      return -1;
    };
  
    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function(array, item) {
      if (array == null) return -1;
      if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
      var i = array.length;
      while (i--) if (i in array && array[i] === item) return i;
      return -1;
    };
  
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
      if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
      }
      step = arguments[2] || 1;
  
      var len = Math.max(Math.ceil((stop - start) / step), 0);
      var idx = 0;
      var range = new Array(len);
  
      while(idx < len) {
        range[idx++] = start;
        start += step;
      }
  
      return range;
    };
  
    // Function (ahem) Functions
    // ------------------
  
    // Reusable constructor function for prototype setting.
    var ctor = function(){};
  
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Binding with arguments is also known as `curry`.
    // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
    // We check for `func.bind` first, to fail fast when `func` is undefined.
    _.bind = function bind(func, context) {
      var bound, args;
      if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
      if (!_.isFunction(func)) throw new TypeError;
      args = slice.call(arguments, 2);
      return bound = function() {
        if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
        ctor.prototype = func.prototype;
        var self = new ctor;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) return result;
        return self;
      };
    };
  
    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function(obj) {
      var funcs = slice.call(arguments, 1);
      if (funcs.length == 0) funcs = _.functions(obj);
      each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
      return obj;
    };
  
    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
      var memo = {};
      hasher || (hasher = _.identity);
      return function() {
        var key = hasher.apply(this, arguments);
        return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
    };
  
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function(){ return func.apply(null, args); }, wait);
    };
  
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
  
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    _.throttle = function(func, wait) {
      var context, args, timeout, throttling, more, result;
      var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
      return function() {
        context = this; args = arguments;
        var later = function() {
          timeout = null;
          if (more) func.apply(context, args);
          whenDone();
        };
        if (!timeout) timeout = setTimeout(later, wait);
        if (throttling) {
          more = true;
        } else {
          result = func.apply(context, args);
        }
        whenDone();
        throttling = true;
        return result;
      };
    };
  
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        if (immediate && !timeout) func.apply(context, args);
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };
  
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function(func) {
      var ran = false, memo;
      return function() {
        if (ran) return memo;
        ran = true;
        return memo = func.apply(this, arguments);
      };
    };
  
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
      return function() {
        var args = [func].concat(slice.call(arguments, 0));
        return wrapper.apply(this, args);
      };
    };
  
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
      var funcs = arguments;
      return function() {
        var args = arguments;
        for (var i = funcs.length - 1; i >= 0; i--) {
          args = [funcs[i].apply(this, args)];
        }
        return args[0];
      };
    };
  
    // Returns a function that will only be executed after being called N times.
    _.after = function(times, func) {
      if (times <= 0) return func();
      return function() {
        if (--times < 1) { return func.apply(this, arguments); }
      };
    };
  
    // Object Functions
    // ----------------
  
    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function(obj) {
      if (obj !== Object(obj)) throw new TypeError('Invalid object');
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
      return keys;
    };
  
    // Retrieve the values of an object's properties.
    _.values = function(obj) {
      return _.map(obj, _.identity);
    };
  
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };
  
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    };
  
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
      var result = {};
      each(_.flatten(slice.call(arguments, 1)), function(key) {
        if (key in obj) result[key] = obj[key];
      });
      return result;
    };
  
    // Fill in a given object with default properties.
    _.defaults = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
          if (obj[prop] == null) obj[prop] = source[prop];
        }
      });
      return obj;
    };
  
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
  
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };
  
    // Internal recursive comparison function.
    function eq(a, b, stack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
      if (a === b) return a !== 0 || 1 / a == 1 / b;
      // A strict comparison is necessary because `null == undefined`.
      if (a == null || b == null) return a === b;
      // Unwrap any wrapped objects.
      if (a._chain) a = a._wrapped;
      if (b._chain) b = b._wrapped;
      // Invoke a custom `isEqual` method if one is provided.
      if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
      if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className != toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return a == String(b);
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
          // other numeric values.
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') return false;
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      var length = stack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (stack[length] == a) return true;
      }
      // Add the first object to the stack of traversed objects.
      stack.push(a);
      var size = 0, result = true;
      // Recursively compare objects and arrays.
      if (className == '[object Array]') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
          // Deep compare the contents, ignoring non-numeric properties.
          while (size--) {
            // Ensure commutative equality for sparse arrays.
            if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
          }
        }
      } else {
        // Objects with different constructors are not equivalent.
        if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
        // Deep compare objects.
        for (var key in a) {
          if (_.has(a, key)) {
            // Count the expected number of properties.
            size++;
            // Deep compare each member.
            if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
          }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
          for (key in b) {
            if (_.has(b, key) && !(size--)) break;
          }
          result = !size;
        }
      }
      // Remove the first object from the stack of traversed objects.
      stack.pop();
      return result;
    }
  
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
      return eq(a, b, []);
    };
  
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
      if (obj == null) return true;
      if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
      for (var key in obj) if (_.has(obj, key)) return false;
      return true;
    };
  
    // Is a given value a DOM element?
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType == 1);
    };
  
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) == '[object Array]';
    };
  
    // Is a given variable an object?
    _.isObject = function(obj) {
      return obj === Object(obj);
    };
  
    // Is a given variable an arguments object?
    _.isArguments = function(obj) {
      return toString.call(obj) == '[object Arguments]';
    };
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return !!(obj && _.has(obj, 'callee'));
      };
    }
  
    // Is a given value a function?
    _.isFunction = function(obj) {
      return toString.call(obj) == '[object Function]';
    };
  
    // Is a given value a string?
    _.isString = function(obj) {
      return toString.call(obj) == '[object String]';
    };
  
    // Is a given value a number?
    _.isNumber = function(obj) {
      return toString.call(obj) == '[object Number]';
    };
  
    // Is a given object a finite number?
    _.isFinite = function(obj) {
      return _.isNumber(obj) && isFinite(obj);
    };
  
    // Is the given value `NaN`?
    _.isNaN = function(obj) {
      // `NaN` is the only value for which `===` is not reflexive.
      return obj !== obj;
    };
  
    // Is a given value a boolean?
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };
  
    // Is a given value a date?
    _.isDate = function(obj) {
      return toString.call(obj) == '[object Date]';
    };
  
    // Is the given value a regular expression?
    _.isRegExp = function(obj) {
      return toString.call(obj) == '[object RegExp]';
    };
  
    // Is a given value equal to null?
    _.isNull = function(obj) {
      return obj === null;
    };
  
    // Is a given variable undefined?
    _.isUndefined = function(obj) {
      return obj === void 0;
    };
  
    // Has own property?
    _.has = function(obj, key) {
      return hasOwnProperty.call(obj, key);
    };
  
    // Utility Functions
    // -----------------
  
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };
  
    // Keep the identity function around for default iterators.
    _.identity = function(value) {
      return value;
    };
  
    // Run a function **n** times.
    _.times = function (n, iterator, context) {
      for (var i = 0; i < n; i++) iterator.call(context, i);
    };
  
    // Escape a string for HTML interpolation.
    _.escape = function(string) {
      return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
    };
  
    // If the value of the named property is a function then invoke it;
    // otherwise, return it.
    _.result = function(object, property) {
      if (object == null) return null;
      var value = object[property];
      return _.isFunction(value) ? value.call(object) : value;
    };
  
    // Add your own custom functions to the Underscore object, ensuring that
    // they're correctly added to the OOP wrapper as well.
    _.mixin = function(obj) {
      each(_.functions(obj), function(name){
        addToWrapper(name, _[name] = obj[name]);
      });
    };
  
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = idCounter++;
      return prefix ? prefix + id : id;
    };
  
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate    : /<%([\s\S]+?)%>/g,
      interpolate : /<%=([\s\S]+?)%>/g,
      escape      : /<%-([\s\S]+?)%>/g
    };
  
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /.^/;
  
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      '\\': '\\',
      "'": "'",
      'r': '\r',
      'n': '\n',
      't': '\t',
      'u2028': '\u2028',
      'u2029': '\u2029'
    };
  
    for (var p in escapes) escapes[escapes[p]] = p;
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;
  
    // Within an interpolation, evaluation, or escaping, remove HTML escaping
    // that had been previously added.
    var unescape = function(code) {
      return code.replace(unescaper, function(match, escape) {
        return escapes[escape];
      });
    };
  
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function(text, data, settings) {
      settings = _.defaults(settings || {}, _.templateSettings);
  
      // Compile the template source, taking care to escape characters that
      // cannot be included in a string literal and then unescape them in code
      // blocks.
      var source = "__p+='" + text
        .replace(escaper, function(match) {
          return '\\' + escapes[match];
        })
        .replace(settings.escape || noMatch, function(match, code) {
          return "'+\n_.escape(" + unescape(code) + ")+\n'";
        })
        .replace(settings.interpolate || noMatch, function(match, code) {
          return "'+\n(" + unescape(code) + ")+\n'";
        })
        .replace(settings.evaluate || noMatch, function(match, code) {
          return "';\n" + unescape(code) + "\n;__p+='";
        }) + "';\n";
  
      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
  
      source = "var __p='';" +
        "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
        source + "return __p;\n";
  
      var render = new Function(settings.variable || 'obj', '_', source);
      if (data) return render(data, _);
      var template = function(data) {
        return render.call(this, data, _);
      };
  
      // Provide the compiled function source as a convenience for build time
      // precompilation.
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
        source + '}';
  
      return template;
    };
  
    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function(obj) {
      return _(obj).chain();
    };
  
    // The OOP Wrapper
    // ---------------
  
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
    var wrapper = function(obj) { this._wrapped = obj; };
  
    // Expose `wrapper.prototype` as `_.prototype`
    _.prototype = wrapper.prototype;
  
    // Helper function to continue chaining intermediate results.
    var result = function(obj, chain) {
      return chain ? _(obj).chain() : obj;
    };
  
    // A method to easily add functions to the OOP wrapper.
    var addToWrapper = function(name, func) {
      wrapper.prototype[name] = function() {
        var args = slice.call(arguments);
        unshift.call(args, this._wrapped);
        return result(func.apply(_, args), this._chain);
      };
    };
  
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
  
    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      wrapper.prototype[name] = function() {
        var wrapped = this._wrapped;
        method.apply(wrapped, arguments);
        var length = wrapped.length;
        if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
        return result(wrapped, this._chain);
      };
    });
  
    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      wrapper.prototype[name] = function() {
        return result(method.apply(this._wrapped, arguments), this._chain);
      };
    });
  
    // Start chaining a wrapped Underscore object.
    wrapper.prototype.chain = function() {
      this._chain = true;
      return this;
    };
  
    // Extracts the result from a wrapped and chained object.
    wrapper.prototype.value = function() {
      return this._wrapped;
    };
  
  }).call(this);
  

  provide("underscore", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * bean.js - copyright Jacob Thornton 2011
    * https://github.com/fat/bean
    * MIT License
    * special thanks to:
    * dean edwards: http://dean.edwards.name/
    * dperini: https://github.com/dperini/nwevents
    * the entire mootools team: github.com/mootools/mootools-core
    */
  !function (name, context, definition) {
    if (typeof module !== 'undefined') module.exports = definition(name, context);
    else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition);
    else context[name] = definition(name, context);
  }('bean', this, function (name, context) {
    var win = window
      , old = context[name]
      , overOut = /over|out/
      , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
      , nameRegex = /\..*/
      , addEvent = 'addEventListener'
      , attachEvent = 'attachEvent'
      , removeEvent = 'removeEventListener'
      , detachEvent = 'detachEvent'
      , ownerDocument = 'ownerDocument'
      , targetS = 'target'
      , qSA = 'querySelectorAll'
      , doc = document || {}
      , root = doc.documentElement || {}
      , W3C_MODEL = root[addEvent]
      , eventSupport = W3C_MODEL ? addEvent : attachEvent
      , slice = Array.prototype.slice
      , mouseTypeRegex = /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
      , mouseWheelTypeRegex = /mouse.*(wheel|scroll)/i
      , textTypeRegex = /^text/i
      , touchTypeRegex = /^touch|^gesture/i
      , ONE = {} // singleton for quick matching making add() do one()
  
      , nativeEvents = (function (hash, events, i) {
          for (i = 0; i < events.length; i++)
            hash[events[i]] = 1
          return hash
        }({}, (
            'click dblclick mouseup mousedown contextmenu ' +                  // mouse buttons
            'mousewheel mousemultiwheel DOMMouseScroll ' +                     // mouse wheel
            'mouseover mouseout mousemove selectstart selectend ' +            // mouse movement
            'keydown keypress keyup ' +                                        // keyboard
            'orientationchange ' +                                             // mobile
            'focus blur change reset select submit ' +                         // form elements
            'load unload beforeunload resize move DOMContentLoaded '+          // window
            'readystatechange message ' +                                      // window
            'error abort scroll ' +                                            // misc
            (W3C_MODEL ? // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
                         // that doesn't actually exist, so make sure we only do these on newer browsers
              'show ' +                                                          // mouse buttons
              'input invalid ' +                                                 // form elements
              'touchstart touchmove touchend touchcancel ' +                     // touch
              'gesturestart gesturechange gestureend ' +                         // gesture
              'readystatechange pageshow pagehide popstate ' +                   // window
              'hashchange offline online ' +                                     // window
              'afterprint beforeprint ' +                                        // printing
              'dragstart dragenter dragover dragleave drag drop dragend ' +      // dnd
              'loadstart progress suspend emptied stalled loadmetadata ' +       // media
              'loadeddata canplay canplaythrough playing waiting seeking ' +     // media
              'seeked ended durationchange timeupdate play pause ratechange ' +  // media
              'volumechange cuechange ' +                                        // media
              'checking noupdate downloading cached updateready obsolete ' +     // appcache
              '' : '')
          ).split(' ')
        ))
  
      , customEvents = (function () {
          var cdp = 'compareDocumentPosition'
            , isAncestor = cdp in root
                ? function (element, container) {
                    return container[cdp] && (container[cdp](element) & 16) === 16
                  }
                : 'contains' in root
                  ? function (element, container) {
                      container = container.nodeType === 9 || container === window ? root : container
                      return container !== element && container.contains(element)
                    }
                  : function (element, container) {
                      while (element = element.parentNode) if (element === container) return 1
                      return 0
                    }
  
          function check(event) {
            var related = event.relatedTarget
            return !related
              ? related === null
              : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString()) && !isAncestor(related, this))
          }
  
          return {
              mouseenter: { base: 'mouseover', condition: check }
            , mouseleave: { base: 'mouseout', condition: check }
            , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
          }
        }())
  
      , fixEvent = (function () {
          var commonProps = 'altKey attrChange attrName bubbles cancelable ctrlKey currentTarget detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey srcElement target timeStamp type view which'.split(' ')
            , mouseProps = commonProps.concat('button buttons clientX clientY dataTransfer fromElement offsetX offsetY pageX pageY screenX screenY toElement'.split(' '))
            , mouseWheelProps = mouseProps.concat('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ axis'.split(' ')) // 'axis' is FF specific
            , keyProps = commonProps.concat('char charCode key keyCode keyIdentifier keyLocation'.split(' '))
            , textProps = commonProps.concat(['data'])
            , touchProps = commonProps.concat('touches targetTouches changedTouches scale rotation'.split(' '))
            , messageProps = commonProps.concat(['data', 'origin', 'source'])
            , preventDefault = 'preventDefault'
            , createPreventDefault = function (event) {
                return function () {
                  if (event[preventDefault])
                    event[preventDefault]()
                  else
                    event.returnValue = false
                }
              }
            , stopPropagation = 'stopPropagation'
            , createStopPropagation = function (event) {
                return function () {
                  if (event[stopPropagation])
                    event[stopPropagation]()
                  else
                    event.cancelBubble = true
                }
              }
            , createStop = function (synEvent) {
                return function () {
                  synEvent[preventDefault]()
                  synEvent[stopPropagation]()
                  synEvent.stopped = true
                }
              }
            , copyProps = function (event, result, props) {
                var i, p
                for (i = props.length; i--;) {
                  p = props[i]
                  if (!(p in result) && p in event) result[p] = event[p]
                }
              }
  
          return function (event, isNative) {
            var result = { originalEvent: event, isNative: isNative }
            if (!event)
              return result
  
            var props
              , type = event.type
              , target = event[targetS] || event.srcElement
  
            result[preventDefault] = createPreventDefault(event)
            result[stopPropagation] = createStopPropagation(event)
            result.stop = createStop(result)
            result[targetS] = target && target.nodeType === 3 ? target.parentNode : target
  
            if (isNative) { // we only need basic augmentation on custom events, the rest is too expensive
              if (type.indexOf('key') !== -1) {
                props = keyProps
                result.keyCode = event.keyCode || event.which
              } else if (mouseTypeRegex.test(type)) {
                props = mouseProps
                result.rightClick = event.which === 3 || event.button === 2
                result.pos = { x: 0, y: 0 }
                if (event.pageX || event.pageY) {
                  result.clientX = event.pageX
                  result.clientY = event.pageY
                } else if (event.clientX || event.clientY) {
                  result.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                  result.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                }
                if (overOut.test(type))
                  result.relatedTarget = event.relatedTarget || event[(type === 'mouseover' ? 'from' : 'to') + 'Element']
              } else if (touchTypeRegex.test(type)) {
                props = touchProps
              } else if (mouseWheelTypeRegex.test(type)) {
                props = mouseWheelProps
              } else if (textTypeRegex.test(type)) {
                props = textProps
              } else if (type === 'message') {
                props = messageProps
              }
              copyProps(event, result, props || commonProps)
            }
            return result
          }
        }())
  
        // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
      , targetElement = function (element, isNative) {
          return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
        }
  
        // we use one of these per listener, of any type
      , RegEntry = (function () {
          function entry(element, type, handler, original, namespaces) {
            var isNative = this.isNative = nativeEvents[type] && element[eventSupport]
            this.element = element
            this.type = type
            this.handler = handler
            this.original = original
            this.namespaces = namespaces
            this.custom = customEvents[type]
            this.eventType = W3C_MODEL || isNative ? type : 'propertychange'
            this.customType = !W3C_MODEL && !isNative && type
            this[targetS] = targetElement(element, isNative)
            this[eventSupport] = this[targetS][eventSupport]
          }
  
          entry.prototype = {
              // given a list of namespaces, is our entry in any of them?
              inNamespaces: function (checkNamespaces) {
                var i, j
                if (!checkNamespaces)
                  return true
                if (!this.namespaces)
                  return false
                for (i = checkNamespaces.length; i--;) {
                  for (j = this.namespaces.length; j--;) {
                    if (checkNamespaces[i] === this.namespaces[j])
                      return true
                  }
                }
                return false
              }
  
              // match by element, original fn (opt), handler fn (opt)
            , matches: function (checkElement, checkOriginal, checkHandler) {
                return this.element === checkElement &&
                  (!checkOriginal || this.original === checkOriginal) &&
                  (!checkHandler || this.handler === checkHandler)
              }
          }
  
          return entry
        }())
  
      , registry = (function () {
          // our map stores arrays by event type, just because it's better than storing
          // everything in a single array. uses '$' as a prefix for the keys for safety
          var map = {}
  
            // generic functional search of our registry for matching listeners,
            // `fn` returns false to break out of the loop
            , forAll = function (element, type, original, handler, fn) {
                if (!type || type === '*') {
                  // search the whole registry
                  for (var t in map) {
                    if (t.charAt(0) === '$')
                      forAll(element, t.substr(1), original, handler, fn)
                  }
                } else {
                  var i = 0, l, list = map['$' + type], all = element === '*'
                  if (!list)
                    return
                  for (l = list.length; i < l; i++) {
                    if (all || list[i].matches(element, original, handler))
                      if (!fn(list[i], list, i, type))
                        return
                  }
                }
              }
  
            , has = function (element, type, original) {
                // we're not using forAll here simply because it's a bit slower and this
                // needs to be fast
                var i, list = map['$' + type]
                if (list) {
                  for (i = list.length; i--;) {
                    if (list[i].matches(element, original, null))
                      return true
                  }
                }
                return false
              }
  
            , get = function (element, type, original) {
                var entries = []
                forAll(element, type, original, null, function (entry) { return entries.push(entry) })
                return entries
              }
  
            , put = function (entry) {
                (map['$' + entry.type] || (map['$' + entry.type] = [])).push(entry)
                return entry
              }
  
            , del = function (entry) {
                forAll(entry.element, entry.type, null, entry.handler, function (entry, list, i) {
                  list.splice(i, 1)
                  if (list.length === 0)
                    delete map['$' + entry.type]
                  return false
                })
              }
  
              // dump all entries, used for onunload
            , entries = function () {
                var t, entries = []
                for (t in map) {
                  if (t.charAt(0) === '$')
                    entries = entries.concat(map[t])
                }
                return entries
              }
  
          return { has: has, get: get, put: put, del: del, entries: entries }
        }())
  
      , selectorEngine = doc[qSA]
          ? function (s, r) {
              return r[qSA](s)
            }
          : function () {
              throw new Error('Bean: No selector engine installed') // eeek
            }
  
      , setSelectorEngine = function (e) {
          selectorEngine = e
        }
  
        // add and remove listeners to DOM elements
      , listener = W3C_MODEL ? function (element, type, fn, add) {
          element[add ? addEvent : removeEvent](type, fn, false)
        } : function (element, type, fn, add, custom) {
          if (custom && add && element['_on' + custom] === null)
            element['_on' + custom] = 0
          element[add ? attachEvent : detachEvent]('on' + type, fn)
        }
  
      , nativeHandler = function (element, fn, args) {
          var beanDel = fn.__beanDel
            , handler = function (event) {
            event = fixEvent(event || ((this[ownerDocument] || this.document || this).parentWindow || win).event, true)
            if (beanDel) // delegated event, fix the fix
              event.currentTarget = beanDel.ft(event[targetS], element)
            return fn.apply(element, [event].concat(args))
          }
          handler.__beanDel = beanDel
          return handler
        }
  
      , customHandler = function (element, fn, type, condition, args, isNative) {
          var beanDel = fn.__beanDel
            , handler = function (event) {
            var target = beanDel ? beanDel.ft(event[targetS], element) : this // deleated event
            if (condition ? condition.apply(target, arguments) : W3C_MODEL ? true : event && event.propertyName === '_on' + type || !event) {
              if (event) {
                event = fixEvent(event || ((this[ownerDocument] || this.document || this).parentWindow || win).event, isNative)
                event.currentTarget = target
              }
              fn.apply(element, event && (!args || args.length === 0) ? arguments : slice.call(arguments, event ? 0 : 1).concat(args))
            }
          }
          handler.__beanDel = beanDel
          return handler
        }
  
      , once = function (rm, element, type, fn, originalFn) {
          // wrap the handler in a handler that does a remove as well
          return function () {
            rm(element, type, originalFn)
            fn.apply(this, arguments)
          }
        }
  
      , removeListener = function (element, orgType, handler, namespaces) {
          var i, l, entry
            , type = (orgType && orgType.replace(nameRegex, ''))
            , handlers = registry.get(element, type, handler)
  
          for (i = 0, l = handlers.length; i < l; i++) {
            if (handlers[i].inNamespaces(namespaces)) {
              if ((entry = handlers[i])[eventSupport])
                listener(entry[targetS], entry.eventType, entry.handler, false, entry.type)
              // TODO: this is problematic, we have a registry.get() and registry.del() that
              // both do registry searches so we waste cycles doing this. Needs to be rolled into
              // a single registry.forAll(fn) that removes while finding, but the catch is that
              // we'll be splicing the arrays that we're iterating over. Needs extra tests to
              // make sure we don't screw it up. @rvagg
              registry.del(entry)
            }
          }
        }
  
      , addListener = function (element, orgType, fn, originalFn, args) {
          var entry
            , type = orgType.replace(nameRegex, '')
            , namespaces = orgType.replace(namespaceRegex, '').split('.')
  
          if (registry.has(element, type, fn))
            return element // no dupe
          if (type === 'unload')
            fn = once(removeListener, element, type, fn, originalFn) // self clean-up
          if (customEvents[type]) {
            if (customEvents[type].condition)
              fn = customHandler(element, fn, type, customEvents[type].condition, args, true)
            type = customEvents[type].base || type
          }
          entry = registry.put(new RegEntry(element, type, fn, originalFn, namespaces[0] && namespaces))
          entry.handler = entry.isNative ?
            nativeHandler(element, entry.handler, args) :
            customHandler(element, entry.handler, type, false, args, false)
          if (entry[eventSupport])
            listener(entry[targetS], entry.eventType, entry.handler, true, entry.customType)
        }
  
      , del = function (selector, fn, $) {
              //TODO: findTarget (therefore $) is called twice, once for match and once for
              // setting e.currentTarget, fix this so it's only needed once
          var findTarget = function (target, root) {
                var i, array = typeof selector === 'string' ? $(selector, root) : selector
                for (; target && target !== root; target = target.parentNode) {
                  for (i = array.length; i--;) {
                    if (array[i] === target)
                      return target
                  }
                }
              }
            , handler = function (e) {
                var match = findTarget(e[targetS], this)
                match && fn.apply(match, arguments)
              }
  
          handler.__beanDel = {
              ft: findTarget // attach it here for customEvents to use too
            , selector: selector
            , $: $
          }
          return handler
        }
  
      , remove = function (element, typeSpec, fn) {
          var k, type, namespaces, i
            , rm = removeListener
            , isString = typeSpec && typeof typeSpec === 'string'
  
          if (isString && typeSpec.indexOf(' ') > 0) {
            // remove(el, 't1 t2 t3', fn) or remove(el, 't1 t2 t3')
            typeSpec = typeSpec.split(' ')
            for (i = typeSpec.length; i--;)
              remove(element, typeSpec[i], fn)
            return element
          }
          type = isString && typeSpec.replace(nameRegex, '')
          if (type && customEvents[type])
            type = customEvents[type].type
          if (!typeSpec || isString) {
            // remove(el) or remove(el, t1.ns) or remove(el, .ns) or remove(el, .ns1.ns2.ns3)
            if (namespaces = isString && typeSpec.replace(namespaceRegex, ''))
              namespaces = namespaces.split('.')
            rm(element, type, fn, namespaces)
          } else if (typeof typeSpec === 'function') {
            // remove(el, fn)
            rm(element, null, typeSpec)
          } else {
            // remove(el, { t1: fn1, t2, fn2 })
            for (k in typeSpec) {
              if (typeSpec.hasOwnProperty(k))
                remove(element, k, typeSpec[k])
            }
          }
          return element
        }
  
        // 5th argument, $=selector engine, is deprecated and will be removed
      , add = function (element, events, fn, delfn, $) {
          var type, types, i, args
            , originalFn = fn
            , isDel = fn && typeof fn === 'string'
  
          if (events && !fn && typeof events === 'object') {
            for (type in events) {
              if (events.hasOwnProperty(type))
                add.apply(this, [ element, type, events[type] ])
            }
          } else {
            args = arguments.length > 3 ? slice.call(arguments, 3) : []
            types = (isDel ? fn : events).split(' ')
            isDel && (fn = del(events, (originalFn = delfn), $ || selectorEngine)) && (args = slice.call(args, 1))
            // special case for one()
            this === ONE && (fn = once(remove, element, events, fn, originalFn))
            for (i = types.length; i--;) addListener(element, types[i], fn, originalFn, args)
          }
          return element
        }
  
      , one = function () {
          return add.apply(ONE, arguments)
        }
  
      , fireListener = W3C_MODEL ? function (isNative, type, element) {
          var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
          evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
          element.dispatchEvent(evt)
        } : function (isNative, type, element) {
          element = targetElement(element, isNative)
          // if not-native then we're using onpropertychange so we just increment a custom property
          isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
        }
  
      , fire = function (element, type, args) {
          var i, j, l, names, handlers
            , types = type.split(' ')
  
          for (i = types.length; i--;) {
            type = types[i].replace(nameRegex, '')
            if (names = types[i].replace(namespaceRegex, ''))
              names = names.split('.')
            if (!names && !args && element[eventSupport]) {
              fireListener(nativeEvents[type], type, element)
            } else {
              // non-native event, either because of a namespace, arguments or a non DOM element
              // iterate over all listeners and manually 'fire'
              handlers = registry.get(element, type)
              args = [false].concat(args)
              for (j = 0, l = handlers.length; j < l; j++) {
                if (handlers[j].inNamespaces(names))
                  handlers[j].handler.apply(element, args)
              }
            }
          }
          return element
        }
  
      , clone = function (element, from, type) {
          var i = 0
            , handlers = registry.get(from, type)
            , l = handlers.length
            , args, beanDel
  
          for (;i < l; i++) {
            if (handlers[i].original) {
              beanDel = handlers[i].handler.__beanDel
              if (beanDel) {
                args = [ element, beanDel.selector, handlers[i].type, handlers[i].original, beanDel.$]
              } else
                args = [ element, handlers[i].type, handlers[i].original ]
              add.apply(null, args)
            }
          }
          return element
        }
  
      , bean = {
            add: add
          , one: one
          , remove: remove
          , clone: clone
          , fire: fire
          , setSelectorEngine: setSelectorEngine
          , noConflict: function () {
              context[name] = old
              return this
            }
        }
  
    if (win[attachEvent]) {
      // for IE, clean up on unload to avoid leaks
      var cleanup = function () {
        var i, entries = registry.entries()
        for (i in entries) {
          if (entries[i].type && entries[i].type !== 'unload')
            remove(entries[i].element, entries[i].type)
        }
        win[detachEvent]('onunload', cleanup)
        win.CollectGarbage && win.CollectGarbage()
      }
      win[attachEvent]('onunload', cleanup)
    }
  
    return bean
  })
  

  provide("bean", module.exports);

  !function ($) {
    var b = require('bean')
      , integrate = function (method, type, method2) {
          var _args = type ? [type] : []
          return function () {
            for (var i = 0, l = this.length; i < l; i++) {
              if (!arguments.length && method == 'add' && type) method = 'fire'
              b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
            }
            return this
          }
        }
      , add = integrate('add')
      , remove = integrate('remove')
      , fire = integrate('fire')
  
      , methods = {
            on: add // NOTE: .on() is likely to change in the near future, don't rely on this as-is see https://github.com/fat/bean/issues/55
          , addListener: add
          , bind: add
          , listen: add
          , delegate: add
  
          , one: integrate('one')
  
          , off: remove
          , unbind: remove
          , unlisten: remove
          , removeListener: remove
          , undelegate: remove
  
          , emit: fire
          , trigger: fire
  
          , cloneEvents: integrate('clone')
  
          , hover: function (enter, leave, i) { // i for internal
              for (i = this.length; i--;) {
                b.add.call(this, this[i], 'mouseenter', enter)
                b.add.call(this, this[i], 'mouseleave', leave)
              }
              return this
            }
        }
  
      , shortcuts =
           ('blur change click dblclick error focus focusin focusout keydown keypress '
          + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
          + 'mousemove resize scroll select submit unload').split(' ')
  
    for (var i = shortcuts.length; i--;) {
      methods[shortcuts[i]] = integrate('add', shortcuts[i])
    }
  
    b.setSelectorEngine($)
  
    $.ender(methods, true)
  }(ender)
  

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()
  }('domready', function (ready) {
  
    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , readyState = 'readyState'
      , loaded = /^loade|c/.test(doc[readyState])
  
    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }
  
    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)
  
  
    hack && doc.attachEvent(onreadystatechange, fn = function () {
      if (/^c/.test(doc[readyState])) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    })
  
    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  })

  provide("domready", module.exports);

  !function ($) {
    var ready = require('domready')
    $.ender({domReady: ready})
    $.ender({
      ready: function (f) {
        ready(f)
        return this
      }
    }, true)
  }(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Qwery - A Blazing Fast query selector engine
    * https://github.com/ded/qwery
    * copyright Dustin Diaz & Jacob Thornton 2012
    * MIT License
    */
  
  (function (name, definition, context) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof context['define'] != 'undefined' && context['define'] == 'function' && context['define']['amd']) define(name, definition)
    else context[name] = definition()
  })('qwery', function () {
    var doc = document
      , html = doc.documentElement
      , byClass = 'getElementsByClassName'
      , byTag = 'getElementsByTagName'
      , qSA = 'querySelectorAll'
      , useNativeQSA = 'useNativeQSA'
      , tagName = 'tagName'
      , nodeType = 'nodeType'
      , select // main select() method, assign later
  
      // OOOOOOOOOOOOH HERE COME THE ESSSXXSSPRESSSIONSSSSSSSS!!!!!
      , id = /#([\w\-]+)/
      , clas = /\.[\w\-]+/g
      , idOnly = /^#([\w\-]+)$/
      , classOnly = /^\.([\w\-]+)$/
      , tagOnly = /^([\w\-]+)$/
      , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
      , splittable = /(^|,)\s*[>~+]/
      , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
      , splitters = /[\s\>\+\~]/
      , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
      , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
      , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
      , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
      , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
      , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
      , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
      , tokenizr = new RegExp(splitters.source + splittersMore.source)
      , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')
      , walker = {
          ' ': function (node) {
            return node && node !== html && node.parentNode
          }
        , '>': function (node, contestant) {
            return node && node.parentNode == contestant.parentNode && node.parentNode
          }
        , '~': function (node) {
            return node && node.previousSibling
          }
        , '+': function (node, contestant, p1, p2) {
            if (!node) return false
            return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
          }
        }
  
    function cache() {
      this.c = {}
    }
    cache.prototype = {
      g: function (k) {
        return this.c[k] || undefined
      }
    , s: function (k, v, r) {
        v = r ? new RegExp(v) : v
        return (this.c[k] = v)
      }
    }
  
    var classCache = new cache()
      , cleanCache = new cache()
      , attrCache = new cache()
      , tokenCache = new cache()
  
    function classRegex(c) {
      return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
    }
  
    // not quite as fast as inline loops in older browsers so don't use liberally
    function each(a, fn) {
      var i = 0, l = a.length
      for (; i < l; i++) fn(a[i])
    }
  
    function flatten(ar) {
      for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
      return r
    }
  
    function arrayify(ar) {
      var i = 0, l = ar.length, r = []
      for (; i < l; i++) r[i] = ar[i]
      return r
    }
  
    function previous(n) {
      while (n = n.previousSibling) if (n[nodeType] == 1) break;
      return n
    }
  
    function q(query) {
      return query.match(chunker)
    }
  
    // called using `this` as element and arguments from regex group results.
    // given => div.hello[title="world"]:foo('bar')
    // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
    function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
      var i, m, k, o, classes
      if (this[nodeType] !== 1) return false
      if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
      if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
      if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
        for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
      }
      if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
      if (wholeAttribute && !value) { // select is just for existance of attrib
        o = this.attributes
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
            return this
          }
        }
      }
      if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
        // select is for attrib equality
        return false
      }
      return this
    }
  
    function clean(s) {
      return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
    }
  
    function checkAttr(qualify, actual, val) {
      switch (qualify) {
      case '=':
        return actual == val
      case '^=':
        return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
      case '$=':
        return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
      case '*=':
        return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
      case '~=':
        return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
      case '|=':
        return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
      }
      return 0
    }
  
    // given a selector, first check for simple cases then collect all base candidate matches and filter
    function _qwery(selector, _root) {
      var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
        , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        , dividedTokens = selector.match(dividers)
  
      if (!tokens.length) return r
  
      token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
      if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
      if (!root) return r
  
      intr = q(token)
      // collect base candidates to filter
      els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
        function (r) {
          while (root = root.nextSibling) {
            root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
          }
          return r
        }([]) :
        root[byTag](intr[1] || '*')
      // filter elements according to the right-most part of the selector
      for (i = 0, l = els.length; i < l; i++) {
        if (item = interpret.apply(els[i], intr)) r[r.length] = item
      }
      if (!tokens.length) return r
  
      // filter further according to the rest of the selector (the left side)
      each(r, function(e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
      return ret
    }
  
    // compare element to a selector
    function is(el, selector, root) {
      if (isNode(selector)) return el == selector
      if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?
  
      var selectors = selector.split(','), tokens, dividedTokens
      while (selector = selectors.pop()) {
        tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        dividedTokens = selector.match(dividers)
        tokens = tokens.slice(0) // copy array
        if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
          return true
        }
      }
      return false
    }
  
    // given elements matching the right-most part of a selector, filter out any that don't match the rest
    function ancestorMatch(el, tokens, dividedTokens, root) {
      var cand
      // recursively work backwards through the tokens and up the dom, covering all options
      function crawl(e, i, p) {
        while (p = walker[dividedTokens[i]](p, e)) {
          if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
            if (i) {
              if (cand = crawl(p, i - 1, p)) return cand
            } else return p
          }
        }
      }
      return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
    }
  
    function isNode(el, t) {
      return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
    }
  
    function uniq(ar) {
      var a = [], i, j
      o: for (i = 0; i < ar.length; ++i) {
        for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
        a[a.length] = ar[i]
      }
      return a
    }
  
    function arrayLike(o) {
      return (typeof o === 'object' && isFinite(o.length))
    }
  
    function normalizeRoot(root) {
      if (!root) return doc
      if (typeof root == 'string') return qwery(root)[0]
      if (!root[nodeType] && arrayLike(root)) return root[0]
      return root
    }
  
    function byId(root, id, el) {
      // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
      return root[nodeType] === 9 ? root.getElementById(id) :
        root.ownerDocument &&
          (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
            (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
    }
  
    function qwery(selector, _root) {
      var m, el, root = normalizeRoot(_root)
  
      // easy, fast cases that we can dispatch with simple DOM calls
      if (!root || !selector) return []
      if (selector === window || isNode(selector)) {
        return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
      }
      if (selector && arrayLike(selector)) return flatten(selector)
      if (m = selector.match(easy)) {
        if (m[1]) return (el = byId(root, m[1])) ? [el] : []
        if (m[2]) return arrayify(root[byTag](m[2]))
        if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
      }
  
      return select(selector, root)
    }
  
    // where the root is not document and a relationship selector is first we have to
    // do some awkward adjustments to get it to work, even with qSA
    function collectSelector(root, collector) {
      return function(s) {
        var oid, nid
        if (splittable.test(s)) {
          if (root[nodeType] !== 9) {
           // make sure the el has an id, rewrite the query, set root to doc and run it
           if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
           s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
           collector(root.parentNode || root, s, true)
           oid || root.removeAttribute('id')
          }
          return;
        }
        s.length && collector(root, s, false)
      }
    }
  
    var isAncestor = 'compareDocumentPosition' in html ?
      function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (element, container) {
        container = container[nodeType] === 9 || container == window ? html : container
        return container !== element && container.contains(element)
      } :
      function (element, container) {
        while (element = element.parentNode) if (element === container) return 1
        return 0
      }
    , getAttr = function() {
        // detect buggy IE src/href getAttribute() call
        var e = doc.createElement('p')
        return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
          function(e, a) {
            return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
              e.getAttribute(a, 2) : e.getAttribute(a)
          } :
          function(e, a) { return e.getAttribute(a) }
     }()
    , hasByClass = !!doc[byClass]
      // has native qSA support
    , hasQSA = doc.querySelector && doc[qSA]
      // use native qSA
    , selectQSA = function (selector, root) {
        var result = [], ss, e
        try {
          if (root[nodeType] === 9 || !splittable.test(selector)) {
            // most work is done right here, defer to qSA
            return arrayify(root[qSA](selector))
          }
          // special case where we need the services of `collectSelector()`
          each(ss = selector.split(','), collectSelector(root, function(ctx, s) {
            e = ctx[qSA](s)
            if (e.length == 1) result[result.length] = e.item(0)
            else if (e.length) result = result.concat(arrayify(e))
          }))
          return ss.length > 1 && result.length > 1 ? uniq(result) : result
        } catch(ex) { }
        return selectNonNative(selector, root)
      }
      // no native selector support
    , selectNonNative = function (selector, root) {
        var result = [], items, m, i, l, r, ss
        selector = selector.replace(normalizr, '$1')
        if (m = selector.match(tagAndOrClass)) {
          r = classRegex(m[2])
          items = root[byTag](m[1] || '*')
          for (i = 0, l = items.length; i < l; i++) {
            if (r.test(items[i].className)) result[result.length] = items[i]
          }
          return result
        }
        // more complex selector, get `_qwery()` to do the work for us
        each(ss = selector.split(','), collectSelector(root, function(ctx, s, rewrite) {
          r = _qwery(s, ctx)
          for (i = 0, l = r.length; i < l; i++) {
            if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
          }
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      }
    , configure = function (options) {
        // configNativeQSA: use fully-internal selector or native qSA where present
        if (typeof options[useNativeQSA] !== 'undefined')
          select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
      }
  
    configure({ useNativeQSA: true })
  
    qwery.configure = configure
    qwery.uniq = uniq
    qwery.is = is
    qwery.pseudos = {}
  
    return qwery
  }, this);
  

  provide("qwery", module.exports);

  (function ($) {
    var q = function (r) {
      try {
        r = require('qwery')
      } catch (ex) {
        r = require('qwery-mobile')
      } finally {
        return r
      }
    }()
  
    $.pseudos = q.pseudos
  
    $._select = function (s, r) {
      // detect if sibling module 'bonzo' is available at run-time
      // rather than load-time since technically it's not a dependency and
      // can be loaded in any order
      // hence the lazy function re-definition
      return ($._select = (function (b) {
        try {
          b = require('bonzo')
          return function (s, r) {
            return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
          }
        } catch (e) { }
        return q
      })())(s, r)
    }
  
    $.ender({
        find: function (s) {
          var r = [], i, l, j, k, els
          for (i = 0, l = this.length; i < l; i++) {
            els = q(s, this[i])
            for (j = 0, k = els.length; j < k; j++) r.push(els[j])
          }
          return $(q.uniq(r))
        }
      , and: function (s) {
          var plus = $(s)
          for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
            this[i] = plus[j]
          }
          this.length += plus.length
          return this
        }
      , is: function(s, r) {
          var i, l
          for (i = 0, l = this.length; i < l; i++) {
            if (q.is(this[i], s, r)) {
              return true
            }
          }
          return false
        }
    }, true)
  }(ender));
  

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  // Knockout JavaScript library v2.0.0
  // (c) Steven Sanderson - http://knockoutjs.com/
  // License: MIT (http://www.opensource.org/licenses/mit-license.php)
  
  (function(window,undefined){ 
  var ko = window["ko"] = {};
  // Google Closure Compiler helpers (used only to make the minified file smaller)
  ko.exportSymbol = function(publicPath, object) {
  	var tokens = publicPath.split(".");
  	var target = window;
  	for (var i = 0; i < tokens.length - 1; i++)
  		target = target[tokens[i]];
  	target[tokens[tokens.length - 1]] = object;
  };
  ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
  };
  ko.utils = new (function () {
      var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
      
      // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
      var knownEvents = {}, knownEventTypesByEventName = {};
      var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
      knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
      knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];        
      for (var eventType in knownEvents) {
          var knownEventsForType = knownEvents[eventType];
          if (knownEventsForType.length) {
              for (var i = 0, j = knownEventsForType.length; i < j; i++)
                  knownEventTypesByEventName[knownEventsForType[i]] = eventType;
          }
      }
  
      // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
      var ieVersion = (function() {
          var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');
          
          // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
          while (
              div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
              iElems[0]
          );        
          return version > 4 ? version : undefined;        
      }());
      var isIe6 = ieVersion === 6,
          isIe7 = ieVersion === 7;
  
      function isClickOnCheckableElement(element, eventType) {
          if ((element.tagName != "INPUT") || !element.type) return false;
          if (eventType.toLowerCase() != "click") return false;
          var inputType = element.type.toLowerCase();
          return (inputType == "checkbox") || (inputType == "radio");
      }
      
      return {
          fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],
          
          arrayForEach: function (array, action) {
              for (var i = 0, j = array.length; i < j; i++)
                  action(array[i]);
          },
  
          arrayIndexOf: function (array, item) {
              if (typeof Array.prototype.indexOf == "function")
                  return Array.prototype.indexOf.call(array, item);
              for (var i = 0, j = array.length; i < j; i++)
                  if (array[i] === item)
                      return i;
              return -1;
          },
  
          arrayFirst: function (array, predicate, predicateOwner) {
              for (var i = 0, j = array.length; i < j; i++)
                  if (predicate.call(predicateOwner, array[i]))
                      return array[i];
              return null;
          },
  
          arrayRemoveItem: function (array, itemToRemove) {
              var index = ko.utils.arrayIndexOf(array, itemToRemove);
              if (index >= 0)
                  array.splice(index, 1);
          },
  
          arrayGetDistinctValues: function (array) {
              array = array || [];
              var result = [];
              for (var i = 0, j = array.length; i < j; i++) {
                  if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                      result.push(array[i]);
              }
              return result;
          },        
  
          arrayMap: function (array, mapping) {
              array = array || [];
              var result = [];
              for (var i = 0, j = array.length; i < j; i++)
                  result.push(mapping(array[i]));
              return result;
          },
  
          arrayFilter: function (array, predicate) {
              array = array || [];
              var result = [];
              for (var i = 0, j = array.length; i < j; i++)
                  if (predicate(array[i]))
                      result.push(array[i]);
              return result;
          },
          
          arrayPushAll: function (array, valuesToPush) {
              for (var i = 0, j = valuesToPush.length; i < j; i++)
                  array.push(valuesToPush[i]);	
              return array;
          },
  
          extend: function (target, source) {
              for(var prop in source) {
                  if(source.hasOwnProperty(prop)) {
                      target[prop] = source[prop];
                  }
              }
              return target;
          },
  
          emptyDomNode: function (domNode) {
              while (domNode.firstChild) {
                  ko.removeNode(domNode.firstChild);
              }
          },
  
          setDomNodeChildren: function (domNode, childNodes) {
              ko.utils.emptyDomNode(domNode);
              if (childNodes) {
                  ko.utils.arrayForEach(childNodes, function (childNode) {
                      domNode.appendChild(childNode);
                  });
              }
          },
  
          replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
              var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
              if (nodesToReplaceArray.length > 0) {
                  var insertionPoint = nodesToReplaceArray[0];
                  var parent = insertionPoint.parentNode;
                  for (var i = 0, j = newNodesArray.length; i < j; i++)
                      parent.insertBefore(newNodesArray[i], insertionPoint);
                  for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                      ko.removeNode(nodesToReplaceArray[i]);
                  }
              }
          },
  
          setOptionNodeSelectionState: function (optionNode, isSelected) {
              // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
              if (navigator.userAgent.indexOf("MSIE 6") >= 0)
                  optionNode.setAttribute("selected", isSelected);
              else
                  optionNode.selected = isSelected;
          },
          
          stringTrim: function (string) {
              return (string || "").replace(stringTrimRegex, "");
          },
  
          stringTokenize: function (string, delimiter) {
              var result = [];
              var tokens = (string || "").split(delimiter);
              for (var i = 0, j = tokens.length; i < j; i++) {
                  var trimmed = ko.utils.stringTrim(tokens[i]);
                  if (trimmed !== "")
                      result.push(trimmed);
              }
              return result;
          },
          
          stringStartsWith: function (string, startsWith) {        	
              string = string || "";
              if (startsWith.length > string.length)
                  return false;
              return string.substring(0, startsWith.length) === startsWith;
          },
  
          evalWithinScope: function (expression /*, scope1, scope2, scope3... */) {
              // Build the source for a function that evaluates "expression"
              // For each scope variable, add an extra level of "with" nesting
              // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
              var scopes = Array.prototype.slice.call(arguments, 1);
              var functionBody = "return (" + expression + ")";
              for (var i = 0; i < scopes.length; i++) {
                  if (scopes[i] && typeof scopes[i] == "object")
                      functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
              }
              return (new Function("sc", functionBody))(scopes);
          },
  
          domNodeIsContainedBy: function (node, containedByNode) {
              if (containedByNode.compareDocumentPosition)
                  return (containedByNode.compareDocumentPosition(node) & 16) == 16;
              while (node != null) {
                  if (node == containedByNode)
                      return true;
                  node = node.parentNode;
              }
              return false;
          },
  
          domNodeIsAttachedToDocument: function (node) {
              return ko.utils.domNodeIsContainedBy(node, document);
          },
  
          registerEventHandler: function (element, eventType, handler) {
              if (typeof jQuery != "undefined") {
                  if (isClickOnCheckableElement(element, eventType)) {
                      // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                      // it toggles the element checked state *after* the click event handlers run, whereas native
                      // click events toggle the checked state *before* the event handler. 
                      // Fix this by intecepting the handler and applying the correct checkedness before it runs.            	
                      var originalHandler = handler;
                      handler = function(event, eventData) {
                          var jQuerySuppliedCheckedState = this.checked;
                          if (eventData)
                              this.checked = eventData.checkedStateBeforeEvent !== true;
                          originalHandler.call(this, event);
                          this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                      };                	
                  }
                  jQuery(element)['bind'](eventType, handler);
              } else if (typeof element.addEventListener == "function")
                  element.addEventListener(eventType, handler, false);
              else if (typeof element.attachEvent != "undefined")
                  element.attachEvent("on" + eventType, function (event) {
                      handler.call(element, event);
                  });
              else
                  throw new Error("Browser doesn't support addEventListener or attachEvent");
          },
  
          triggerEvent: function (element, eventType) {
              if (!(element && element.nodeType))
                  throw new Error("element must be a DOM node when calling triggerEvent");
  
              if (typeof jQuery != "undefined") {
                  var eventData = [];
                  if (isClickOnCheckableElement(element, eventType)) {
                      // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                      eventData.push({ checkedStateBeforeEvent: element.checked });
                  }
                  jQuery(element)['trigger'](eventType, eventData);
              } else if (typeof document.createEvent == "function") {
                  if (typeof element.dispatchEvent == "function") {
                      var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                      var event = document.createEvent(eventCategory);
                      event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                      element.dispatchEvent(event);
                  }
                  else
                      throw new Error("The supplied element doesn't support dispatchEvent");
              } else if (typeof element.fireEvent != "undefined") {
                  // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                  // so to make it consistent, we'll do it manually here
                  if (eventType == "click") {
                      if ((element.tagName == "INPUT") && ((element.type.toLowerCase() == "checkbox") || (element.type.toLowerCase() == "radio")))
                          element.checked = element.checked !== true;
                  }
                  element.fireEvent("on" + eventType);
              }
              else
                  throw new Error("Browser doesn't support triggering events");
          },
  
          unwrapObservable: function (value) {
              return ko.isObservable(value) ? value() : value;
          },
  
          domNodeHasCssClass: function (node, className) {
              var currentClassNames = (node.className || "").split(/\s+/);
              return ko.utils.arrayIndexOf(currentClassNames, className) >= 0;
          },
  
          toggleDomNodeCssClass: function (node, className, shouldHaveClass) {
              var hasClass = ko.utils.domNodeHasCssClass(node, className);
              if (shouldHaveClass && !hasClass) {
                  node.className = (node.className || "") + " " + className;
              } else if (hasClass && !shouldHaveClass) {
                  var currentClassNames = (node.className || "").split(/\s+/);
                  var newClassName = "";
                  for (var i = 0; i < currentClassNames.length; i++)
                      if (currentClassNames[i] != className)
                          newClassName += currentClassNames[i] + " ";
                  node.className = ko.utils.stringTrim(newClassName);
              }
          },
  
          outerHTML: function(node) {
              // For Chrome on non-text nodes
              // (Although IE supports outerHTML, the way it formats HTML is inconsistent - sometimes closing </li> tags are omitted, sometimes not. That caused https://github.com/SteveSanderson/knockout/issues/212.)
              if (ieVersion === undefined) {
                  var nativeOuterHtml = node.outerHTML;
                  if (typeof nativeOuterHtml == "string")
                      return nativeOuterHtml;
              }
  
              // Other browsers
              var dummyContainer = window.document.createElement("div");
              dummyContainer.appendChild(node.cloneNode(true));
              return dummyContainer.innerHTML;
          },
  
          setTextContent: function(element, textContent) {
              var value = ko.utils.unwrapObservable(textContent);
              if ((value === null) || (value === undefined))
                  value = "";
  
              'innerText' in element ? element.innerText = value
                                     : element.textContent = value;
                                     
              if (ieVersion >= 9) {
                  // Believe it or not, this actually fixes an IE9 rendering bug. Insane. https://github.com/SteveSanderson/knockout/issues/209
                  element.innerHTML = element.innerHTML;
              }
          },
  
          range: function (min, max) {
              min = ko.utils.unwrapObservable(min);
              max = ko.utils.unwrapObservable(max);
              var result = [];
              for (var i = min; i <= max; i++)
                  result.push(i);
              return result;
          },
          
          makeArray: function(arrayLikeObject) {
              var result = [];
              for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                  result.push(arrayLikeObject[i]);
              };
              return result;
          },
          
          isIe6 : isIe6,
          isIe7 : isIe7,
          
          getFormFields: function(form, fieldName) {
              var fields = ko.utils.makeArray(form.getElementsByTagName("INPUT")).concat(ko.utils.makeArray(form.getElementsByTagName("TEXTAREA")));
              var isMatchingField = (typeof fieldName == 'string') 
                  ? function(field) { return field.name === fieldName }
                  : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
              var matches = [];
              for (var i = fields.length - 1; i >= 0; i--) {
                  if (isMatchingField(fields[i]))
                      matches.push(fields[i]);
              };
              return matches;
          },
          
          parseJson: function (jsonString) {
              if (typeof jsonString == "string") {
                  jsonString = ko.utils.stringTrim(jsonString);
                  if (jsonString) {
                      if (window.JSON && window.JSON.parse) // Use native parsing where available
                          return window.JSON.parse(jsonString);
                      return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                  }
              }	
              return null;
          },
  
          stringifyJson: function (data) {
              if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                  throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
              return JSON.stringify(ko.utils.unwrapObservable(data));
          },
  
          postJson: function (urlOrForm, data, options) {
              options = options || {};
              var params = options['params'] || {};
              var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
              var url = urlOrForm;
              
              // If we were given a form, use its 'action' URL and pick out any requested field values 	
              if((typeof urlOrForm == 'object') && (urlOrForm.tagName == "FORM")) {
                  var originalForm = urlOrForm;
                  url = originalForm.action;
                  for (var i = includeFields.length - 1; i >= 0; i--) {
                      var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                      for (var j = fields.length - 1; j >= 0; j--)        				
                          params[fields[j].name] = fields[j].value;
                  }
              }        	
              
              data = ko.utils.unwrapObservable(data);
              var form = document.createElement("FORM");
              form.style.display = "none";
              form.action = url;
              form.method = "post";
              for (var key in data) {
                  var input = document.createElement("INPUT");
                  input.name = key;
                  input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                  form.appendChild(input);
              }
              for (var key in params) {
                  var input = document.createElement("INPUT");
                  input.name = key;
                  input.value = params[key];
                  form.appendChild(input);
              }            
              document.body.appendChild(form);
              options['submitter'] ? options['submitter'](form) : form.submit();
              setTimeout(function () { form.parentNode.removeChild(form); }, 0);
          }
      }
  })();
  
  ko.exportSymbol('ko.utils', ko.utils);
  ko.utils.arrayForEach([
      ['arrayForEach', ko.utils.arrayForEach],
      ['arrayFirst', ko.utils.arrayFirst],
      ['arrayFilter', ko.utils.arrayFilter],
      ['arrayGetDistinctValues', ko.utils.arrayGetDistinctValues],
      ['arrayIndexOf', ko.utils.arrayIndexOf],
      ['arrayMap', ko.utils.arrayMap],
      ['arrayPushAll', ko.utils.arrayPushAll],
      ['arrayRemoveItem', ko.utils.arrayRemoveItem],
      ['extend', ko.utils.extend],
      ['fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost],
      ['getFormFields', ko.utils.getFormFields],
      ['postJson', ko.utils.postJson],
      ['parseJson', ko.utils.parseJson],
      ['registerEventHandler', ko.utils.registerEventHandler],
      ['stringifyJson', ko.utils.stringifyJson],
      ['range', ko.utils.range],
      ['toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass],
      ['triggerEvent', ko.utils.triggerEvent],
      ['unwrapObservable', ko.utils.unwrapObservable]
  ], function(item) {
      ko.exportSymbol('ko.utils.' + item[0], item[1]);
  });
  
  if (!Function.prototype['bind']) {
      // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
      // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
      Function.prototype['bind'] = function (object) {
          var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
          return function () {
              return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
          }; 
      };
  }
  ko.utils.domData = new (function () {
      var uniqueId = 0;
      var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
      var dataStore = {};
      return {
          get: function (node, key) {
              var allDataForNode = ko.utils.domData.getAll(node, false);
              return allDataForNode === undefined ? undefined : allDataForNode[key];
          },
          set: function (node, key, value) {
              if (value === undefined) {
                  // Make sure we don't actually create a new domData key if we are actually deleting a value
                  if (ko.utils.domData.getAll(node, false) === undefined)
                      return;
              }
              var allDataForNode = ko.utils.domData.getAll(node, true);
              allDataForNode[key] = value;
          },
          getAll: function (node, createIfNotFound) {
              var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
              var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
              if (!hasExistingDataStore) {
                  if (!createIfNotFound)
                      return undefined;
                  dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                  dataStore[dataStoreKey] = {};
              }
              return dataStore[dataStoreKey];
          },
          clear: function (node) {
              var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
              if (dataStoreKey) {
                  delete dataStore[dataStoreKey];
                  node[dataStoreKeyExpandoPropertyName] = null;
              }
          }
      }
  })();
  
  ko.exportSymbol('ko.utils.domData', ko.utils.domData);
  ko.exportSymbol('ko.utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully
  ko.utils.domNodeDisposal = new (function () {
      var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
      
      function getDisposeCallbacksCollection(node, createIfNotFound) {
          var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
          if ((allDisposeCallbacks === undefined) && createIfNotFound) {
              allDisposeCallbacks = [];
              ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
          }
          return allDisposeCallbacks;
      }
      function destroyCallbacksCollection(node) {
          ko.utils.domData.set(node, domDataKey, undefined);
      }
      
      function cleanSingleNode(node) {
          // Run all the dispose callbacks
          var callbacks = getDisposeCallbacksCollection(node, false);
          if (callbacks) {
              callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
              for (var i = 0; i < callbacks.length; i++)
                  callbacks[i](node);
          }	
          
          // Also erase the DOM data
          ko.utils.domData.clear(node);		
          
          // Special support for jQuery here because it's so commonly used.
          // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
          // so notify it to tear down any resources associated with the node & descendants here.
          if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
              jQuery['cleanData']([node]);			
      }
      
      return {
          addDisposeCallback : function(node, callback) {
              if (typeof callback != "function")
                  throw new Error("Callback must be a function");
              getDisposeCallbacksCollection(node, true).push(callback);
          },
          
          removeDisposeCallback : function(node, callback) {
              var callbacksCollection = getDisposeCallbacksCollection(node, false);
              if (callbacksCollection) {
                  ko.utils.arrayRemoveItem(callbacksCollection, callback);
                  if (callbacksCollection.length == 0)
                      destroyCallbacksCollection(node);
              }
          },
          
          cleanNode : function(node) {
              if ((node.nodeType != 1) && (node.nodeType != 9))
                  return;
              cleanSingleNode(node);
              
              // Clone the descendants list in case it changes during iteration
              var descendants = [];
              ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
              for (var i = 0, j = descendants.length; i < j; i++)
                  cleanSingleNode(descendants[i]);
          },
          
          removeNode : function(node) {
              ko.cleanNode(node);
              if (node.parentNode)
                  node.parentNode.removeChild(node);
          }
      }
  })();
  ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
  ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
  ko.exportSymbol('ko.cleanNode', ko.cleanNode); 
  ko.exportSymbol('ko.removeNode', ko.removeNode);
  ko.exportSymbol('ko.utils.domNodeDisposal', ko.utils.domNodeDisposal);
  ko.exportSymbol('ko.utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
  ko.exportSymbol('ko.utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);(function () {
      var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;
  
      function simpleHtmlParse(html) {
          // Based on jQuery's "clean" function, but only accounting for table-related elements.
          // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly
  
          // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
          // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
          // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
          // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.
          
          // Trim whitespace, otherwise indexOf won't work as expected
          var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");
  
          // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
          var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                     !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                     (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                     /* anything else */                                 [0, "", ""];
  
          // Go to html and back, then peel off extra wrappers
          // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
          var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
          if (typeof window['innerShiv'] == "function") {
              div.appendChild(window['innerShiv'](markup));
          } else {
              div.innerHTML = markup;
          }
  
          // Move to the right depth
          while (wrap[0]--)
              div = div.lastChild;
  
          return ko.utils.makeArray(div.lastChild.childNodes);
      }
  
      function jQueryHtmlParse(html) {
          var elems = jQuery['clean']([html]);
  
          // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
          // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
          // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
          if (elems && elems[0]) {
              // Find the top-most parent element that's a direct child of a document fragment
              var elem = elems[0];
              while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                  elem = elem.parentNode;
              // ... then detach it
              if (elem.parentNode)
                  elem.parentNode.removeChild(elem);
          }
          
          return elems;
      }
      
      ko.utils.parseHtmlFragment = function(html) {
          return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                              : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
      };
      
      ko.utils.setHtml = function(node, html) {
          ko.utils.emptyDomNode(node);
          
          if ((html !== null) && (html !== undefined)) {
              if (typeof html != 'string')
                  html = html.toString();
              
              // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
              // for example <tr> elements which are not normally allowed to exist on their own.
              // If you've referenced jQuery we'll use that rather than duplicating its code.
              if (typeof jQuery != 'undefined') {
                  jQuery(node)['html'](html);
              } else {
                  // ... otherwise, use KO's own parsing logic.
                  var parsedNodes = ko.utils.parseHtmlFragment(html);
                  for (var i = 0; i < parsedNodes.length; i++)
                      node.appendChild(parsedNodes[i]);
              }            
          }    	
      };
  })();
  
  ko.exportSymbol('ko.utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
  ko.exportSymbol('ko.utils.setHtml', ko.utils.setHtml);
  ko.memoization = (function () {
      var memos = {};
  
      function randomMax8HexChars() {
          return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
      }
      function generateRandomId() {
          return randomMax8HexChars() + randomMax8HexChars();
      }
      function findMemoNodes(rootNode, appendToArray) {
          if (!rootNode)
              return;
          if (rootNode.nodeType == 8) {
              var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
              if (memoId != null)
                  appendToArray.push({ domNode: rootNode, memoId: memoId });
          } else if (rootNode.nodeType == 1) {
              for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                  findMemoNodes(childNodes[i], appendToArray);
          }
      }
  
      return {
          memoize: function (callback) {
              if (typeof callback != "function")
                  throw new Error("You can only pass a function to ko.memoization.memoize()");
              var memoId = generateRandomId();
              memos[memoId] = callback;
              return "<!--[ko_memo:" + memoId + "]-->";
          },
  
          unmemoize: function (memoId, callbackParams) {
              var callback = memos[memoId];
              if (callback === undefined)
                  throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
              try {
                  callback.apply(null, callbackParams || []);
                  return true;
              }
              finally { delete memos[memoId]; }
          },
  
          unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
              var memos = [];
              findMemoNodes(domNode, memos);
              for (var i = 0, j = memos.length; i < j; i++) {
                  var node = memos[i].domNode;
                  var combinedParams = [node];
                  if (extraCallbackParamsArray)
                      ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                  ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                  node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                  if (node.parentNode)
                      node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
              }
          },
  
          parseMemoText: function (memoText) {
              var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
              return match ? match[1] : null;
          }
      };
  })();
  
  ko.exportSymbol('ko.memoization', ko.memoization);
  ko.exportSymbol('ko.memoization.memoize', ko.memoization.memoize);
  ko.exportSymbol('ko.memoization.unmemoize', ko.memoization.unmemoize);
  ko.exportSymbol('ko.memoization.parseMemoText', ko.memoization.parseMemoText);
  ko.exportSymbol('ko.memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
  ko.extenders = {
      'throttle': function(target, timeout) {
          // Throttling means two things:
  
          // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
          //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
          target['throttleEvaluation'] = timeout;
  
          // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
          //     so the target cannot change value synchronously or faster than a certain rate
          var writeTimeoutInstance = null;
          return ko.dependentObservable({
              'read': target,
              'write': function(value) {
                  clearTimeout(writeTimeoutInstance);
                  writeTimeoutInstance = setTimeout(function() {
                      target(value);
                  }, timeout);                
              }
          });
      },
  
      'notify': function(target, notifyWhen) {
          target["equalityComparer"] = notifyWhen == "always" 
              ? function() { return false } // Treat all values as not equal
              : ko.observable["fn"]["equalityComparer"];
          return target;
      }
  };
  
  function applyExtenders(requestedExtenders) {
      var target = this;
      if (requestedExtenders) {
          for (var key in requestedExtenders) {
              var extenderHandler = ko.extenders[key];
              if (typeof extenderHandler == 'function') {
                  target = extenderHandler(target, requestedExtenders[key]);
              }
          }
      }
      return target;
  }
  
  ko.exportSymbol('ko.extenders', ko.extenders);
  ko.subscription = function (callback, disposeCallback) {
      this.callback = callback;
      this.disposeCallback = disposeCallback;
      ko.exportProperty(this, 'dispose', this.dispose);
  };
  ko.subscription.prototype.dispose = function () {
      this.isDisposed = true;
      this.disposeCallback();
  };
  
  ko.subscribable = function () {
      this._subscriptions = {};
  
      ko.utils.extend(this, ko.subscribable['fn']);
      ko.exportProperty(this, 'subscribe', this.subscribe);
      ko.exportProperty(this, 'extend', this.extend);
      ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
  }
  
  var defaultEvent = "change";
  
  ko.subscribable['fn'] = {
      subscribe: function (callback, callbackTarget, event) {
          event = event || defaultEvent;
          var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
  
          var subscription = new ko.subscription(boundCallback, function () {
              ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
          }.bind(this));
  
          if (!this._subscriptions[event])
              this._subscriptions[event] = [];
          this._subscriptions[event].push(subscription);
          return subscription;
      },
  
      "notifySubscribers": function (valueToNotify, event) {
          event = event || defaultEvent;
          if (this._subscriptions[event]) {
              ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                  // In case a subscription was disposed during the arrayForEach cycle, check
                  // for isDisposed on each subscription before invoking its callback
                  if (subscription && (subscription.isDisposed !== true))
                      subscription.callback(valueToNotify);
              });
          }
      },
  
      getSubscriptionsCount: function () {
          var total = 0;
          for (var eventName in this._subscriptions) {
              if (this._subscriptions.hasOwnProperty(eventName))
                  total += this._subscriptions[eventName].length;
          }
          return total;
      },
      
      extend: applyExtenders
  };
  
  
  ko.isSubscribable = function (instance) {
      return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
  };
  
  ko.exportSymbol('ko.subscribable', ko.subscribable);
  ko.exportSymbol('ko.isSubscribable', ko.isSubscribable);
  
  ko.dependencyDetection = (function () {
      var _frames = [];
      
      return {
          begin: function (callback) {
              _frames.push({ callback: callback, distinctDependencies:[] });
          },
  
          end: function () {
              _frames.pop();
          },
  
          registerDependency: function (subscribable) {
              if (!ko.isSubscribable(subscribable))
                  throw "Only subscribable things can act as dependencies";
              if (_frames.length > 0) {
                  var topFrame = _frames[_frames.length - 1];
                  if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                      return;
                  topFrame.distinctDependencies.push(subscribable);
                  topFrame.callback(subscribable);
              }
          }
      };
  })();var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };
  
  ko.observable = function (initialValue) {
      var _latestValue = initialValue;
  
      function observable() {
          if (arguments.length > 0) {
              // Write            
              
              // Ignore writes if the value hasn't changed
              if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                  observable.valueWillMutate();
                  _latestValue = arguments[0];
                  observable.valueHasMutated();
              }
              return this; // Permits chained assignments
          }
          else {
              // Read
              ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
              return _latestValue;
          }
      }
      ko.subscribable.call(observable);
      observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
      observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
      ko.utils.extend(observable, ko.observable['fn']);
  
      ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
      ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);
      
      return observable;
  }
  
  ko.observable['fn'] = {
      __ko_proto__: ko.observable,
  
      "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
          var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
          return oldValueIsPrimitive ? (a === b) : false;
      }
  };
  
  ko.isObservable = function (instance) {
      if ((instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined)) return false;
      if (instance.__ko_proto__ === ko.observable) return true;
      return ko.isObservable(instance.__ko_proto__); // Walk the prototype chain
  }
  ko.isWriteableObservable = function (instance) {
      // Observable
      if ((typeof instance == "function") && instance.__ko_proto__ === ko.observable)
          return true;
      // Writeable dependent observable
      if ((typeof instance == "function") && (instance.__ko_proto__ === ko.dependentObservable) && (instance.hasWriteFunction))
          return true;
      // Anything else
      return false;
  }
  
  
  ko.exportSymbol('ko.observable', ko.observable);
  ko.exportSymbol('ko.isObservable', ko.isObservable);
  ko.exportSymbol('ko.isWriteableObservable', ko.isWriteableObservable);
  ko.observableArray = function (initialValues) {
      if (arguments.length == 0) {
          // Zero-parameter constructor initializes to empty array
          initialValues = [];
      }
      if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
          throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
          
      var result = new ko.observable(initialValues);
      ko.utils.extend(result, ko.observableArray['fn']);
      
      ko.exportProperty(result, "remove", result.remove);
      ko.exportProperty(result, "removeAll", result.removeAll);
      ko.exportProperty(result, "destroy", result.destroy);
      ko.exportProperty(result, "destroyAll", result.destroyAll);
      ko.exportProperty(result, "indexOf", result.indexOf);
      ko.exportProperty(result, "replace", result.replace);
      
      return result;
  }
  
  ko.observableArray['fn'] = {
      remove: function (valueOrPredicate) {
          var underlyingArray = this();
          var removedValues = [];
          var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
          for (var i = 0; i < underlyingArray.length; i++) {
              var value = underlyingArray[i];
              if (predicate(value)) {
                  if (removedValues.length === 0) {
                      this.valueWillMutate();
                  }
                  removedValues.push(value);
                  underlyingArray.splice(i, 1);
                  i--;
              }
          }
          if (removedValues.length) {
              this.valueHasMutated();
          }
          return removedValues;
      },
  
      removeAll: function (arrayOfValues) {
          // If you passed zero args, we remove everything
          if (arrayOfValues === undefined) {
              var underlyingArray = this();
              var allValues = underlyingArray.slice(0);
              this.valueWillMutate();
              underlyingArray.splice(0, underlyingArray.length);
              this.valueHasMutated();
              return allValues;
          }
          // If you passed an arg, we interpret it as an array of entries to remove
          if (!arrayOfValues)
              return [];
          return this.remove(function (value) {
              return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
          });
      },
      
      destroy: function (valueOrPredicate) {
          var underlyingArray = this();
          var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
          this.valueWillMutate();
          for (var i = underlyingArray.length - 1; i >= 0; i--) {
              var value = underlyingArray[i];
              if (predicate(value))
                  underlyingArray[i]["_destroy"] = true;
          }
          this.valueHasMutated();
      },
          
      destroyAll: function (arrayOfValues) {
          // If you passed zero args, we destroy everything
          if (arrayOfValues === undefined)
              return this.destroy(function() { return true });
                  
          // If you passed an arg, we interpret it as an array of entries to destroy
          if (!arrayOfValues)
              return [];
          return this.destroy(function (value) {
              return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
          });             
      },
  
      indexOf: function (item) {
          var underlyingArray = this();
          return ko.utils.arrayIndexOf(underlyingArray, item);
      },
      
      replace: function(oldItem, newItem) {
          var index = this.indexOf(oldItem);
          if (index >= 0) {
              this.valueWillMutate();
              this()[index] = newItem;
              this.valueHasMutated();
          }
      }    
  }
  
  // Populate ko.observableArray.fn with read/write functions from native arrays
  ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
      ko.observableArray['fn'][methodName] = function () { 
          var underlyingArray = this();
          this.valueWillMutate();
          var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
          this.valueHasMutated();
          return methodCallResult;
      };
  });
  
  // Populate ko.observableArray.fn with read-only functions from native arrays
  ko.utils.arrayForEach(["slice"], function (methodName) {
      ko.observableArray['fn'][methodName] = function () {
          var underlyingArray = this();
          return underlyingArray[methodName].apply(underlyingArray, arguments);
      };
  });
  
  ko.exportSymbol('ko.observableArray', ko.observableArray);
  function prepareOptions(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
      if (evaluatorFunctionOrOptions && typeof evaluatorFunctionOrOptions == "object") {
          // Single-parameter syntax - everything is on this "options" param
          options = evaluatorFunctionOrOptions;
      } else {
          // Multi-parameter syntax - construct the options according to the params passed
          options = options || {};
          options["read"] = evaluatorFunctionOrOptions || options["read"];
      }
      // By here, "options" is always non-null
      
      if (typeof options["read"] != "function")
          throw "Pass a function that returns the value of the dependentObservable";
          
      return options;    
  }
  
  ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
      var _latestValue, 
          _hasBeenEvaluated = false, 
          options = prepareOptions(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options);
  
      // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
      // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
      // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
      var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
      var disposeWhenNodeIsRemovedCallback = null;
      if (disposeWhenNodeIsRemoved) {
          disposeWhenNodeIsRemovedCallback = function() { dependentObservable.dispose() };
          ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, disposeWhenNodeIsRemovedCallback);
          var existingDisposeWhenFunction = options["disposeWhen"];
          options["disposeWhen"] = function () {
              return (!ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved)) 
                  || ((typeof existingDisposeWhenFunction == "function") && existingDisposeWhenFunction());
          }    	
      }
      
      var _subscriptionsToDependencies = [];
      function disposeAllSubscriptionsToDependencies() {
          ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
              subscription.dispose();
          });
          _subscriptionsToDependencies = [];
      }
      
      var evaluationTimeoutInstance = null;
      function evaluatePossiblyAsync() {
          var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
          if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
              clearTimeout(evaluationTimeoutInstance);
              evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
          } else
              evaluateImmediate();
      }
  
      function evaluateImmediate() {
          // Don't dispose on first evaluation, because the "disposeWhen" callback might
          // e.g., dispose when the associated DOM element isn't in the doc, and it's not
          // going to be in the doc until *after* the first evaluation
          if ((_hasBeenEvaluated) && typeof options["disposeWhen"] == "function") {
              if (options["disposeWhen"]()) {
                  dependentObservable.dispose();
                  return;
              }
          }
  
          try {
              disposeAllSubscriptionsToDependencies();
              ko.dependencyDetection.begin(function(subscribable) {
                  _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync));
              });
              var valueForThis = options["owner"] || evaluatorFunctionTarget; // If undefined, it will default to "window" by convention. This might change in the future.
              var newValue = options["read"].call(valueForThis);
              dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
              _latestValue = newValue;
          } finally {
              ko.dependencyDetection.end();
          }
  
          dependentObservable["notifySubscribers"](_latestValue);
          _hasBeenEvaluated = true;
      }
  
      function dependentObservable() {
          if (arguments.length > 0) {
              if (typeof options["write"] === "function") {
                  // Writing a value
                  var valueForThis = options["owner"] || evaluatorFunctionTarget; // If undefined, it will default to "window" by convention. This might change in the future.
                  options["write"].apply(valueForThis, arguments);
              } else {
                  throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
              }
          } else {
              // Reading the value
              if (!_hasBeenEvaluated)
                  evaluateImmediate();
              ko.dependencyDetection.registerDependency(dependentObservable);
              return _latestValue;
          }
      }
      dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; }
      dependentObservable.hasWriteFunction = typeof options["write"] === "function";
      dependentObservable.dispose = function () {
          if (disposeWhenNodeIsRemoved)
              ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, disposeWhenNodeIsRemovedCallback);
          disposeAllSubscriptionsToDependencies();
      };
      
      ko.subscribable.call(dependentObservable);
      ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);
  
      if (options['deferEvaluation'] !== true)
          evaluateImmediate();
      
      ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
      ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);
      
      return dependentObservable;
  };
  
  ko.dependentObservable['fn'] = {
      __ko_proto__: ko.dependentObservable
  };
  
  ko.dependentObservable.__ko_proto__ = ko.observable;
  
  ko.exportSymbol('ko.dependentObservable', ko.dependentObservable);
  ko.exportSymbol('ko.computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
  (function() {    
      var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)
      
      ko.toJS = function(rootObject) {
          if (arguments.length == 0)
              throw new Error("When calling ko.toJS, pass the object you want to convert.");
          
          // We just unwrap everything at every level in the object graph
          return mapJsObjectGraph(rootObject, function(valueToMap) {
              // Loop because an observable's value might in turn be another observable wrapper
              for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                  valueToMap = valueToMap();
              return valueToMap;
          });
      };
  
      ko.toJSON = function(rootObject) {
          var plainJavaScriptObject = ko.toJS(rootObject);
          return ko.utils.stringifyJson(plainJavaScriptObject);
      };
      
      function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
          visitedObjects = visitedObjects || new objectLookup();
          
          rootObject = mapInputCallback(rootObject);
          var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
          if (!canHaveProperties)
              return rootObject;
              
          var outputProperties = rootObject instanceof Array ? [] : {};
          visitedObjects.save(rootObject, outputProperties);            
          
          visitPropertiesOrArrayEntries(rootObject, function(indexer) {
              var propertyValue = mapInputCallback(rootObject[indexer]);
              
              switch (typeof propertyValue) {
                  case "boolean":
                  case "number":
                  case "string":
                  case "function":
                      outputProperties[indexer] = propertyValue;
                      break;
                  case "object":
                  case "undefined":				
                      var previouslyMappedValue = visitedObjects.get(propertyValue);
                      outputProperties[indexer] = (previouslyMappedValue !== undefined)
                          ? previouslyMappedValue
                          : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                      break;							
              }
          });
          
          return outputProperties;
      }
      
      function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
          if (rootObject instanceof Array) {
              for (var i = 0; i < rootObject.length; i++)
                  visitorCallback(i);
          } else {
              for (var propertyName in rootObject)
                  visitorCallback(propertyName);
          }
      };    
      
      function objectLookup() {
          var keys = [];
          var values = [];
          this.save = function(key, value) {
              var existingIndex = ko.utils.arrayIndexOf(keys, key);
              if (existingIndex >= 0)
                  values[existingIndex] = value;
              else {
                  keys.push(key);
                  values.push(value);	
              }				
          };
          this.get = function(key) {
              var existingIndex = ko.utils.arrayIndexOf(keys, key);
              return (existingIndex >= 0) ? values[existingIndex] : undefined;
          };
      };
  })();
  
  ko.exportSymbol('ko.toJS', ko.toJS);
  ko.exportSymbol('ko.toJSON', ko.toJSON);(function () {
      var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';
  
      // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
      // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
      // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
      ko.selectExtensions = {
          readValue : function(element) {
              if (element.tagName == 'OPTION') {
                  if (element[hasDomDataExpandoProperty] === true)
                      return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                  return element.getAttribute("value");
              } else if (element.tagName == 'SELECT')
                  return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
              else
                  return element.value;
          },
          
          writeValue: function(element, value) {
              if (element.tagName == 'OPTION') {
                  switch(typeof value) {
                      case "string":
                          ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                          if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                              delete element[hasDomDataExpandoProperty];
                          }
                          element.value = value;                                   
                          break;
                      default:
                          // Store arbitrary object using DomData
                          ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                          element[hasDomDataExpandoProperty] = true;
  
                          // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                          element.value = typeof value === "number" ? value : "";
                          break;
                  }			
              } else if (element.tagName == 'SELECT') {
                  for (var i = element.options.length - 1; i >= 0; i--) {
                      if (ko.selectExtensions.readValue(element.options[i]) == value) {
                          element.selectedIndex = i;
                          break;
                      }
                  }
              } else {
                  if ((value === null) || (value === undefined))
                      value = "";
                  element.value = value;
              }
          }
      };        
  })();
  
  ko.exportSymbol('ko.selectExtensions', ko.selectExtensions);
  ko.exportSymbol('ko.selectExtensions.readValue', ko.selectExtensions.readValue);
  ko.exportSymbol('ko.selectExtensions.writeValue', ko.selectExtensions.writeValue);
  
  ko.jsonExpressionRewriting = (function () {
      var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
      var javaScriptAssignmentTarget = /^[\_$a-z][\_$a-z0-9]*(\[.*?\])*(\.[\_$a-z][\_$a-z0-9]*(\[.*?\])*)*$/i;
      var javaScriptReservedWords = ["true", "false"];
  
      function restoreTokens(string, tokens) {
          var prevValue = null;
          while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
              prevValue = string;
              string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
                  return tokens[tokenIndex];
              });
          }
          return string;
      }
  
      function isWriteableValue(expression) {
          if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0)
              return false;
          return expression.match(javaScriptAssignmentTarget) !== null;
      }
  
      function ensureQuoted(key) {
          var trimmedKey = ko.utils.stringTrim(key);
          switch (trimmedKey.length && trimmedKey.charAt(0)) {
              case "'":
              case '"': 
                  return key;
              default:
                  return "'" + trimmedKey + "'";
          }
      }
  
      return {
          bindingRewriteValidators: [],
          
          parseObjectLiteral: function(objectLiteralString) {
              // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
              // that is sufficient just to split an object literal string into a set of top-level key-value pairs
  
              var str = ko.utils.stringTrim(objectLiteralString);
              if (str.length < 3)
                  return [];
              if (str.charAt(0) === "{")// Ignore any braces surrounding the whole object literal
                  str = str.substring(1, str.length - 1);
  
              // Pull out any string literals and regex literals
              var tokens = [];
              var tokenStart = null, tokenEndChar;
              for (var position = 0; position < str.length; position++) {
                  var c = str.charAt(position);
                  if (tokenStart === null) {
                      switch (c) {
                          case '"':
                          case "'":
                          case "/":
                              tokenStart = position;
                              tokenEndChar = c;
                              break;
                      }
                  } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                      var token = str.substring(tokenStart, position + 1);
                      tokens.push(token);
                      var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                      str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                      position -= (token.length - replacement.length);
                      tokenStart = null;
                  }
              }
  
              // Next pull out balanced paren, brace, and bracket blocks
              tokenStart = null;
              tokenEndChar = null;
              var tokenDepth = 0, tokenStartChar = null;
              for (var position = 0; position < str.length; position++) {
                  var c = str.charAt(position);
                  if (tokenStart === null) {
                      switch (c) {
                          case "{": tokenStart = position; tokenStartChar = c;
                                    tokenEndChar = "}";
                                    break;
                          case "(": tokenStart = position; tokenStartChar = c;
                                    tokenEndChar = ")";
                                    break;
                          case "[": tokenStart = position; tokenStartChar = c;
                                    tokenEndChar = "]";
                                    break;
                      }
                  }
  
                  if (c === tokenStartChar)
                      tokenDepth++;
                  else if (c === tokenEndChar) {
                      tokenDepth--;
                      if (tokenDepth === 0) {
                          var token = str.substring(tokenStart, position + 1);
                          tokens.push(token);
                          var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                          str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                          position -= (token.length - replacement.length);
                          tokenStart = null;                            
                      }
                  }
              }
  
              // Now we can safely split on commas to get the key/value pairs
              var result = [];
              var keyValuePairs = str.split(",");
              for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                  var pair = keyValuePairs[i];
                  var colonPos = pair.indexOf(":");
                  if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                      var key = pair.substring(0, colonPos);
                      var value = pair.substring(colonPos + 1);
                      result.push({ 'key': restoreTokens(key, tokens), 'value': restoreTokens(value, tokens) });
                  } else {
                      result.push({ 'unknown': restoreTokens(pair, tokens) });
                  }
              }
              return result;            
          },
  
          insertPropertyAccessorsIntoJson: function (objectLiteralStringOrKeyValueArray) {
              var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string" 
                  ? ko.jsonExpressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray)
                  : objectLiteralStringOrKeyValueArray;
              var resultStrings = [], propertyAccessorResultStrings = [];
  
              var keyValueEntry;
              for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                  if (resultStrings.length > 0)
                      resultStrings.push(",");
  
                  if (keyValueEntry['key']) {
                      var quotedKey = ensureQuoted(keyValueEntry['key']), val = keyValueEntry['value'];
                      resultStrings.push(quotedKey);
                      resultStrings.push(":");              
                      resultStrings.push(val);
  
                      if (isWriteableValue(ko.utils.stringTrim(val))) {
                          if (propertyAccessorResultStrings.length > 0)
                              propertyAccessorResultStrings.push(", ");
                          propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                      }                    
                  } else if (keyValueEntry['unknown']) {
                      resultStrings.push(keyValueEntry['unknown']);
                  }
              }
  
              var combinedResult = resultStrings.join("");
              if (propertyAccessorResultStrings.length > 0) {
                  var allPropertyAccessors = propertyAccessorResultStrings.join("");
                  combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";                
              }
  
              return combinedResult;
          },
  
          keyValueArrayContainsKey: function(keyValueArray, key) {
              for (var i = 0; i < keyValueArray.length; i++)
                  if (ko.utils.stringTrim(keyValueArray[i]['key']) == key)
                      return true;            
              return false;
          }
      };
  })();
  
  ko.exportSymbol('ko.jsonExpressionRewriting', ko.jsonExpressionRewriting);
  ko.exportSymbol('ko.jsonExpressionRewriting.bindingRewriteValidators', ko.jsonExpressionRewriting.bindingRewriteValidators);
  ko.exportSymbol('ko.jsonExpressionRewriting.parseObjectLiteral', ko.jsonExpressionRewriting.parseObjectLiteral);
  ko.exportSymbol('ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson);
  (function() {
      // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
      // may be used to represent hierarchy (in addition to the DOM's natural hierarchy). 
      // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state 
      // of that virtual hierarchy
      // 
      // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
      // without having to scatter special cases all over the binding and templating code.
  
      // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
      // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
      // So, use node.text where available, and node.nodeValue elsewhere
      var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";
  
      var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko\s+(.*\:.*)\s*-->$/ : /^\s*ko\s+(.*\:.*)\s*$/;
      var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
      var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };
  
      function isStartComment(node) {
          return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
      }
  
      function isEndComment(node) {
          return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
      }
  
      function getVirtualChildren(startComment, allowUnbalanced) {
          var currentNode = startComment;
          var depth = 1;
          var children = [];
          while (currentNode = currentNode.nextSibling) {
              if (isEndComment(currentNode)) {
                  depth--;
                  if (depth === 0)
                      return children;
              }
  
              children.push(currentNode);
  
              if (isStartComment(currentNode))
                  depth++;
          }
          if (!allowUnbalanced)
              throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
          return null;
      }
  
      function getMatchingEndComment(startComment, allowUnbalanced) {
          var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
          if (allVirtualChildren) {
              if (allVirtualChildren.length > 0)
                  return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
              return startComment.nextSibling;
          } else
              return null; // Must have no matching end comment, and allowUnbalanced is true
      }
  
      function nodeArrayToText(nodeArray, cleanNodes) {
          var texts = [];
          for (var i = 0, j = nodeArray.length; i < j; i++) {
              if (cleanNodes)
                  ko.utils.domNodeDisposal.cleanNode(nodeArray[i]);
              texts.push(ko.utils.outerHTML(nodeArray[i]));
          }
          return String.prototype.concat.apply("", texts);
      }   
  
      function getUnbalancedChildTags(node) {
          // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
          //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
          var childNode = node.firstChild, captureRemaining = null;
          if (childNode) {
              do {
                  if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                      captureRemaining.push(childNode);
                  else if (isStartComment(childNode)) {
                      var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                      if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                          childNode = matchingEndComment;
                      else
                          captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                  } else if (isEndComment(childNode)) {
                      captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                  }
              } while (childNode = childNode.nextSibling);
          }
          return captureRemaining;
      }
  
      ko.virtualElements = {
          allowedBindings: {},
  
          childNodes: function(node) {
              return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
          },
  
          emptyNode: function(node) {
              if (!isStartComment(node))
                  ko.utils.emptyDomNode(node);
              else {
                  var virtualChildren = ko.virtualElements.childNodes(node);
                  for (var i = 0, j = virtualChildren.length; i < j; i++)
                      ko.removeNode(virtualChildren[i]);
              }
          },
  
          setDomNodeChildren: function(node, childNodes) {
              if (!isStartComment(node))
                  ko.utils.setDomNodeChildren(node, childNodes);
              else {
                  ko.virtualElements.emptyNode(node);
                  var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                  for (var i = 0, j = childNodes.length; i < j; i++)
                      endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
              }
          },
  
          prepend: function(containerNode, nodeToPrepend) {
              if (!isStartComment(containerNode)) {
                  if (containerNode.firstChild)
                      containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                  else
                      containerNode.appendChild(nodeToPrepend);                           
              } else {
                  // Start comments must always have a parent and at least one following sibling (the end comment)
                  containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
              }
          },
  
          insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
              if (!isStartComment(containerNode)) {
                  // Insert after insertion point
                  if (insertAfterNode.nextSibling)
                      containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                  else
                      containerNode.appendChild(nodeToInsert);    
              } else {
                  // Children of start comments must always have a parent and at least one following sibling (the end comment)
                  containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
              }                           
          },
  
          nextSibling: function(node) {
              if (!isStartComment(node)) {
                  if (node.nextSibling && isEndComment(node.nextSibling))
                      return undefined;
                  return node.nextSibling;
              } else {
                  return getMatchingEndComment(node).nextSibling;
              }
          },
  
          virtualNodeBindingValue: function(node) {
              var regexMatch = isStartComment(node);
              return regexMatch ? regexMatch[1] : null;               
          },
  
          extractAnonymousTemplateIfVirtualElement: function(node) {
              if (ko.virtualElements.virtualNodeBindingValue(node)) {
                  // Empty out the virtual children, and associate "node" with an anonymous template matching its previous virtual children
                  var virtualChildren = ko.virtualElements.childNodes(node);
                  var anonymousTemplateText = nodeArrayToText(virtualChildren, true);
                  ko.virtualElements.emptyNode(node);
                  new ko.templateSources.anonymousTemplate(node).text(anonymousTemplateText);
              }
          },
          
          normaliseVirtualElementDomStructure: function(elementVerified) {
              // Workaround for https://github.com/SteveSanderson/knockout/issues/155 
              // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
              // that are direct descendants of <ul> into the preceding <li>)
              if (!htmlTagsWithOptionallyClosingChildren[elementVerified.tagName.toLowerCase()])
                  return;
              
              // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
              // must be intended to appear *after* that child, so move them there.
              var childNode = elementVerified.firstChild;
              if (childNode) {
                  do {
                      if (childNode.nodeType === 1) {
                          var unbalancedTags = getUnbalancedChildTags(childNode);
                          if (unbalancedTags) {
                              // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                              var nodeToInsertBefore = childNode.nextSibling;
                              for (var i = 0; i < unbalancedTags.length; i++) {
                                  if (nodeToInsertBefore)
                                      elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                  else
                                      elementVerified.appendChild(unbalancedTags[i]);
                              }
                          }
                      }
                  } while (childNode = childNode.nextSibling);
              }
          }  
      };  
  })();
  (function() {
      var defaultBindingAttributeName = "data-bind";
  
      ko.bindingProvider = function() { };
  
      ko.utils.extend(ko.bindingProvider.prototype, {
          'nodeHasBindings': function(node) {
              switch (node.nodeType) {
                  case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
                  case 8: return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                  default: return false;
              }
          },
  
          'getBindings': function(node, bindingContext) {
              var bindingsString = this['getBindingsString'](node, bindingContext);
              return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext) : null;
          },
  
          // The following function is only used internally by this default provider.
          // It's not part of the interface definition for a general binding provider.
          'getBindingsString': function(node, bindingContext) {
              switch (node.nodeType) {
                  case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                  case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                  default: return null;
              }
          },
  
          // The following function is only used internally by this default provider.
          // It's not part of the interface definition for a general binding provider.
          'parseBindingsString': function(bindingsString, bindingContext) {
              try {
                  var viewModel = bindingContext['$data'];
                  var rewrittenBindings = " { " + ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(bindingsString) + " } ";
                  return ko.utils.evalWithinScope(rewrittenBindings, viewModel === null ? window : viewModel, bindingContext);
              } catch (ex) {
                  throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
              }           
          }
      });
  
      ko.bindingProvider['instance'] = new ko.bindingProvider();
  })();
  
  ko.exportSymbol('ko.bindingProvider', ko.bindingProvider);(function () {
      ko.bindingHandlers = {};
  
      ko.bindingContext = function(dataItem, parentBindingContext) {
          this['$data'] = dataItem;
          if (parentBindingContext) {
              this['$parent'] = parentBindingContext['$data'];
              this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
              this['$parents'].unshift(this['$parent']);
              this['$root'] = parentBindingContext['$root'];
          } else {
              this['$parents'] = [];
              this['$root'] = dataItem;        	
          }
      }
      ko.bindingContext.prototype['createChildContext'] = function (dataItem) {
          return new ko.bindingContext(dataItem, this);
      };
  
      function validateThatBindingIsAllowedForVirtualElements(bindingName) {
          var validator = ko.virtualElements.allowedBindings[bindingName];
          if (!validator)
              throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
      }
  
      function applyBindingsToDescendantsInternal (viewModel, elementVerified) {
          var currentChild, nextInQueue = elementVerified.childNodes[0];
          while (currentChild = nextInQueue) {
              // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
              nextInQueue = ko.virtualElements.nextSibling(currentChild);
              applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, false);
          }        
      }
      
      function applyBindingsToNodeAndDescendantsInternal (viewModel, nodeVerified, isRootNodeForBindingContext) {
          var shouldBindDescendants = true;
  
          // Perf optimisation: Apply bindings only if...
          // (1) It's a root element for this binding context, as we will need to store the binding context on this node
          //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
          // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
          var isElement = (nodeVerified.nodeType == 1);
          if (isElement) // Workaround IE <= 8 HTML parsing weirdness
              ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);
  
          var shouldApplyBindings = (isElement && isRootNodeForBindingContext)                             // Case (1)
                                 || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
          if (shouldApplyBindings)
              shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, isRootNodeForBindingContext).shouldBindDescendants;
              
          if (isElement && shouldBindDescendants)
              applyBindingsToDescendantsInternal(viewModel, nodeVerified);
      }    
  
      function applyBindingsToNodeInternal (node, bindings, viewModelOrBindingContext, isRootNodeForBindingContext) {
          // Need to be sure that inits are only run once, and updates never run until all the inits have been run
          var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits
  
          // Pre-process any anonymous template bounded by comment nodes
          ko.virtualElements.extractAnonymousTemplateIfVirtualElement(node);
  
          // Each time the dependentObservable is evaluated (after data changes),
          // the binding attribute is reparsed so that it can pick out the correct
          // model properties in the context of the changed data.
          // DOM event callbacks need to be able to access this changed data,
          // so we need a single parsedBindings variable (shared by all callbacks
          // associated with this node's bindings) that all the closures can access.
          var parsedBindings;
          function makeValueAccessor(bindingKey) {
              return function () { return parsedBindings[bindingKey] }
          }
          function parsedBindingsAccessor() {
              return parsedBindings;
          }
          
          var bindingHandlerThatControlsDescendantBindings;
          new ko.dependentObservable(
              function () {
                  // Ensure we have a nonnull binding context to work with
                  var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                      ? viewModelOrBindingContext
                      : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                  var viewModel = bindingContextInstance['$data'];
  
                  // We only need to store the bindingContext at the root of the subtree where it applies
                  // as all descendants will be able to find it by scanning up their ancestry
                  if (isRootNodeForBindingContext)
                      ko.storedBindingContextForNode(node, bindingContextInstance);
  
                  // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                  var evaluatedBindings = (typeof bindings == "function") ? bindings() : bindings;
                  parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);
  
                  if (parsedBindings) {
                      // First run all the inits, so bindings can register for notification on changes
                      if (initPhase === 0) {
                          initPhase = 1;
                          for (var bindingKey in parsedBindings) {
                              var binding = ko.bindingHandlers[bindingKey];
                              if (binding && node.nodeType === 8)
                                  validateThatBindingIsAllowedForVirtualElements(bindingKey);
  
                              if (binding && typeof binding["init"] == "function") {
                                  var handlerInitFn = binding["init"];
                                  var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                                  
                                  // If this binding handler claims to control descendant bindings, make a note of this
                                  if (initResult && initResult['controlsDescendantBindings']) {
                                      if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                          throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                      bindingHandlerThatControlsDescendantBindings = bindingKey;
                                  }
                              }
                          }
                          initPhase = 2;
                      }
                      
                      // ... then run all the updates, which might trigger changes even on the first evaluation
                      if (initPhase === 2) {
                          for (var bindingKey in parsedBindings) {
                              var binding = ko.bindingHandlers[bindingKey];
                              if (binding && typeof binding["update"] == "function") {
                                  var handlerUpdateFn = binding["update"];
                                  handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                              }
                          }
                      }
                  }
              },
              null,
              { 'disposeWhenNodeIsRemoved' : node }
          );
          
          return { 
              shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
          };
      };
  
      var storedBindingContextDomDataKey = "__ko_bindingContext__";
      ko.storedBindingContextForNode = function (node, bindingContext) {
          if (arguments.length == 2)
              ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
          else
              return ko.utils.domData.get(node, storedBindingContextDomDataKey);
      }
  
      ko.applyBindingsToNode = function (node, bindings, viewModel) {
          if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
              ko.virtualElements.normaliseVirtualElementDomStructure(node);        
          return applyBindingsToNodeInternal(node, bindings, viewModel, true);
      };
  
      ko.applyBindingsToDescendants = function(viewModel, rootNode) {
          if (rootNode.nodeType === 1)
              applyBindingsToDescendantsInternal(viewModel, rootNode);
      };
  
      ko.applyBindings = function (viewModel, rootNode) {
          if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
              throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
          rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional
  
          applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
      };
  
      // Retrieving binding context from arbitrary nodes
      ko.contextFor = function(node) {
          // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
          switch (node.nodeType) {
              case 1:
              case 8:
                  var context = ko.storedBindingContextForNode(node);
                  if (context) return context;
                  if (node.parentNode) return ko.contextFor(node.parentNode);
                  break;
          }
          return undefined;
      };
      ko.dataFor = function(node) {
          var context = ko.contextFor(node);
          return context ? context['$data'] : undefined;
      };    
      
      ko.exportSymbol('ko.bindingHandlers', ko.bindingHandlers);
      ko.exportSymbol('ko.applyBindings', ko.applyBindings);
      ko.exportSymbol('ko.applyBindingsToDescendants', ko.applyBindingsToDescendants);
      ko.exportSymbol('ko.applyBindingsToNode', ko.applyBindingsToNode);
      ko.exportSymbol('ko.contextFor', ko.contextFor);
      ko.exportSymbol('ko.dataFor', ko.dataFor);
  })();// For certain common events (currently just 'click'), allow a simplified data-binding syntax
  // e.g. click:handler instead of the usual full-length event:{click:handler}
  var eventHandlersWithShortcuts = ['click'];
  ko.utils.arrayForEach(eventHandlersWithShortcuts, function(eventName) {
      ko.bindingHandlers[eventName] = {
          'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
              var newValueAccessor = function () {
                  var result = {};
                  result[eventName] = valueAccessor();
                  return result;
              };
              return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
          }
      }	
  });
  
  
  ko.bindingHandlers['event'] = {
      'init' : function (element, valueAccessor, allBindingsAccessor, viewModel) {
          var eventsToHandle = valueAccessor() || {};
          for(var eventNameOutsideClosure in eventsToHandle) {
              (function() {
                  var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                  if (typeof eventName == "string") {
                      ko.utils.registerEventHandler(element, eventName, function (event) {
                          var handlerReturnValue;
                          var handlerFunction = valueAccessor()[eventName];
                          if (!handlerFunction)
                              return;
                          var allBindings = allBindingsAccessor();
                          
                          try { 
                              // Take all the event args, and prefix with the viewmodel
                              var argsForHandler = ko.utils.makeArray(arguments);
                              argsForHandler.unshift(viewModel);
                              handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                          } finally {
                              if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                  if (event.preventDefault)
                                      event.preventDefault();
                                  else
                                      event.returnValue = false;
                              }
                          }
                          
                          var bubble = allBindings[eventName + 'Bubble'] !== false;
                          if (!bubble) {
                              event.cancelBubble = true;
                              if (event.stopPropagation)
                                  event.stopPropagation();
                          }
                      });
                  }
              })();
          }
      }
  };
  
  ko.bindingHandlers['submit'] = {
      'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
          if (typeof valueAccessor() != "function")
              throw new Error("The value for a submit binding must be a function");
          ko.utils.registerEventHandler(element, "submit", function (event) {
              var handlerReturnValue;
              var value = valueAccessor();
              try { handlerReturnValue = value.call(viewModel, element); }
              finally {
                  if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                      if (event.preventDefault)
                          event.preventDefault();
                      else
                          event.returnValue = false;
                  }
              }
          });
      }
  };
  
  ko.bindingHandlers['visible'] = {
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor());
          var isCurrentlyVisible = !(element.style.display == "none");
          if (value && !isCurrentlyVisible)
              element.style.display = "";
          else if ((!value) && isCurrentlyVisible)
              element.style.display = "none";
      }
  }
  
  ko.bindingHandlers['enable'] = {
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor());
          if (value && element.disabled)
              element.removeAttribute("disabled");
          else if ((!value) && (!element.disabled))
              element.disabled = true;
      }
  };
  
  ko.bindingHandlers['disable'] = { 
      'update': function (element, valueAccessor) { 
          ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) }); 		
      } 	
  };
  
  function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
      if (preferModelValue) {
          if (modelValue !== ko.selectExtensions.readValue(element))
              ko.selectExtensions.writeValue(element, modelValue);
      }
  
      // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
      // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
      // change the model value to match the dropdown.
      if (modelValue !== ko.selectExtensions.readValue(element))
          ko.utils.triggerEvent(element, "change");
  };
  
  ko.bindingHandlers['value'] = {
      'init': function (element, valueAccessor, allBindingsAccessor) { 
          // Always catch "change" event; possibly other events too if asked
          var eventsToCatch = ["change"];
          var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
          if (requestedEventsToCatch) {
              if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                  requestedEventsToCatch = [requestedEventsToCatch];
              ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
              eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
          }
          
          ko.utils.arrayForEach(eventsToCatch, function(eventName) {
              // The syntax "after<eventname>" means "run the handler asynchronously after the event"
              // This is useful, for example, to catch "keydown" events after the browser has updated the control
              // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
              var handleEventAsynchronously = false;
              if (ko.utils.stringStartsWith(eventName, "after")) {
                  handleEventAsynchronously = true;
                  eventName = eventName.substring("after".length);
              }
              var runEventHandler = handleEventAsynchronously ? function(handler) { setTimeout(handler, 0) }
                                                              : function(handler) { handler() };
              
              ko.utils.registerEventHandler(element, eventName, function () {
                  runEventHandler(function() {
                      var modelValue = valueAccessor();
                      var elementValue = ko.selectExtensions.readValue(element);
                      if (ko.isWriteableObservable(modelValue))
                          modelValue(elementValue);
                      else {
                          var allBindings = allBindingsAccessor();
                          if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['value'])
                              allBindings['_ko_property_writers']['value'](elementValue); 
                      }
                  });
              });	    	
          });
      },
      'update': function (element, valueAccessor) {
          var newValue = ko.utils.unwrapObservable(valueAccessor());
          var elementValue = ko.selectExtensions.readValue(element);
          var valueHasChanged = (newValue != elementValue);
          
          // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same). 
          // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
          if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
              valueHasChanged = true;
          
          if (valueHasChanged) {
              var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
              applyValueAction();
  
              // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
              // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
              // to apply the value as well.
              var alsoApplyAsynchronously = element.tagName == "SELECT";
              if (alsoApplyAsynchronously)
                  setTimeout(applyValueAction, 0);
          }
          
          // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
          // because you're not allowed to have a model value that disagrees with a visible UI selection.
          if ((element.tagName == "SELECT") && (element.length > 0))
              ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
      }
  };
  
  ko.bindingHandlers['options'] = {
      'update': function (element, valueAccessor, allBindingsAccessor) {
          if (element.tagName != "SELECT")
              throw new Error("options binding applies only to SELECT elements");
  
          var selectWasPreviouslyEmpty = element.length == 0;
          var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
              return node.tagName && node.tagName == "OPTION" && node.selected;
          }), function (node) {
              return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
          });
          var previousScrollTop = element.scrollTop;
          element.scrollTop = 0; // Workaround for a Chrome rendering bug. Note that we restore the scroll position later. (https://github.com/SteveSanderson/knockout/issues/215)
  
          var value = ko.utils.unwrapObservable(valueAccessor());
          var selectedValue = element.value;
  
          // Remove all existing <option>s. 
          // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
          while (element.length > 0) {
              ko.cleanNode(element.options[0]);
              element.remove(0);
          }
  
          if (value) {
              var allBindings = allBindingsAccessor();
              if (typeof value.length != "number")
                  value = [value];
              if (allBindings['optionsCaption']) {
                  var option = document.createElement("OPTION");
                  ko.utils.setHtml(option, allBindings['optionsCaption']);
                  ko.selectExtensions.writeValue(option, undefined);
                  element.appendChild(option);
              }
              for (var i = 0, j = value.length; i < j; i++) {
                  var option = document.createElement("OPTION");
                  
                  // Apply a value to the option element
                  var optionValue = typeof allBindings['optionsValue'] == "string" ? value[i][allBindings['optionsValue']] : value[i];
                  optionValue = ko.utils.unwrapObservable(optionValue);
                  ko.selectExtensions.writeValue(option, optionValue);
                  
                  // Apply some text to the option element
                  var optionsTextValue = allBindings['optionsText'];
                  var optionText;
                  if (typeof optionsTextValue == "function")
                      optionText = optionsTextValue(value[i]); // Given a function; run it against the data value
                  else if (typeof optionsTextValue == "string")
                      optionText = value[i][optionsTextValue]; // Given a string; treat it as a property name on the data value
                  else
                      optionText = optionValue;				 // Given no optionsText arg; use the data value itself
                  if ((optionText === null) || (optionText === undefined))
                      optionText = "";                                    
  
                  ko.utils.setTextContent(option, optionText);
  
                  element.appendChild(option);
              }
  
              // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
              // That's why we first added them without selection. Now it's time to set the selection.
              var newOptions = element.getElementsByTagName("OPTION");
              var countSelectionsRetained = 0;
              for (var i = 0, j = newOptions.length; i < j; i++) {
                  if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                      ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                      countSelectionsRetained++;
                  }
              }
              
              if (previousScrollTop)
                  element.scrollTop = previousScrollTop;
  
              if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                  // Ensure consistency between model value and selected option.
                  // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                  // the dropdown selection state is meaningless, so we preserve the model value.
                  ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.unwrapObservable(allBindings['value']), /* preferModelValue */ true);
              }
          }
      }
  };
  ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';
  
  ko.bindingHandlers['selectedOptions'] = {
      getSelectedValuesFromSelectNode: function (selectNode) {
          var result = [];
          var nodes = selectNode.childNodes;
          for (var i = 0, j = nodes.length; i < j; i++) {
              var node = nodes[i];
              if ((node.tagName == "OPTION") && node.selected)
                  result.push(ko.selectExtensions.readValue(node));
          }
          return result;
      },
      'init': function (element, valueAccessor, allBindingsAccessor) {
          ko.utils.registerEventHandler(element, "change", function () { 
              var value = valueAccessor();
              if (ko.isWriteableObservable(value))
                  value(ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this));
              else {
                  var allBindings = allBindingsAccessor();
                  if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['value'])
                      allBindings['_ko_property_writers']['value'](ko.bindingHandlers['selectedOptions'].getSelectedValuesFromSelectNode(this));
              }
          });    	
      },
      'update': function (element, valueAccessor) {
          if (element.tagName != "SELECT")
              throw new Error("values binding applies only to SELECT elements");
  
          var newValue = ko.utils.unwrapObservable(valueAccessor());
          if (newValue && typeof newValue.length == "number") {
              var nodes = element.childNodes;
              for (var i = 0, j = nodes.length; i < j; i++) {
                  var node = nodes[i];
                  if (node.tagName == "OPTION")
                      ko.utils.setOptionNodeSelectionState(node, ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0);
              }
          }
      }
  };
  
  ko.bindingHandlers['text'] = {
      'update': function (element, valueAccessor) {
          ko.utils.setTextContent(element, valueAccessor());
      }
  };
  
  ko.bindingHandlers['html'] = {
      'init': function() {
          // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
          return { 'controlsDescendantBindings': true };
      },
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor());
          ko.utils.setHtml(element, value);
      }
  };
  
  ko.bindingHandlers['css'] = {
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor() || {});
          for (var className in value) {
              if (typeof className == "string") {
                  var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                  ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
              }
          }
      }
  };
  
  ko.bindingHandlers['style'] = {
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor() || {});
          for (var styleName in value) {
              if (typeof styleName == "string") {
                  var styleValue = ko.utils.unwrapObservable(value[styleName]);
                  element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
              }
          }
      }
  };
  
  ko.bindingHandlers['uniqueName'] = {
      'init': function (element, valueAccessor) {
          if (valueAccessor()) {
              element.name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
  
              // Workaround IE 6/7 issue
              // - https://github.com/SteveSanderson/knockout/issues/197
              // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
              if (ko.utils.isIe6 || ko.utils.isIe7)
                  element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
          }
      }
  };
  ko.bindingHandlers['uniqueName'].currentIndex = 0;
  
  ko.bindingHandlers['checked'] = {
      'init': function (element, valueAccessor, allBindingsAccessor) {
          var updateHandler = function() {            
              var valueToWrite;
              if (element.type == "checkbox") {
                  valueToWrite = element.checked;
              } else if ((element.type == "radio") && (element.checked)) {
                  valueToWrite = element.value;
              } else {
                  return; // "checked" binding only responds to checkboxes and selected radio buttons
              }
              
              var modelValue = valueAccessor();                 
              if ((element.type == "checkbox") && (ko.utils.unwrapObservable(modelValue) instanceof Array)) {
                  // For checkboxes bound to an array, we add/remove the checkbox value to that array
                  // This works for both observable and non-observable arrays
                  var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.unwrapObservable(modelValue), element.value);
                  if (element.checked && (existingEntryIndex < 0))
                      modelValue.push(element.value);
                  else if ((!element.checked) && (existingEntryIndex >= 0))
                      modelValue.splice(existingEntryIndex, 1);
              } else if (ko.isWriteableObservable(modelValue)) {            	
                  if (modelValue() !== valueToWrite) { // Suppress repeated events when there's nothing new to notify (some browsers raise them)
                      modelValue(valueToWrite);
                  }
              } else {
                  var allBindings = allBindingsAccessor();
                  if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['checked']) {
                      allBindings['_ko_property_writers']['checked'](valueToWrite);
                  }
              }
          };
          ko.utils.registerEventHandler(element, "click", updateHandler);
  
          // IE 6 won't allow radio buttons to be selected unless they have a name
          if ((element.type == "radio") && !element.name)
              ko.bindingHandlers['uniqueName']['init'](element, function() { return true });
      },
      'update': function (element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor());
          
          if (element.type == "checkbox") {        	
              if (value instanceof Array) {
                  // When bound to an array, the checkbox being checked represents its value being present in that array
                  element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
              } else {
                  // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                  element.checked = value;	
              }            
          } else if (element.type == "radio") {
              element.checked = (element.value == value);
          }
      }
  };
  
  ko.bindingHandlers['attr'] = {
      'update': function(element, valueAccessor, allBindingsAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor()) || {};
          for (var attrName in value) {
              if (typeof attrName == "string") {
                  var attrValue = ko.utils.unwrapObservable(value[attrName]);
                  
                  // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely 
                  // when someProp is a "no value"-like value (strictly null, false, or undefined)
                  // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)                
                  if ((attrValue === false) || (attrValue === null) || (attrValue === undefined))
                      element.removeAttribute(attrName);
                  else 
                      element.setAttribute(attrName, attrValue.toString());
              }
          }
      }
  };
  
  ko.bindingHandlers['hasfocus'] = {
      'init': function(element, valueAccessor, allBindingsAccessor) {
          var writeValue = function(valueToWrite) {
              var modelValue = valueAccessor();
              if (valueToWrite == ko.utils.unwrapObservable(modelValue))
                  return;
  
              if (ko.isWriteableObservable(modelValue))
                  modelValue(valueToWrite);
              else {
                  var allBindings = allBindingsAccessor();
                  if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers']['hasfocus']) {
                      allBindings['_ko_property_writers']['hasfocus'](valueToWrite);
                  }                
              }
          };
          ko.utils.registerEventHandler(element, "focus", function() { writeValue(true) });
          ko.utils.registerEventHandler(element, "focusin", function() { writeValue(true) }); // For IE
          ko.utils.registerEventHandler(element, "blur",  function() { writeValue(false) });
          ko.utils.registerEventHandler(element, "focusout",  function() { writeValue(false) }); // For IE
      },
      'update': function(element, valueAccessor) {
          var value = ko.utils.unwrapObservable(valueAccessor());
          value ? element.focus() : element.blur();
          ko.utils.triggerEvent(element, value ? "focusin" : "focusout"); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
      }
  };
  
  // "with: someExpression" is equivalent to "template: { if: someExpression, data: someExpression }"
  ko.bindingHandlers['with'] = {
      makeTemplateValueAccessor: function(valueAccessor) {
          return function() { var value = valueAccessor(); return { 'if': value, 'data': value, 'templateEngine': ko.nativeTemplateEngine.instance } };
      },
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor));
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['with'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
      }
  };
  ko.jsonExpressionRewriting.bindingRewriteValidators['with'] = false; // Can't rewrite control flow bindings
  ko.virtualElements.allowedBindings['with'] = true;
  
  // "if: someExpression" is equivalent to "template: { if: someExpression }"
  ko.bindingHandlers['if'] = {
      makeTemplateValueAccessor: function(valueAccessor) {
          return function() { return { 'if': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
      },	
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor));
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['if'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
      }
  };
  ko.jsonExpressionRewriting.bindingRewriteValidators['if'] = false; // Can't rewrite control flow bindings
  ko.virtualElements.allowedBindings['if'] = true;
  
  // "ifnot: someExpression" is equivalent to "template: { ifnot: someExpression }"
  ko.bindingHandlers['ifnot'] = {
      makeTemplateValueAccessor: function(valueAccessor) {
          return function() { return { 'ifnot': valueAccessor(), 'templateEngine': ko.nativeTemplateEngine.instance } };
      },	
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor));
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['ifnot'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
      }
  };
  ko.jsonExpressionRewriting.bindingRewriteValidators['ifnot'] = false; // Can't rewrite control flow bindings
  ko.virtualElements.allowedBindings['ifnot'] = true;
  
  // "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
  // "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
  ko.bindingHandlers['foreach'] = {
      makeTemplateValueAccessor: function(valueAccessor) {
          return function() { 
              var bindingValue = ko.utils.unwrapObservable(valueAccessor());
              
              // If bindingValue is the array, just pass it on its own
              if ((!bindingValue) || typeof bindingValue.length == "number")
                  return { 'foreach': bindingValue, 'templateEngine': ko.nativeTemplateEngine.instance };
              
              // If bindingValue.data is the array, preserve all relevant options
              return { 
                  'foreach': bindingValue['data'], 
                  'includeDestroyed': bindingValue['includeDestroyed'],
                  'afterAdd': bindingValue['afterAdd'],
                  'beforeRemove': bindingValue['beforeRemove'], 
                  'afterRender': bindingValue['afterRender'],
                  'templateEngine': ko.nativeTemplateEngine.instance
              };
          };
      },
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {		
          return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
          return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
      }
  };
  ko.jsonExpressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
  ko.virtualElements.allowedBindings['foreach'] = true;
  ko.exportSymbol('ko.allowedVirtualElementBindings', ko.virtualElements.allowedBindings);// If you want to make a custom template engine,
  // 
  // [1] Inherit from this class (like ko.nativeTemplateEngine does)
  // [2] Override 'renderTemplateSource', supplying a function with this signature:
  //
  //        function (templateSource, bindingContext, options) {
  //            // - templateSource.text() is the text of the template you should render
  //            // - bindingContext.$data is the data you should pass into the template
  //            //   - you might also want to make bindingContext.$parent, bindingContext.$parents, 
  //            //     and bindingContext.$root available in the template too
  //            // - options gives you access to any other properties set on "data-bind: { template: options }"
  //            //
  //            // Return value: an array of DOM nodes
  //        }
  //
  // [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
  //
  //        function (script) {
  //            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
  //            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }' 
  //        }
  //
  //     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
  //     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
  //     and then you don't need to override 'createJavaScriptEvaluatorBlock'.
  
  ko.templateEngine = function () { };
  
  ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
      throw "Override renderTemplateSource";
  };
  
  ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
      throw "Override createJavaScriptEvaluatorBlock";
  };
  
  ko.templateEngine.prototype['makeTemplateSource'] = function(template) {
      // Named template
      if (typeof template == "string") {
          var elem = document.getElementById(template);
          if (!elem)
              throw new Error("Cannot find template with ID " + template);
          return new ko.templateSources.domElement(elem);
      } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
          // Anonymous template
          return new ko.templateSources.anonymousTemplate(template);
      } else
          throw new Error("Unknown template type: " + template);
  };
  
  ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options) {
      var templateSource = this['makeTemplateSource'](template);
      return this['renderTemplateSource'](templateSource, bindingContext, options);
  };
  
  ko.templateEngine.prototype['isTemplateRewritten'] = function (template) {
      // Skip rewriting if requested
      if (this['allowTemplateRewriting'] === false)
          return true;
      
      // Perf optimisation - see below
      if (this.knownRewrittenTemplates && this.knownRewrittenTemplates[template])
          return true;
      
      return this['makeTemplateSource'](template)['data']("isRewritten");
  };
  
  ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback) {
      var templateSource = this['makeTemplateSource'](template);          
      var rewritten = rewriterCallback(templateSource['text']());
      templateSource['text'](rewritten);
      templateSource['data']("isRewritten", true);
      
      // Perf optimisation - for named templates, track which ones have been rewritten so we can
      // answer 'isTemplateRewritten' *without* having to use getElementById (which is slow on IE < 8)
      if (typeof template == "string") {
          this.knownRewrittenTemplates = this.knownRewrittenTemplates || {};
          this.knownRewrittenTemplates[template] = true;            
      }
  };
  
  ko.exportSymbol('ko.templateEngine', ko.templateEngine);
  ko.templateRewriting = (function () {
      var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
      var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;
  
      function validateDataBindValuesForRewriting(keyValueArray) {
          var allValidators = ko.jsonExpressionRewriting.bindingRewriteValidators;
          for (var i = 0; i < keyValueArray.length; i++) {
              var key = keyValueArray[i]['key'];
              if (allValidators.hasOwnProperty(key)) {
                  var validator = allValidators[key];    
  
                  if (typeof validator === "function") {
                      var possibleErrorMessage = validator(keyValueArray[i]['value']);
                      if (possibleErrorMessage)
                          throw new Error(possibleErrorMessage);
                  } else if (!validator) {
                      throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                  }                
              }
          }
      }
  
      function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
          var dataBindKeyValueArray = ko.jsonExpressionRewriting.parseObjectLiteral(dataBindAttributeValue);
          validateDataBindValuesForRewriting(dataBindKeyValueArray);
          var rewrittenDataBindAttributeValue = ko.jsonExpressionRewriting.insertPropertyAccessorsIntoJson(dataBindKeyValueArray);
  
          // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional 
          // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this 
          // extra indirection.
          var applyBindingsToNextSiblingScript = "ko.templateRewriting.applyMemoizedBindingsToNextSibling(function() { \
              return (function() { return { " + rewrittenDataBindAttributeValue + " } })() \
          })";
          return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;        
      }
  
      return {
          ensureTemplateIsRewritten: function (template, templateEngine) {
              if (!templateEngine['isTemplateRewritten'](template))
                  templateEngine['rewriteTemplate'](template, function (htmlString) {
                      return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                  });
          },
  
          memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
              return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                  return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
              }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                  return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);              
              });
          },
  
          applyMemoizedBindingsToNextSibling: function (bindings) {
              return ko.memoization.memoize(function (domNode, bindingContext) {
                  if (domNode.nextSibling)
                      ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
              });
          }
      }
  })();
  
  ko.exportSymbol('ko.templateRewriting', ko.templateRewriting);
  ko.exportSymbol('ko.templateRewriting.applyMemoizedBindingsToNextSibling', ko.templateRewriting.applyMemoizedBindingsToNextSibling); // Exported only because it has to be referenced by string lookup from within rewritten template
  (function() { 
      // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
      // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
      //
      // Two are provided by default:
      //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
      //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but 
      //                                           without reading/writing the actual element text content, since it will be overwritten
      //                                           with the rendered template output.
      // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
      // Template sources need to have the following functions:
      //   text() 			- returns the template text from your storage location
      //   text(value)		- writes the supplied template text to your storage location
      //   data(key)			- reads values stored using data(key, value) - see below
      //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
      //
      // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
      // using and overriding "makeTemplateSource" to return an instance of your custom template source.
      
      ko.templateSources = {};
      
      // ---- ko.templateSources.domElement -----
      
      ko.templateSources.domElement = function(element) {
          this.domElement = element;
      }
      
      ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
          if (arguments.length == 0) {
              return this.domElement.tagName.toLowerCase() == "script" ? this.domElement.text : this.domElement.innerHTML;
          } else {
              var valueToWrite = arguments[0];
              if (this.domElement.tagName.toLowerCase() == "script")
                  this.domElement.text = valueToWrite;
              else
                  ko.utils.setHtml(this.domElement, valueToWrite);
          }
      };
      
      ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
          if (arguments.length === 1) {
              return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
          } else {
              ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
          }
      };
      
      // ---- ko.templateSources.anonymousTemplate -----
      
      var anonymousTemplatesDomDataKey = "__ko_anon_template__";
      ko.templateSources.anonymousTemplate = function(element) {		
          this.domElement = element;
      }
      ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
      ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
          if (arguments.length == 0) {
              return ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey);
          } else {
              var valueToWrite = arguments[0];
              ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, valueToWrite);
          }
      };
      
      ko.exportSymbol('ko.templateSources', ko.templateSources);
      ko.exportSymbol('ko.templateSources.domElement', ko.templateSources.domElement);
      ko.exportSymbol('ko.templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
  })();
  (function () {
      var _templateEngine;
      ko.setTemplateEngine = function (templateEngine) {
          if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
              throw "templateEngine must inherit from ko.templateEngine";
          _templateEngine = templateEngine;
      }
  
      function invokeForEachNodeOrCommentInParent(nodeArray, parent, action) {
          for (var i = 0; node = nodeArray[i]; i++) {
              if (node.parentNode !== parent) // Skip anything that has been removed during binding
                  continue;
              if ((node.nodeType === 1) || (node.nodeType === 8))
                  action(node);
          }        
      }
  
      ko.activateBindingsOnTemplateRenderedNodes = function(nodeArray, bindingContext) {
          // To be used on any nodes that have been rendered by a template and have been inserted into some parent element. 
          // Safely iterates through nodeArray (being tolerant of any changes made to it during binding, e.g., 
          // if a binding inserts siblings), and for each:
          // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
          // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)
  
          var nodeArrayClone = ko.utils.arrayPushAll([], nodeArray); // So we can tolerate insertions/deletions during binding
          var commonParentElement = (nodeArray.length > 0) ? nodeArray[0].parentNode : null; // All items must be in the same parent, so this is OK
          
          // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
          // whereas a regular applyBindings won't introduce new memoized nodes
          
          invokeForEachNodeOrCommentInParent(nodeArrayClone, commonParentElement, function(node) {
              ko.applyBindings(bindingContext, node);
          });
          invokeForEachNodeOrCommentInParent(nodeArrayClone, commonParentElement, function(node) {
              ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);            
          });        
      }
  
      function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
          return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                          : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                          : null;
      }
  
      function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
          options = options || {};
          var templateEngineToUse = (options['templateEngine'] || _templateEngine);
          ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse);
          var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options);
  
          // Loosely check result is an array of DOM nodes
          if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
              throw "Template engine must return an array of DOM nodes";
  
          var haveAddedNodesToParent = false;
          switch (renderMode) {
              case "replaceChildren": 
                  ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray); 
                  haveAddedNodesToParent = true;
                  break;
              case "replaceNode": 
                  ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray); 
                  haveAddedNodesToParent = true;
                  break;
              case "ignoreTargetNode": break;
              default: 
                  throw new Error("Unknown renderMode: " + renderMode);
          }
  
          if (haveAddedNodesToParent) {
              ko.activateBindingsOnTemplateRenderedNodes(renderedNodesArray, bindingContext);
              if (options['afterRender'])
                  options['afterRender'](renderedNodesArray, bindingContext['$data']);            
          }
  
          return renderedNodesArray;
      }
  
      ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
          options = options || {};
          if ((options['templateEngine'] || _templateEngine) == undefined)
              throw "Set a template engine before calling renderTemplate";
          renderMode = renderMode || "replaceChildren";
  
          if (targetNodeOrNodeArray) {
              var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
              
              var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
              var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;
              
              return new ko.dependentObservable( // So the DOM is automatically updated when any dependency changes                
                  function () {
                      // Ensure we've got a proper binding context to work with
                      var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                          ? dataOrBindingContext
                          : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));
  
                      // Support selecting template as a function of the data being rendered
                      var templateName = typeof(template) == 'function' ? template(bindingContext['$data']) : template; 
  
                      var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                      if (renderMode == "replaceNode") {
                          targetNodeOrNodeArray = renderedNodesArray;
                          firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                      }
                  },
                  null,
                  { 'disposeWhen': whenToDispose, 'disposeWhenNodeIsRemoved': activelyDisposeWhenNodeIsRemoved }
              );
          } else {
              // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
              return ko.memoization.memoize(function (domNode) {
                  ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
              });
          }
      };
  
      ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {   
          var createInnerBindingContext = function(arrayValue) {
              return parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue));
          };
  
          // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
          var activateBindingsCallback = function(arrayValue, addedNodesArray) {
              var bindingContext = createInnerBindingContext(arrayValue);
              ko.activateBindingsOnTemplateRenderedNodes(addedNodesArray, bindingContext);
              if (options['afterRender'])
                  options['afterRender'](addedNodesArray, bindingContext['$data']);                                                
          };
           
          return new ko.dependentObservable(function () {
              var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
              if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                  unwrappedArray = [unwrappedArray];
  
              // Filter out any entries marked as destroyed
              var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                  return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
              });
  
              ko.utils.setDomNodeChildrenFromArrayMapping(targetNode, filteredArray, function (arrayValue) {
                  // Support selecting template as a function of the data being rendered
                  var templateName = typeof(template) == 'function' ? template(arrayValue) : template;
                  return executeTemplate(null, "ignoreTargetNode", templateName, createInnerBindingContext(arrayValue), options);
              }, options, activateBindingsCallback);
              
          }, null, { 'disposeWhenNodeIsRemoved': targetNode });
      };
  
      var templateSubscriptionDomDataKey = '__ko__templateSubscriptionDomDataKey__';
      function disposeOldSubscriptionAndStoreNewOne(element, newSubscription) {
          var oldSubscription = ko.utils.domData.get(element, templateSubscriptionDomDataKey);
          if (oldSubscription && (typeof(oldSubscription.dispose) == 'function'))
              oldSubscription.dispose();
          ko.utils.domData.set(element, templateSubscriptionDomDataKey, newSubscription);
      }
      
      ko.bindingHandlers['template'] = {
          'init': function(element, valueAccessor) {
              // Support anonymous templates
              var bindingValue = ko.utils.unwrapObservable(valueAccessor());
              if ((typeof bindingValue != "string") && (!bindingValue.name) && (element.nodeType == 1)) {
                  // It's an anonymous template - store the element contents, then clear the element
                  new ko.templateSources.anonymousTemplate(element).text(element.innerHTML);
                  ko.utils.emptyDomNode(element);
              }
              return { 'controlsDescendantBindings': true };
          },
          'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
              var bindingValue = ko.utils.unwrapObservable(valueAccessor());
              var templateName; 
              var shouldDisplay = true;
              
              if (typeof bindingValue == "string") {
                  templateName = bindingValue;
              } else {
                  templateName = bindingValue.name;
                  
                  // Support "if"/"ifnot" conditions
                  if ('if' in bindingValue)
                      shouldDisplay = shouldDisplay && ko.utils.unwrapObservable(bindingValue['if']);
                  if ('ifnot' in bindingValue)
                      shouldDisplay = shouldDisplay && !ko.utils.unwrapObservable(bindingValue['ifnot']);
              }    
              
              var templateSubscription = null;
              
              if ((typeof bindingValue === 'object') && ('foreach' in bindingValue)) { // Note: can't use 'in' operator on strings
                  // Render once for each data point (treating data set as empty if shouldDisplay==false)
                  var dataArray = (shouldDisplay && bindingValue['foreach']) || [];
                  templateSubscription = ko.renderTemplateForEach(templateName || element, dataArray, /* options: */ bindingValue, element, bindingContext);
              } else {
                  if (shouldDisplay) {
                      // Render once for this single data point (or use the viewModel if no data was provided)
                      var innerBindingContext = (typeof bindingValue == 'object') && ('data' in bindingValue)
                          ? bindingContext['createChildContext'](ko.utils.unwrapObservable(bindingValue['data'])) // Given an explitit 'data' value, we create a child binding context for it
                          : bindingContext;                                                                       // Given no explicit 'data' value, we retain the same binding context
                      templateSubscription = ko.renderTemplate(templateName || element, innerBindingContext, /* options: */ bindingValue, element);
                  } else
                      ko.virtualElements.emptyNode(element);
              }
              
              // It only makes sense to have a single template subscription per element (otherwise which one should have its output displayed?)
              disposeOldSubscriptionAndStoreNewOne(element, templateSubscription);
          }
      };
  
      // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
      ko.jsonExpressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
          var parsedBindingValue = ko.jsonExpressionRewriting.parseObjectLiteral(bindingValue);
  
          if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
              return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)
  
          if (ko.jsonExpressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
              return null; // Named templates can be rewritten, so return "no error"
          return "This template engine does not support anonymous templates nested within its templates";
      };
  
      ko.virtualElements.allowedBindings['template'] = true;
  })();
  
  ko.exportSymbol('ko.setTemplateEngine', ko.setTemplateEngine);
  ko.exportSymbol('ko.renderTemplate', ko.renderTemplate);
  (function () {
      // Simple calculation based on Levenshtein distance.
      function calculateEditDistanceMatrix(oldArray, newArray, maxAllowedDistance) {
          var distances = [];
          for (var i = 0; i <= newArray.length; i++)
              distances[i] = [];
  
          // Top row - transform old array into empty array via deletions
          for (var i = 0, j = Math.min(oldArray.length, maxAllowedDistance); i <= j; i++)
              distances[0][i] = i;
  
          // Left row - transform empty array into new array via additions
          for (var i = 1, j = Math.min(newArray.length, maxAllowedDistance); i <= j; i++) {
              distances[i][0] = i;
          }
  
          // Fill out the body of the array
          var oldIndex, oldIndexMax = oldArray.length, newIndex, newIndexMax = newArray.length;
          var distanceViaAddition, distanceViaDeletion;
          for (oldIndex = 1; oldIndex <= oldIndexMax; oldIndex++) {
              var newIndexMinForRow = Math.max(1, oldIndex - maxAllowedDistance);
              var newIndexMaxForRow = Math.min(newIndexMax, oldIndex + maxAllowedDistance);
              for (newIndex = newIndexMinForRow; newIndex <= newIndexMaxForRow; newIndex++) {
                  if (oldArray[oldIndex - 1] === newArray[newIndex - 1])
                      distances[newIndex][oldIndex] = distances[newIndex - 1][oldIndex - 1];
                  else {
                      var northDistance = distances[newIndex - 1][oldIndex] === undefined ? Number.MAX_VALUE : distances[newIndex - 1][oldIndex] + 1;
                      var westDistance = distances[newIndex][oldIndex - 1] === undefined ? Number.MAX_VALUE : distances[newIndex][oldIndex - 1] + 1;
                      distances[newIndex][oldIndex] = Math.min(northDistance, westDistance);
                  }
              }
          }
  
          return distances;
      }
  
      function findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray) {
          var oldIndex = oldArray.length;
          var newIndex = newArray.length;
          var editScript = [];
          var maxDistance = editDistanceMatrix[newIndex][oldIndex];
          if (maxDistance === undefined)
              return null; // maxAllowedDistance must be too small
          while ((oldIndex > 0) || (newIndex > 0)) {
              var me = editDistanceMatrix[newIndex][oldIndex];
              var distanceViaAdd = (newIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex] : maxDistance + 1;
              var distanceViaDelete = (oldIndex > 0) ? editDistanceMatrix[newIndex][oldIndex - 1] : maxDistance + 1;
              var distanceViaRetain = (newIndex > 0) && (oldIndex > 0) ? editDistanceMatrix[newIndex - 1][oldIndex - 1] : maxDistance + 1;
              if ((distanceViaAdd === undefined) || (distanceViaAdd < me - 1)) distanceViaAdd = maxDistance + 1;
              if ((distanceViaDelete === undefined) || (distanceViaDelete < me - 1)) distanceViaDelete = maxDistance + 1;
              if (distanceViaRetain < me - 1) distanceViaRetain = maxDistance + 1;
  
              if ((distanceViaAdd <= distanceViaDelete) && (distanceViaAdd < distanceViaRetain)) {
                  editScript.push({ status: "added", value: newArray[newIndex - 1] });
                  newIndex--;
              } else if ((distanceViaDelete < distanceViaAdd) && (distanceViaDelete < distanceViaRetain)) {
                  editScript.push({ status: "deleted", value: oldArray[oldIndex - 1] });
                  oldIndex--;
              } else {
                  editScript.push({ status: "retained", value: oldArray[oldIndex - 1] });
                  newIndex--;
                  oldIndex--;
              }
          }
          return editScript.reverse();
      }
  
      ko.utils.compareArrays = function (oldArray, newArray, maxEditsToConsider) {
          if (maxEditsToConsider === undefined) {
              return ko.utils.compareArrays(oldArray, newArray, 1)                 // First consider likely case where there is at most one edit (very fast)
                  || ko.utils.compareArrays(oldArray, newArray, 10)                // If that fails, account for a fair number of changes while still being fast
                  || ko.utils.compareArrays(oldArray, newArray, Number.MAX_VALUE); // Ultimately give the right answer, even though it may take a long time
          } else {
              oldArray = oldArray || [];
              newArray = newArray || [];
              var editDistanceMatrix = calculateEditDistanceMatrix(oldArray, newArray, maxEditsToConsider);
              return findEditScriptFromEditDistanceMatrix(editDistanceMatrix, oldArray, newArray);
          }
      };    
  })();
  
  ko.exportSymbol('ko.utils.compareArrays', ko.utils.compareArrays);
  
  (function () {
      // Objective:
      // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
      //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
      // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
      //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
      //   previously mapped - retain those nodes, and just insert/delete other ones
  
      // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
      // You can use this, for example, to activate bindings on those nodes.
  
      function fixUpVirtualElements(contiguousNodeArray) {
          // Ensures that contiguousNodeArray really *is* an array of contiguous siblings, even if some of the interior
          // ones have changed since your array was first built (e.g., because your array contains virtual elements, and
          // their virtual children changed when binding was applied to them).
          // This is needed so that we can reliably remove or update the nodes corresponding to a given array item
  
          if (contiguousNodeArray.length > 2) {
              // Build up the actual new contiguous node set
              var current = contiguousNodeArray[0], last = contiguousNodeArray[contiguousNodeArray.length - 1], newContiguousSet = [current];
              while (current !== last) {
                  current = current.nextSibling;
                  if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                      return;
                  newContiguousSet.push(current);
              }
  
              // ... then mutate the input array to match this. 
              // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
              Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
          }
      }
  
      function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes) {
          // Map this array value inside a dependentObservable so we re-map when any dependency changes
          var mappedNodes = [];
          var dependentObservable = ko.dependentObservable(function() {
              var newMappedNodes = mapping(valueToMap) || [];
              
              // On subsequent evaluations, just replace the previously-inserted DOM nodes
              if (mappedNodes.length > 0) {
                  fixUpVirtualElements(mappedNodes);
                  ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                  if (callbackAfterAddingNodes)
                      callbackAfterAddingNodes(valueToMap, newMappedNodes);
              }
              
              // Replace the contents of the mappedNodes array, thereby updating the record
              // of which nodes would be deleted if valueToMap was itself later removed
              mappedNodes.splice(0, mappedNodes.length);
              ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
          }, null, { 'disposeWhenNodeIsRemoved': containerNode, 'disposeWhen': function() { return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0]) } });
          return { mappedNodes : mappedNodes, dependentObservable : dependentObservable };
      }
      
      var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";
  
      ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
          // Compare the provided array against the previous one
          array = array || [];
          options = options || {};
          var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
          var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
          var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
          var editScript = ko.utils.compareArrays(lastArray, array);
  
          // Build the new mapping result
          var newMappingResult = [];
          var lastMappingResultIndex = 0;
          var nodesToDelete = [];
          var nodesAdded = [];
          var insertAfterNode = null;
          for (var i = 0, j = editScript.length; i < j; i++) {
              switch (editScript[i].status) {
                  case "retained":
                      // Just keep the information - don't touch the nodes
                      var dataToRetain = lastMappingResult[lastMappingResultIndex];
                      newMappingResult.push(dataToRetain);
                      if (dataToRetain.domNodes.length > 0)
                          insertAfterNode = dataToRetain.domNodes[dataToRetain.domNodes.length - 1];
                      lastMappingResultIndex++;
                      break;
  
                  case "deleted":
                      // Stop tracking changes to the mapping for these nodes
                      lastMappingResult[lastMappingResultIndex].dependentObservable.dispose();
                  
                      // Queue these nodes for later removal
                      fixUpVirtualElements(lastMappingResult[lastMappingResultIndex].domNodes);
                      ko.utils.arrayForEach(lastMappingResult[lastMappingResultIndex].domNodes, function (node) {
                          nodesToDelete.push({
                            element: node,
                            index: i,
                            value: editScript[i].value
                          });
                          insertAfterNode = node;
                      });
                      lastMappingResultIndex++;
                      break;
  
                  case "added": 
                      var valueToMap = editScript[i].value;
                      var mapData = mapNodeAndRefreshWhenChanged(domNode, mapping, valueToMap, callbackAfterAddingNodes);
                      var mappedNodes = mapData.mappedNodes;
                      
                      // On the first evaluation, insert the nodes at the current insertion point
                      newMappingResult.push({ arrayEntry: editScript[i].value, domNodes: mappedNodes, dependentObservable: mapData.dependentObservable });
                      for (var nodeIndex = 0, nodeIndexMax = mappedNodes.length; nodeIndex < nodeIndexMax; nodeIndex++) {
                          var node = mappedNodes[nodeIndex];
                          nodesAdded.push({
                            element: node,
                            index: i,
                            value: editScript[i].value
                          });
                          if (insertAfterNode == null) {
                              // Insert "node" (the newly-created node) as domNode's first child
                              ko.virtualElements.prepend(domNode, node);
                          } else {
                              // Insert "node" into "domNode" immediately after "insertAfterNode"
                              ko.virtualElements.insertAfter(domNode, node, insertAfterNode);
                          }
                          insertAfterNode = node;
                      } 
                      if (callbackAfterAddingNodes)
                          callbackAfterAddingNodes(valueToMap, mappedNodes);
                      break;
              }
          }
          
          ko.utils.arrayForEach(nodesToDelete, function (node) { ko.cleanNode(node.element) });
  
          var invokedBeforeRemoveCallback = false;
          if (!isFirstExecution) {
              if (options['afterAdd']) {
                  for (var i = 0; i < nodesAdded.length; i++)
                      options['afterAdd'](nodesAdded[i].element, nodesAdded[i].index, nodesAdded[i].value);
              }
              if (options['beforeRemove']) {
                  for (var i = 0; i < nodesToDelete.length; i++)
                      options['beforeRemove'](nodesToDelete[i].element, nodesToDelete[i].index, nodesToDelete[i].value);
                  invokedBeforeRemoveCallback = true;
              }
          }
          if (!invokedBeforeRemoveCallback)
              ko.utils.arrayForEach(nodesToDelete, function (node) {
                  ko.removeNode(node.element);
              });
  
          // Store a copy of the array items we just considered so we can difference it next time
          ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
      }
  })();
  
  ko.exportSymbol('ko.utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
  ko.nativeTemplateEngine = function () {
      this['allowTemplateRewriting'] = false;
  }
  
  ko.nativeTemplateEngine.prototype = new ko.templateEngine();
  ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
      var templateText = templateSource.text();
      return ko.utils.parseHtmlFragment(templateText);
  };
  
  ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
  ko.setTemplateEngine(ko.nativeTemplateEngine.instance);
  
  ko.exportSymbol('ko.nativeTemplateEngine', ko.nativeTemplateEngine);(function() {
      ko.jqueryTmplTemplateEngine = function () {
          // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl 
          // doesn't expose a version number, so we have to infer it.
          // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
          // which KO internally refers to as version "2", so older versions are no longer detected.
          var jQueryTmplVersion = this.jQueryTmplVersion = (function() {      
              if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
                  return 0;
              // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
              try {
                  if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                      // Since 1.0.0pre, custom tags should append markup to an array called "__"
                      return 2; // Final version of jquery.tmpl
                  }        	
              } catch(ex) { /* Apparently not the version we were looking for */ }
              
              return 1; // Any older version that we don't support
          })();
          
          function ensureHasReferencedJQueryTemplates() {
              if (jQueryTmplVersion < 2)
                  throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
          }
  
          function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
              return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
          }
          
          this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
              options = options || {};
              ensureHasReferencedJQueryTemplates();
              
              // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
              var precompiled = templateSource['data']('precompiled');
              if (!precompiled) {
                  var templateText = templateSource.text() || "";
                  // Wrap in "with($whatever.koBindingContext) { ... }"
                  templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";
  
                  precompiled = jQuery['template'](null, templateText);
                  templateSource['data']('precompiled', precompiled);
              }
              
              var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
              var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);
  
              var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
              resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work
              jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
              return resultNodes;     		
          };
          
          this['createJavaScriptEvaluatorBlock'] = function(script) {
              return "{{ko_code ((function() { return " + script + " })()) }}";
          };
          
          this['addTemplate'] = function(templateName, templateMarkup) {
              document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
          };
      
          if (jQueryTmplVersion > 0) {
              jQuery['tmpl']['tag']['ko_code'] = {
                  open: "__.push($1 || '');"
              };
              jQuery['tmpl']['tag']['ko_with'] = {
                  open: "with($1) {",
                  close: "} "
              };
          }
      };
      
      ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
      
      // Use this one by default *only if jquery.tmpl is referenced*
      var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
      if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
          ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);
      
      ko.exportSymbol('ko.jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
  })();})(window);
  
  module.exports = window["ko"];

  provide("knockoutify", module.exports);

  $.ender(module.exports);

}());