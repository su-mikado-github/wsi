/**
 *
 */
(function() {
	function namespace(ns, definer) {
		var current = window;
		if (typeof(ns) === "string") {
			var names = ns.split(".");
			for (i in names) {
				var name = names[i].trim();
				if (!name) {
					return false;
				}
				else if (typeof(current[name]) === "undefined") {
					var newNamespace = {};
					current[name] = newNamespace;
					current = newNamespace;
				}
				else {
					current = current[name];
				}
			}
		}
		else if (typeof(ns) === "object") {
			current = ns;
		}
		else {
			return false;
		}

		if (typeof(definer) === "function") {
			definer(current);
		}

		return current;
	}

	function classdef(superCtor, ctor) {
		if (ctor === undefined || ctor === null) {
			throw new TypeError('The constructor to `inherits` must not be null or undefined.');
		}

		if (superCtor === undefined || superCtor === null) {
			throw new TypeError('The super constructor to `inherits` must not be null or undefined.');
		}

		if (superCtor.prototype === undefined) {
			throw new TypeError('The super constructor to `inherits` must have a prototype.');
		}

		ctor.superCtor = superCtor;
		ctor.prototype.base = function base() {
			var base = {};
			for (var i in this) {
				base[i] = this[i];
			}
			return base;
		};
		Object.setPrototypeOf(ctor.prototype, superCtor.prototype);

		return ctor;
	}

	function findClass(className) {
		var current = window;
		if (typeof(className) === "string") {
			var names = className.split(".");
			for (i in names) {
				var name = names[i].trim();
				if (!name) {
					return false;
				}
				else if (typeof(current[name]) === "function") {
					return current[name];
				}
				else if (typeof(current[name]) === "object") {
					current = current[name];
				}
			}
		}
		else if (typeof(className) === "function") {
			current = className;
		}
		return null;
	}

	function createRequest(success, error) {
		var request = null;
		if (typeof(window.XMLHttpRequest) !== "undefined") {
			try {
				request = new XMLHttpRequest();
			}
			catch (e) {
				;
			}
		}
		else if (typeof(window.ActiveXObject) !== "undefined") {
			try {
				request = new ActiveXObject('MSXML2.XMLHTTP.6.0');
			}
			catch (e) {
				try {
					request = new ActiveXObject('MSXML2.XMLHTTP.3.0');
				}
				catch (e) {
					try {
						request = new ActiveXObject('MSXML2.XMLHTTP');
					}
					catch (e) {
						;
					}
				}
			}
		}

		if (request) {
			request.onreadystatechange = function() {
				switch (request.readyState) {
				case 4:
					if ((200 <= request.status && request.status < 300) || request.status == 304) {
						if (typeof(success) === "function") {
							success(request.status, request.responseText);
						}
					}
					else {
						if (typeof(error) === "function") {
							error(request.status);
						}
					}
				}
			}
		}
		return request;
	}

	function formatData(data) {
		if (typeof(data) === "string") {
			return data;
		}
		else if (typeof(data) === "object") {
			var result = null;
			for (var i in data) {
				var value = data[i];
				if (!result) {
//					result = (i+"="+escape(value));
					result = (i+"="+value);
				}
				else {
//					result += ("&"+i+"="+escape(value));
					result += ("&"+i+"="+value);
				}
			}
			return result;
		}
		else {
			return null;
		}
	}

	function parseQueries() {
		var result = [];
		var params = window.location.search.slice(1).split('&');
		for (var i in params) {
			var param = params[i].split("=");
			result.push(param[0]);
			result[param[0]] = param[1] || null;
		}
		return result;
	}

	var Server = classdef(Object, function Server(_url, _method, _contentType, _profiles) {
		Object.call(this);

		var _this = this;
		var _base = this.base();

		var _success = null;
		var _error = null;

		var _headers = [];

		function initRequest(request, contentType, headers) {
			if (typeof(contentType) === "string" && 0 < contentType.trim().length) {
				request.setRequestHeader("Content-Type", contentType.trim());
			}

			if (typeof(headers)==="object" && typeof(headers.length)==="number") {
				for (var i in headers) {
					request.setRequestHeader(headers[i].name, headers[i].value);
				}
			}
		}

		_this.success = function success(handler) {
			if (typeof(handler) === "undefined") {
				return _success;
			}
			else {
				_success = handler;
				return _this;
			}
		};

		_this.error = function error(handler) {
			if (typeof(handler) === "undefined") {
				return _error;
			}
			else {
				_error = handler;
				return _this;
			}
		};

		_this.header = function header(name, value) {
			if (typeof(value)==="string" && 0 < value.trim().length && name.toUpperCase() !== "CONTENT-TYPE") {
				_headers.push({ name: name, value: value.trim() });
			}
			return _this;
		};

		_this.send = function send(params) {
			var request = createRequest(_success, _error);

			var method = (typeof(_method)==="string" && 0 < _method.trim().length ? _method.trim() : "GET");
			if (method === "POST") {
				request.open(method, _url);
				if (!params) {
					initRequest(request, _contentType, _headers);
					request.send(null);
				}
				else if (typeof(params.tagName)==="string" && params.tagName.toUpperCase()==="FORM") {
					request.send(new FormData(params));
				}
				else if (typeof(params) === "string") {
					initRequest(request, _contentType, _headers);
					request.send(params);
				}
				else if (typeof(params) === "object") {
					initRequest(request, _contentType, _headers);
					request.send(formatData(params));
				}
				else {
					initRequest(request, _contentType, _headers);
					request.send(null);
				}
			}
			else {
				var queryString = formatData(params);
				request.open(method, _url + (queryString ? "?" + queryString : ""));
				initRequest(request, _contentType, _headers);
				request.send(null);
			}
		};
	});

	var Tag = classdef(Object, function Tag(tag) {
		Object.call(this);

		var _this = this;
		var _base = this.base();

		if (!tag) {
			tag = document.body;
		}
		var _tag = (typeof(tag)==="string" ? WSI.find(tag) : tag);

		_this.target = _tag;

		function substitute(eventTypeName, eventName, handler, params) {
			if (typeof(handler) === "function") {
				_this.on(eventName, handler, params || {});
			}
			else if (typeof(handler) === "object" && typeof(params) === "undefined") {
				params = handler;
				handler = undefined;
				_this.raise(eventTypeName, eventName, params);
			}
			else {
				_this.raise(eventTypeName, eventName, {});
			}
			return _this;
		}

		function setAttr(name, v) {
			if (typeof(v) === "function") {
				_tag.setAttribute(name, v());
			}
			else if (v === true) {
				_tag.setAttriuteNode(document.createAttribute(name));
			}
			else if (v === false) {
				_tag.removeAttriute(name);
			}
			else {
				_tag.setAttribute(name, v);
			}
		}

		function setProperty(name, v) {
			if (typeof(_tag[name]) !== "undefined") {
				if (typeof(v) === "function") {
					_tag[name] = v();
				}
				else {
					_tag[name] = v;
				}
			}
		}

		function setStyle(name, v) {
			if (typeof(_tag.style[name]) !== "undefined") {
				if (typeof(v) === "function") {
					_tag.style[name] = v();
				}
				else {
					_tag.style[name] = v;
				}
			}
		}

		_this.on = function on(eventName, handler, params) {
			_tag.addEventListener(eventName, function(e) { handler(e, params); });
			return _this;
		};

		_this.raise = function raise(eventTypeName, eventName, params) {
			var eventType = findClass(eventTypeName);
			if (eventType && typeof(eventType) === "function") {
				var event = new eventType(eventName);
				event.data = params;
				_tag.dispatchEvent(event);
			}
			return _this;
		};

		_this.click = function click(handler, params) { return substitute("MouseEvent", "click", handler, params); };
		_this.dblclick = function dblclick(handler, params) { return substitute("MouseEvent", "dblclick", handler, params); };
		_this.blur = function blur(handler, params) { return substitute("FocusEvent", "blur", handler, params); };
		_this.change = function change(handler, params) { return substitute("Event", "change", handler, params); };
		_this.focus = function focus(handler, params) { return substitute("FocusEvent", "focus", handler, params); };
		_this.keydown = function keydown(handler, params) { return substitute("KeyboardEvent", "keydown", handler, params); };
		_this.keypress = function keypress(handler, params) { return substitute("KeyboardEvent", "keypress", handler, params); };
		_this.keyup = function keyup(handler, params) { return substitute("KeyboardEvent", "keyup", handler, params); };
		_this.mousedown = function mousedown(handler, params) { return substitute("MouseEvent", "mousedown", handler, params); };
		_this.mousemove = function mousemove(handler, params) { return substitute("MouseEvent", "mousemove", handler, params); };
		_this.mouseout = function mouseout(handler, params) { return substitute("MouseEvent", "mouseout", handler, params); };
		_this.mouseover = function mouseover(handler, params) { return substitute("MouseEvent", "mouseover", handler, params); };
		_this.mouseup = function mouseup(handler, params) { return substitute("MouseEvent", "mouseup", handler, params); };
		_this.wheel = function wheel(handler, params) { return substitute("WheelEvent", "wheel", handler, params); };

		_this.touchstart = function touchstart(handler, params) { return substitute("TouchEvent", "touchstart", handler, params); };
		_this.touchmove = function touchmove(handler, params) { return substitute("TouchEvent", "touchmove", handler, params); };
		_this.touchend = function touchend(handler, params) { return substitute("TouchEvent", "touchend", handler, params); };
		_this.touchcancel = function touchcancel(handler, params) { return substitute("TouchEvent", "touchcancel", handler, params); };

		_this.resize = function resize(handler, params) { return substitute("UIEvent", "resize", handler, params); };
		_this.scroll = function scroll(handler, params) { return substitute("UIEvent", "scroll", handler, params); };
		_this.select = function select(handler, params) { return substitute("UIEvent", "select", handler, params); };
		_this.submit = function submit(handler, params) { return substitute("Event", "submit", handler, params); };
		_this.reset = function reset(handler, params) { return substitute("Event", "reset", handler, params); };
		_this.input = function input(handler, params) { return substitute("Event", "input", handler, params); };
		_this.loaded = function loaded(handler, params) { return substitute("UIEvent", "loaded", handler, params); };
		_this.unloaded = function unloaded(handler, params) { return substitute("UIEvent", "unloaded", handler, params); };
		_this.error = function error(handler, params) { return substitute("Event", "error", handler, params); };

//		_this.gamepadconnected = function gamepadconnected(handler, params) { return substitute("gamepadconnected", handler, params); };
//		_this.gamepaddisconnected = function gamepaddisconnected(handler, params) { return substitute("gamepaddisconnected", handler, params); };
//		_this.deviceorientation = function deviceorientation(handler, params) { return substitute("deviceorientation", handler, params); };

		_this.find = function find(selector) {
			var child = _tag.querySelector(selector);
			return (child ? new Tag(child) : null);
		};

		_this.finds = function finds(selector) {
			var tags = document.querySelectorAll(selector);
			return new TagList(tags);
		};

		_this.childs = function childs() {
			return new TagList(_tag.childNodes);
		};

		_this.parent = function parent() {
			return (_tag.parentNode ? new Tag(_tag.parentNode) : null);
		};

		_this.duplicate = function duplicate(deep) {
			return new Tag(_tag.cloneNode(deep));
		};

		_this.value = function value(v) {
			if (typeof(v) === "undefined") {
				return (typeof(_tag["value"]) === "undefined" ? null : _tag.value);
			}
			else if (typeof(_tag["value"]) !== "undefined") {
				if (typeof(v) === "function") {
					_tag.value = v();
				}
				else {
					_tag.value = v;
				}
				return _this;
			}
		};

		_this.text = function text(v) {
			if (typeof(v) === "undefined") {
				return _tag.innerText;
			}
			else {
				if (typeof(v) === "function") {
					_tag.innerText = v();
				}
				else if (v instanceof Tag) {
					_tag.innerText = v.text();
				}
				else {
					_tag.innerText = v;
				}
				return _this;
			}
		};

		_this.html = function html(v) {
			if (typeof(v) === "undefined") {
				return _tag.innerHTML;
			}
			else {
				if (typeof(v) === "function") {
					_tag.innerHTML = v();
				}
				else if (v instanceof Tag) {
					_tag.innerHTML = v.html();
				}
				else {
					_tag.innerHTML = v;
				}
				return _this;
			}
		};

		_this.outerHtml = function outerHtml() {
			return _tag.outerHTML;
		};

		_this.append = function append(v, condition) {
			if (condition !== false) {
				if (v instanceof Tag) {
					_tag.appendChild(v.target);
				}
				else if (typeof(v) === "object" && typeof(v.tagName) === "string") {
					_tag.appendChild(v);
				}
			}
			return _this;
		};

		_this.clear = function clear() {
			_tag.innerHTML = null;
			return _this;
		};

		_this.existAttr = function existAttr(name) {
			return _tag.hasAttribute(name);
		};

		_this.attr = function attr(name, v) {
			if (typeof(name) === "object" && typeof(v) === "undefined") {
				if (name instanceof Array) {
					var result = {};
					for (i in name) {
						var attrName = name[i];
						result[attrName] = (_tag.hasAttribute(attrName) ? _tag.getAttribute(attrName) : null);
					}
					return result;
				}
				else {
					for (i in name) {
						setAttr(i, name[i]);
					}
					return _this;
				}
			}
			else if (typeof(v) === "undefined") {
				return (_tag.hasAttribute(name) ? _tag.getAttribute(name) : null);
			}
			else {
				setAttr(name, v);
				return _this;
			}
		};

		_this.removeAttr = function removeAttr(name) {
			_tag.removeAttribute(name);
			return _this;
		};

		_this.property = function property(name, v) {
			if (typeof(name) === "object" && typeof(v) === "undefined") {
				if (name instanceof Array) {
					var result = {};
					for (i in name) {
						var propName = name[i];
						result[propName] = (typeof(_tag[propName])==="undefined" ? null : _tag[propName]);
					}
					return result;
				}
				else {
					for (i in name) {
						setProperty(i, name[i]);
					}
					return _this;
				}
			}
			else if (typeof(v) === "undefined") {
				return (typeof(_tag[name])==="undefined" ? null : _tag[name]);
			}
			else {
				setProperty(name, v);
				return _this;
			}
		};

		_this.classList = function classList() {
			return _tag.classList;
		};

		_this.data = function data(name, v) {
			if (typeof(v) === "undefined") {
				return (typeof(_tag.dataset[name])==="undefined" ? null : _tag.dataset[name]);
			}
			else {
				if (typeof(v) === "function") {
					_tag.dataset[name] = v();
				}
				else {
					_tag.dataset[name] = v;
				}
				return _this;
			}
		};

		_this.style = function style(name, v) {
			if (typeof(name) === "object" && typeof(v) === "undefined") {
				for (i in name) {
					setStyle(i, name[i]);
				}
				return _this;
			}
			else if (typeof(v) === "undefined") {
				return _tag.style[name];
			}
			else {
				setStyle(name, v);
				return _this;
			}
		};

		_this.show = function show(flag) {
			if (typeof(flag) === "undefined" || flag === true) {
				_tag.removeAttribute("hidden");
			}
			else if (flag === false) {
				_tag.setAttributeNode(document.createAttribute("hidden"));
			}
			return _this;
		};

		_this.hide = function hide(flag) {
			if (typeof(flag) === "undefined" || flag === true) {
				_tag.setAttributeNode(document.createAttribute("hidden"));
			}
			else if (flag === false) {
				_tag.removeAttribute("hidden");
			}
			return _this;
		};

		_this.loadContent = function loadContent(url, params) {
			WSI.get(url)
				.success(function(status, htmlText) {
					_this.html(htmlText).mapping().initialize();
				})
				.send(params || {});
		};
	});

	var TagList = classdef(Array, function(tags) {
		Array.call(this);

		var _this = this;
		var _base = this.base();

		if (tags && typeof(tags.length) === "number") {
			for (i=0; i<tags.length; i++) {
				_this.push(new Tag(tags[i]));
			}
		}
	});

	namespace("WSI", function(ns) {
		ns.namespace = namespace;
		ns.classdef = classdef;
		ns.findClass = findClass;
		ns.formData = formatData;

		ns.queries = parseQueries();

		ns.Tag = Tag;

		ns.Control = classdef(Tag, function Control(screen, tag) {
			Tag.call(this, tag);

			var _base = this.base();
			var _this = this;

			_this.screen = screen;

			_this.initialize = function initialize() {
				//
			};
		});

		ns.Panel = classdef(ns.Control, function Panel(screen, tag) {
			ns.Control.call(this, screen, tag);

			var _base = this.base();
			var _this = this;

			_this.controls = {};

			_this.mapping = function mapping() {
				var nodeList = _this.target.querySelectorAll("[data-id]");
				for (var i=0; i<nodeList.length; i++) {
					var node = nodeList[i];
					if (_this.target !== node) {
						var id = node.dataset.id;
						var ctorName = node.dataset.type || "WSI.Control";

						var ctor = findClass(ctorName);
						if (!ctor) {
							console.log("Not found '"+ctorName+"'");
							return null;
						}
						if (typeof(_this.controls[id]) === "undefined") {
							var control = new ctor(_this.screen, node);
							_this.controls[id] = control;
							if (control instanceof WSI.Panel) {
								control.mapping().initialize();
							}
							else if (control instanceof WSI.Control) {
								control.initialize();
							}
						}
						else {
							console.log("'"+id+"' is duplicated value of 'data-id' attribute's.");
						}
					}
				}
				return _this;
			}
		});

		ns.InlineFrame = classdef(ns.Control, function InlineFrame(screen, tag) {
			ns.Control.call(this, screen, tag);

			var _base = this.base();
			var _this = this;

			var _id = _this.data("id");
			_this.attr("name", _id);

			var _messagePort = null;

			function _messagePort_message(e) {
				var data = e.data;
				var eventName = data.eventName || "";
				var targetId = data.targetId || "";
				var params = data.params || {};
				_this.raise("Event", "message."+eventName, params);
			};

			_this.screen.on("message.connect", function(e) {
				var data = e.data;
				var targetId = data.targetId;
				if (targetId === _id) {
					_messagePort = data.port;
					if (_messagePort) {
						_messagePort.addEventListener("message", _messagePort_message);
						_messagePort.start();
					}
					e.stopPropagation();
				}
			});

			_this.screen.on("message.disconnect", function(e) {
				var data = e.data;
				var targetId = data.targetId;
				if (targetId === _id) {
					_messagePort = data.port;
					if (_messagePort) {
						_messagePort.close();
						_message = null;
					}
					e.stopPropagation();
				}
			});

			_this.initialize = function initialize() {
				_base.initialize();
				//
			};

			_this.change = function(url, params) {
				if (typeof(params) === "object") {
					params['_name'] = _id;
				}
				else {
					params = { "_name": _id };
				}
				var queryString = formatData(params);
				_this.attr("src", url+(!queryString ? "" : "?"+queryString));
			};

			_this.message = function message(eventName, params, transfar) {
				if (_messagePort) {
					_messagePort.postMessage({ eventName: eventName, targetId: window.name, params: params }, transfar);
				}
				return _this;
			};
		});

		ns.Dialog = classdef(ns.Panel, function Dialog(screen, tag) {
			ns.Panel.call(this, screen, tag);

			var _base = this.base();
			var _this = this;
		});

		ns.Screen = classdef(ns.Panel, function Screen(_settings) {
			ns.Panel.call(this, this, document.body);

			var _base = this.base();
			var _this = this;

			var _window_name = window.name || WSI.queries["_name"] || "";

			//上位のウインドウへのメッセージポート
			var _messageChannel = null;
			var _messagePort = null;

			//下位のウインドウとのメッセージポート
			var _childsMessagePorts = [];

			var _messageHandler = {};

			function _messagePort_message(e) {
				var data = e.data;
				var eventName = data.eventName || "";
				var targetId = data.targetId || "";
				var params = data.params || {};
				_this.raise("Event", "message."+eventName, params);
			};

			window.addEventListener("message", function(e) {
				var data = e.data;
				var eventName = data.eventName || "";
				var targetId = data.targetId || "";
				var params = data.params || {};

				if (eventName === "connect") {
					_this.raise("Event", "message.connect", { targetId: targetId, port: (0 < e.ports.length ? e.ports[0] : null) });
				}
				else if (eventName === "disconnect") {
					_this.raise("Event", "message.disconnect", { targetId: targetId });
				}
			});

			window.addEventListener("unload", function(e) {
				if (window.parent !== window.self && _window_name) {
					if (_messagePort) {
						_messagePort.close();
						_messagePort = null;
					}

					window.parent.postMessage({ "eventName":"disconnect", "targetId":_window_name }, window.parent.origin);
				}
			});

			_this.initialize = function initialize() {
				_base.initialize();

				if (window.parent !== window.self && _window_name) {
					if (window.MessageChannel) {
						_messageChannel = new MessageChannel();
						_messagePort = _messageChannel.port1;
						_messagePort.addEventListener("message", _messagePort_message);
						_messagePort.start();

						window.parent.postMessage({ "eventName":"connect", "targetId":_window_name }, window.parent.origin, [ _messageChannel.port2 ]);
					}
				}
			};

			_this.reload = function reload(force) {
				location.reload(typeof(force)==="undefined" ? true : force);
			};

			_this.replace = function replace(url, params) {
				var queryString = formatData(params);
				location.replace(url + (!queryString ? "" : "?"+queryString));
				return _this;
			};

			_this.forward = function forward(url, params) {
				var queryString = formatData(params);
				location.assign(url + (!queryString ? "" : "?"+queryString));
				return _this;
			};

			_this.backword = function backword() {
				history.back();
				return _this;
			};

			_this.message = function message(eventName, params, transfar) {
				if (_messagePort) {
					_messagePort.postMessage({ eventName: eventName, targetId: window.name, params: params }, transfar);
				}
				return _this;
			};
		});

		ns.run = function run(initializer) {
			if (!WSI.screen && typeof(initializer) === "function") {
				window.addEventListener("load", function() {
					WSI.screen = initializer();
					if (WSI.screen instanceof WSI.Screen) {
						WSI.screen.mapping().initialize();
					}
				});
			}
		};

		ns.screendef = function screendef(ctor, params, baseCtor) {
			if (typeof(ctor) !== "function") {
				console.log("Unknown screen constructor function.");
				return;
			}
			if (typeof(params) === "function" && !baseCtor) {
				baseCtor = params;
				params = {};
			}
			else if (!params && typeof(baseCtor) === "function") {
				params = {};
			}
			else if (typeof(params) === "object" && !baseCtor) {
				baseCtor = WSI.Screen;
			}
			else if (!params && !baseCtor) {
				params = {};
				baseCtor = WSI.Screen;
			}
			else {
				console.log("Illegal arguments for screen constructor.");
				return;
			}

			var screenCtor = WSI.classdef(baseCtor, ctor);
			WSI.run(function() {
				return (typeof(params)==="undefined" ? new screenCtor() : new screenCtor(params));
			});
		};

		ns.get = function get(url) {
			return new Server(url, "GET");
		};
		ns.post = function post(url) {
			return new Server(url, "POST", "application/x-www-form-urlencoded");
		};
		ns.upload = function upload(url) {
			return new Server(url, "POST");
		};

		ns.event = function event(url, params, _success, _error) {
			function success(status, text) {
				if (typeof(_success) === "function") {
					_success(JSON.parse(text));
				}
			};
			function error(status) {
				if (typeof(_error) === "function") {
					_error(status);
				}
			};

			WSI.post(url).success(success).error(error).send(params || {});
		};

		ns.method = function method(url, method, params, _success, _error) {
			function success(status, text) {
				if (typeof(_success) === "function") {
					_success(JSON.parse(text));
				}
			};
			function error(status) {
				if (typeof(_error) === "function") {
					_error(status);
				}
			};

			WSI.post(url+(!method ? "" : ":"+method)).success(success).error(error).send(params || {});
		};

		ns.find = function find(selector) {
			var tag = document.querySelector(selector);
			return (tag ? new Tag(tag) : null);
		};

		ns.finds = function finds(selector) {
			var tags = document.querySelectorAll(selector);
			return new TagList(tags);
		};

		ns.tag = function tag(tagName) {
			if (typeof(tagName) === "string") {
				return new WSI.Tag(document.createElement(tagName));
			}
			else if (tagName instanceof WSI.Tag) {
				return tagName;
			}
			else if (typeof(tagName) === "object" && typeof(tagName.tagName) === "string") {
				return new WSI.Tag(tagName);
			}
			else {
				return null;
			}
		};

		ns.findClass = findClass;
	});
})();
