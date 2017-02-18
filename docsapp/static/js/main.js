(function() {

  var breaker = {};

  var ArrayProto = Array.prototype,
      ObjProto = Object.prototype,
      FuncProto = Function.prototype;
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  _.closer = function(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  } 

  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  _.identity = function(value) {
    return value;
  };

  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    _.each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  _.find = _.detect = function(obj, predicate, context) {
    var result;
    _.some(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    _.each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    _.each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };


  window._ = _;
}());

(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {
  this.el = el;
  var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    push.call(this, classes[i]);
  }
};

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    this.el.className = this.toString();
  },
  contains: function(token) {
    return Array.prototype.indexOf.call(this, token) != -1;
    // return this.el.className.indexOf(token) != -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    if (!this.contains(token)) return;
    for (var i = 0; i < this.length; i++) {
      if (this[i] == token) break;
    }
    splice.call(this, i, 1);
    this.el.className = this.toString();
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();


;(function(root) {
  "use strict";

  var defheaders = {
    'x-requested-with': 'xmlhttprequest',
    'accept': 'application/json',
    'accept-language': 'en-US',
    'content-type': 'application/json'
  };

  function ajax(method, url, options) {
    if (!(this instanceof ajax)) return new ajax(method, url, options);
    this.init.apply(this, arguments);
    return this;
  }

  _.each(['GET', 'PUT', 'POST','DEL'], function(method) { 
    var smethod = method.toLowerCase();
    ajax[smethod] = function(url, options) {
      if (typeof url !== 'string') {
        options = url;
        url = root.location.pathname;
      }
      return ajax(method, url, options);
    }
  });

  _.extend(ajax.prototype, {
    init: function(method, url, options) {
      options = options || {};
      this.doneFn = (typeof options.ondone === 'function') ? options.ondone : (function(){}); 
      
      this.req = {};
      this.req.method = (method === 'DEL') ? 'DELETE' : method;
      this.req.url = url;
      this.req.headers = _.extend({}, defheaders, (options.headers ? options.headers : {}));

      this.res = {};
      this.res.req = this.req;
    },

    set: function(key, val) {
      this.req.headers[key.toLowerCase()] = val;
      return this;
    },

    send: function(val) {
      this.req.data = val;
      return this;
    },

    end: function(callback) {
      var that = this;
      var req = that.req;
      var res = that.res;

      var xhr = new XMLHttpRequest();
      xhr.open(req.method, req.url, true);
      req.xhr = res.xhr = xhr;

      _.each(req.headers, function(val, key) {
        xhr.setRequestHeader(key, val);
      })

      var data = null;
      if (typeof req.data == 'object') {
        if (req.headers['content-type'].indexOf('application/json') !== -1) {
          data = JSON.stringify(req.data);
        }
        else {
          var pairs = [];
          _.each(req.data, function(val, key) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
          });
          data = pairs.join('&');
        }
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          res.headers = {};
          var lines = xhr.getAllResponseHeaders().split("\r\n");
          _.each(lines, function(line) {
            line = line.trim();
            if (!line.length) return;
            var pair = line.split(':');
            var key = pair[0].toLowerCase().trim();
            var val = pair[1].trim();
            res.headers[key] = val;
          });
          if (req.headers['content-type']) {
            res.isJson = req.headers['content-type'].indexOf('application/json') !== -1;
            res.isHtml = req.headers['content-type'].indexOf('text/html') !== -1;
          }
          var err = null;
          if (xhr.status === 200) {
            res.body = res.isJson ? that.parse(xhr) : xhr.responseText;
          } else {
            err = new Error('failed with statusCode: ' + xhr.status);
          }
          callback && callback(err, res);
        }
      };

      xhr.send(data);
      return that;
    },

    parse: function(xhr) {
      var result;
      try {
        result = JSON.parse(xhr.responseText);
      } catch (ex) {
        result = xhr.responseText;
      }
      return result;
    },
  });

  if (typeof define == 'function' && define.amd) {
    define([], function() { return ajax });
  } else {
    root.ajax = ajax;
  }
}(window || this));

var sidebar = document.getElementById("sidebar")
var tryOut = document.getElementById("try-out")
var content = document.getElementById("content")

function highlightCode() {
  var codes = document.querySelectorAll("code");
  for (var n = 0; n < codes.length; n++)
      Prism.highlightElement(codes[n])
}


function groupOnClick(el) {
  var selGroup = sidebar.querySelector(".group.expand")
  if (selGroup && selGroup != el.parentNode) {
    selGroup.classList.remove("expand")
  }
  el.parentNode && el.parentNode.classList.add("expand")
}

function subgroupOnClick(el) {
  var selGroup = sidebar.querySelector(".group.expand")
  var newGroup = el.parentNode && el.parentNode.parentNode
  if (selGroup && selGroup != newGroup){
    selGroup.classList.remove("expand")
  }
  newGroup.classList.add("expand")

  var selEndpoint = sidebar.querySelector(".highlight")
  if (selEndpoint && selEndpoint != el) {
    selEndpoint.classList.remove('highlight')
  }
  el.classList.add("highlight")
}

function waypointHandler() {
  var navEl = sidebar.querySelector("a[href=\"#"+ this.element.id + "\"]")
  if (navEl.classList.contains("group")) {
    groupOnClick(navEl)
  } else if (navEl.classList.contains("subgroup")) {
    subgroupOnClick(navEl)
  }
}

function insertTryOutHeaders(num) {
  var headers = tryOut.querySelector('.headers-tab')
  while(num > 0) {
    var div = document.createElement('div')
    div.innerHTML = tryOut.querySelector('#row-template').innerHTML
    headers.appendChild(div.querySelector('.input-row'))
    num--
  }
}

function removeTryOutHeaders() {
  var headers = tryOut.querySelector('.headers-tab')
  var rows = headers.querySelectorAll('.input-row')
  
  for (var r = 1; r < rows.length; r++) {
    headers.removeChild(rows[r])
  }
}

function initTryout(data) {
  var httpMeta = document.getElementById("try-http-meta")
  var requestData = document.getElementById("try-request-data")

  httpMeta.elements['method'].value = data.method
  httpMeta.elements['url'].value = data.url

  if (data.requestHeaders.length > 1) {
    insertTryOutHeaders(data.requestHeaders.length - 1)
    data.requestHeaders.forEach(function(h, index) {
      requestData.elements['key'][index].value = data.requestHeaders[index]['name']
      requestData.elements['value'][index].value = data.requestHeaders[index]['value']
    })
  } else if (data.requestHeaders.length === 1) {
    requestData.elements['key'].value = data.requestHeaders[0]['name']
    requestData.elements['value'].value = data.requestHeaders[0]['value']
  }
  
}

function getHeaders() {
  var headers = tryOut.querySelector('.headers-tab')
  var rows = headers.querySelectorAll('.input-row')
  var values = []

  for (var r = 0; r < rows.length; r++) {
    if (rows[r].querySelector('input.key').value) {
      values.push({
        name: rows[r].querySelector('input.key').value,
        value: rows[r].querySelector('input.value').value,
      })
    }
  }

  return values

}

window.onload = function () {
  var toBeFetched = document.querySelectorAll(".row.not-fetched")
  for (var t = 0; t < toBeFetched.length; t++) {
    if (toBeFetched[t].id) {
      toBeFetched[t].fetchCallback = (function(el) {
        return function(err, res) {
          if (!err && res.body) {
            res.body.htmlString && (el.innerHTML = res.body.htmlString)
            var sectionData = res.body.sectionData
            if (sectionData && sectionData.id) {
              window.__ENDPOINTS[sectionData.id] = sectionData
            }
            var codes = el.querySelectorAll("code");
            for (var n = 0; n < codes.length; n++)
                Prism.highlightElement(codes[n])
          }
        }
      })(toBeFetched[t])
      ajax.get('/docs/section?type=' + toBeFetched[t].getAttribute('data-type') + '&id=' + toBeFetched[t].getAttribute('data-id')) 
          .end(toBeFetched[t].fetchCallback)
    }
  }

  highlightCode();
  sidebar.addEventListener('click', function(event) {
    event.stopPropagation()
    event.preventDefault()
    var target = event.target
    var clist = target.classList
    if (clist.contains('sidebar-nav-item') && clist.contains('expandable')) {
      var selected = sidebar.querySelector('.group.expand')
      var l = target.parentNode
      if (selected && selected !== l) {
        selected.classList.remove('expand')
      } 
      l.classList.add('expand')
    } else if (clist.contains('subgroup')) {
      subgroupOnClick(target)
    } 
  })

  window.addEventListener('hashchange', function(event) {
    event.preventDefault();
  }, false)

  var rows = document.querySelectorAll('#content section.row')
  for (var t = 0; t < rows.length; t++) {
    new Waypoint({
      continuous: false,
      context: document.getElementById('content'),
      element: rows[t],
      handler: waypointHandler
    })
  }

  tryOut.addEventListener('click', function(event) {
    event.stopPropagation()
    event.preventDefault()
    var target = event.target
    var clist = target.classList
    if (clist.contains('tab-menu-item')) {
      var tab = tryOut.querySelector('.tab')
      var selectedTab = tryOut.querySelector('.tab-menu-item.selected')
      if (selectedTab && selectedTab !== target) {
        tab.classList.remove(selectedTab.getAttribute('data-header'))
        selectedTab.classList.remove('selected')
      }
      tab.classList.add(target.getAttribute('data-header'))
      target.classList.add('selected')
    } else if (clist.contains('add-row')) {
      var headers = tryOut.querySelector('.headers-tab')
      var parentNode = target.parentNode
      var div = document.createElement('div')
      div.innerHTML = tryOut.querySelector('#row-template').innerHTML
      if (parentNode.nextSibling)
        headers.insertBefore(div.querySelector('.input-row'), parentNode.nextSibling)
      else
        headers.appendChild(div.firstChild)
    } else if (clist.contains('del-row')) {
      var headers = tryOut.querySelector('.headers-tab')
      var parentNode = target.parentNode
      headers.removeChild(parentNode)
    } else if (clist.contains('close-try-out')) {
      sidebar.classList.remove('try-out')
      var httpMeta = document.getElementById("try-http-meta")
      var requestData = document.getElementById("try-request-data")
      var responseData = document.getElementById("try-response-data")
      httpMeta.reset()
      requestData.reset()
      responseData.reset()
      removeTryOutHeaders()
    } else if (clist.contains('try-out-send')) {
      var httpMeta = document.getElementById("try-http-meta")
      var requestData = document.getElementById("try-request-data")
      var responseData = document.getElementById("try-response-data")
      var postData = {
        hostName: window.APIHOSTNAME, 
        protocol: window.APIPROTOCOL,
        method: httpMeta.elements['method'].value,
        url: httpMeta.elements['url'].value,
        requestHeaders: getHeaders()
      }
      ajax.post('/docs/tryout').send(postData) 
          .end(function(err, res) {
            console.log(err, res)
          })
    }
  })

  content.addEventListener('click', function(event) {
    event.stopPropagation()
    event.preventDefault()
    var target = event.target
    var clist = target.classList
    if (clist.contains('try-btn')) {
      var section = _.closer(target, 'row')
      var endpointData = window.__ENDPOINTS[section.getAttribute('data-id')]

      initTryout(endpointData)
      sidebar.classList.add('try-out')
    }
  })
}
