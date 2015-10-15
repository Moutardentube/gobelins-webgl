(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var loop = require("core/loop");
var stage = require("core/stage");

var Engine = (function () {
  function Engine() {
    _classCallCheck(this, Engine);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 0, 1, 10000);
    this.camera.position.z = 1000;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);

    this.dom = this.renderer.domElement;

    // postprocessing

    this._composer = new THREE.EffectComposer(this.renderer);
    var renderPass = new THREE.RenderPass(this.scene, this.camera);
    renderPass.renderToScreen = true;
    this._composer.addPass(renderPass);

    /*var effect = new THREE.ShaderPass( THREE.DotScreenShader )
    effect.uniforms[ 'scale' ].value = 4
    this._composer.addPass( effect )*/

    /*var effect = new THREE.ShaderPass( THREE.RGBShiftShader )
    effect.uniforms[ 'amount' ].value = 0.0015
    effect.renderToScreen = true*/

    /*var effectBloom = new THREE.BloomPass( 0.95, 25, 4, 1024 )
    this._composer.addPass( effectBloom )*/

    var effectFilm = new THREE.FilmPass(0.1, 2, -6, false);
    effectFilm.renderToScreen = true;

    /*var effectFocus = new THREE.ShaderPass( THREE.FocusShader )
    effectFocus.uniforms[ "screenWidth" ].value = stage.width
    effectFocus.uniforms[ "screenHeight" ].value = stage.height
    this._composer.addPass( effectFocus )*/

    //this._composer.addPass( renderModel )
    this._composer.addPass(effectFilm);

    //

    this._binds = {};
    this._binds.onUpdate = this._onUpdate.bind(this);
    this._binds.onResize = this._onResize.bind(this);
  }

  _createClass(Engine, [{
    key: "_onUpdate",
    value: function _onUpdate() {
      // this.renderer.render( this.scene, this.camera )
      this._composer.render(0.00001);
    }
  }, {
    key: "_onResize",
    value: function _onResize() {
      var w = stage.width;
      var h = stage.height;

      this.renderer.setSize(w, h);
      this._composer.setSize(w, h);

      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }, {
    key: "init",
    value: function init() {
      loop.add(this._binds.onUpdate);
      stage.on("resize", this._binds.onResize);
      this._onResize();
    }
  }]);

  return Engine;
})();

module.exports = new Engine();

},{"core/loop":2,"core/stage":4}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loop = (function () {
  function Loop() {
    _classCallCheck(this, Loop);

    this._idRAF = -1;
    this._count = 0;

    this._listeners = [];

    this._binds = {};
    this._binds.update = this._update.bind(this);
  }

  _createClass(Loop, [{
    key: "_update",
    value: function _update() {
      var listener = null;
      var i = this._count;
      while (--i >= 0) {
        listener = this._listeners[i];
        if (listener) {
          listener.apply(this, null);
        }
      }
      this._idRAF = requestAnimationFrame(this._binds.update);
    }
  }, {
    key: "start",
    value: function start() {
      this._update();
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this._idRAF);
    }
  }, {
    key: "add",
    value: function add(listener) {
      var idx = this._listeners.indexOf(listener);
      if (idx >= 0) {
        return;
      }
      this._listeners.push(listener);
      this._count++;
    }
  }, {
    key: "remove",
    value: function remove(listener) {
      var idx = this._listeners.indexOf(listener);
      if (idx < 0) {
        return;
      }
      this._listeners.splice(idx, 1);
      this._count--;
    }
  }]);

  return Loop;
})();

module.exports = new Loop();

},{}],3:[function(require,module,exports){
// Want to customize things ?
// http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Sound = (function (_Emitter) {
  _inherits(Sound, _Emitter);

  function Sound() {
    _classCallCheck(this, Sound);

    _get(Object.getPrototypeOf(Sound.prototype), "constructor", this).call(this);

    this._context = new AudioContext();

    this._bufferSize = 512; // change this value for more or less data

    this._analyserL = this._context.createAnalyser();
    this._analyserL.fftSize = this._bufferSize;
    this._analyserR = this._context.createAnalyser();
    this._analyserR.fftSize = this._bufferSize;

    this._splitter = this._context.createChannelSplitter();

    this._binCount1 = this._analyserL.frequencyBinCount; // this._bufferSize / 2
    this._binCount2 = this._analyserR.frequencyBinCount; // this._bufferSize / 2
    console.log(this._binCount);

    this._dataFreqArrayL = new Uint8Array(this._binCount1);
    this._dataTimeArrayL = new Uint8Array(this._binCount1);
    this._dataFreqArrayR = new Uint8Array(this._binCount2);
    this._dataTimeArrayR = new Uint8Array(this._binCount2);

    this._binds = {};
    this._binds.onLoad = this._onLoad.bind(this);
  }

  _createClass(Sound, [{
    key: "load",
    value: function load(url) {
      this._request = new XMLHttpRequest();
      this._request.open("GET", url, true);
      this._request.responseType = "arraybuffer";

      this._request.onload = this._binds.onLoad;
      this._request.send();
    }
  }, {
    key: "_onLoad",
    value: function _onLoad() {
      var _this = this;

      this._context.decodeAudioData(this._request.response, function (buffer) {
        _this._source = _this._context.createBufferSource();
        //this._source.connect( this._analyser )
        _this._source.connect(_this._splitter);

        _this._splitter.connect(_this._analyserL, 0, 0);
        _this._splitter.connect(_this._analyserR, 1, 0);

        _this._source.buffer = buffer;
        _this._source.connect(_this._context.destination);
        _this._source.start(0);

        _this.emit("start");
      }, function () {
        console.log("error");
      });
    }
  }, {
    key: "getData",
    value: function getData() {
      this._analyserL.getByteFrequencyData(this._dataFreqArrayL);
      this._analyserL.getByteTimeDomainData(this._dataTimeArrayL);
      this._analyserR.getByteFrequencyData(this._dataFreqArrayR);
      this._analyserR.getByteTimeDomainData(this._dataTimeArrayR);
      return {
        freqL: this._dataFreqArrayL, // from 0 - 256, no sound = 0
        freqR: this._dataFreqArrayR };
    }
  }]);

  return Sound;
})(Emitter);

// from 0 - 256, no sound = 0
//time: this._dataTimeArrayL // from 0 -256, no sound = 128

module.exports = new Sound();

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stage = (function (_Emitter) {
  _inherits(Stage, _Emitter);

  function Stage() {
    _classCallCheck(this, Stage);

    _get(Object.getPrototypeOf(Stage.prototype), "constructor", this).call(this);

    this.width = 0;
    this.height = 0;

    this._binds = {};
    this._binds.onResize = this._onResize.bind(this);
    this._binds.update = this._update.bind(this);
  }

  _createClass(Stage, [{
    key: "_onResize",
    value: function _onResize() {
      setTimeout(this._binds.update, 10);
    }
  }, {
    key: "init",
    value: function init() {
      var andDispatch = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      window.addEventListener("resize", this._binds.onResize, false);
      window.addEventListener("orientationchange", this._binds.onResize, false);

      if (andDispatch) {
        this._update();
      }
    }
  }, {
    key: "_update",
    value: function _update() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.emit("resize");
    }
  }, {
    key: "forceResize",
    value: function forceResize() {
      var withDelay = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (withDelay) {
        this._onResize();
        return;
      }
      this._update();
    }
  }]);

  return Stage;
})(Emitter);

module.exports = new Stage();

},{}],5:[function(require,module,exports){
"use strict";

var loop = require("core/loop");
var stage = require("core/stage");
var engine = require("core/engine");
var sound = require("core/sound");

stage.init();
engine.init();

/*var gui = new dat.GUI()
gui.add(engine.effectFilm.uniforms.grayscale, 'value')
gui.add(engine.effectFilm.uniforms.nIntensity, 'value')
gui.add(engine.effectFilm.uniforms.sIntensity, 'value')
gui.add(engine.effectFilm.uniforms.sCount, 'value')*/

document.getElementById("main").appendChild(engine.dom);

var xp = new (require("xp/Xp"))();
engine.scene.add(xp);

sound.load("mp3/anycolor.mp3");
sound.on("start", function () {
  loop.add(function () {
    xp.update(sound.getData());
  });
});

loop.start();

},{"core/engine":1,"core/loop":2,"core/sound":3,"core/stage":4,"xp/Xp":7}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovingObject = (function (_THREE$Object3D) {
	_inherits(MovingObject, _THREE$Object3D);

	function MovingObject(scale, freq) {
		_classCallCheck(this, MovingObject);

		_get(Object.getPrototypeOf(MovingObject.prototype), 'constructor', this).call(this);

		this.emitter = new Emitter();

		var geom = new THREE.PlaneGeometry(5, 400 * Math.pow(scale, 3));

		var tessellateModifier = new THREE.TessellateModifier(8);

		for (var i = 0; i < 6; i++) {
			tessellateModifier.modify(geom);
		}

		var explodeModifier = new THREE.ExplodeModifier();
		explodeModifier.modify(geom);

		var numFaces = geom.faces.length;

		geom = new THREE.BufferGeometry().fromGeometry(geom);

		var displacement = new Float32Array(numFaces * 3 * 3);

		for (var f = 0; f < numFaces; f++) {
			var index = 9 * f;

			var d = 10 * (0.5 - Math.random());

			for (var i = 0; i < 3; i++) {
				displacement[index + 3 * i] = d;
				displacement[index + 3 * i + 1] = d;
				displacement[index + 3 * i + 2] = d;
			}
		}

		geom.addAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

		this.uniforms = {
			amplitude: { type: "f", value: 0.0 }
		};

		var shaderMaterial = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: document.getElementById('vertexshader').textContent
		});

		var mat = new THREE.MeshBasicMaterial({ color: new THREE.Color("hsl(" + freq * 5 * 360 / 248 + ", 80%, 60%)") });
		var mesh = new THREE.Mesh(geom, mat);

		this.direction = Math.PI * 4 * freq / 248;
		this.speed = 7;

		this.m = new THREE.Matrix4();
		this.m.makeTranslation(Math.cos(this.direction), Math.sin(this.direction), this.speed);

		this.add(mesh);
		var m = new THREE.Matrix4();
		m.makeTranslation(0, Math.sin(this.direction) * 200, 0);
		this.applyMatrix(m);
		/*console.log (freq * 360 / 248)
  console.log(Math.PI * freq * 2 / 248 % (2 * Math.PI))*/
	}

	_createClass(MovingObject, [{
		key: 'update',
		value: function update() {
			//console.log(this.position.x, this.position.y)
			if (this.position.z > 1000) {
				this._destroy();
				return;
			}
			this.applyMatrix(this.m);

			var time = Date.now() * 0.001;
			this.uniforms.amplitude.value = 1.0 + Math.sin(time * 0.5);
		}
	}, {
		key: '_destroy',
		value: function _destroy() {
			this.emitter.emit('destroy', this);
		}
	}]);

	return MovingObject;
})(THREE.Object3D);

module.exports = MovingObject;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovingObject = require("xp/MovingObject");

var Xp = (function (_THREE$Object3D) {
  _inherits(Xp, _THREE$Object3D);

  function Xp() {
    _classCallCheck(this, Xp);

    _get(Object.getPrototypeOf(Xp.prototype), 'constructor', this).call(this);

    //this._createDummyPlane()
    // this._setOrigin()

    this._planes = [];

    this._binds = {};
    this._binds.onDestroy = this._onDestroy.bind(this);
  }

  _createClass(Xp, [{
    key: '_onDestroy',
    value: function _onDestroy(plane) {
      // console.log(this._planes.splice(this._planes.filter(function (o) {
      //   return o.name === plane.name
      // })))
      this._destroyPlane(plane);
    }
  }, {
    key: '_createDummyPlane',
    value: function _createDummyPlane() {
      var geom = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10);
      var mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, overdraw: 0.5 });
      this.mesh = new THREE.Mesh(geom, mat);
      this.add(this.mesh);
    }
  }, {
    key: '_setOrigin',
    value: function _setOrigin() {
      this.origin = new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, -2000);
    }
  }, {
    key: '_spawnPlane',
    value: function _spawnPlane(scale, freq) {
      var plane = new MovingObject(scale, freq);
      plane.emitter.on('destroy', this._binds.onDestroy);
      this.add(plane);

      this._planes.push(plane);

      //plane.translateZ (0)
    }
  }, {
    key: '_destroyPlane',
    value: function _destroyPlane(plane) {
      var idx = this._planes.indexOf(plane);
      if (idx < 0) {
        return;
      }
      this._planes.splice(idx, 1);
      plane.emitter.off('destroy', this._binds.onDestroy);
      this.remove(plane);
    }
  }, {
    key: 'update',
    value: function update(data) {
      if (!data) {
        return;
      }
      // Want to customize things ?
      // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

      // for(let i = 0, l = this._planes.length; i < l; i++) {
      var l = this._planes.length;
      while (--l > -1) {
        this._planes[l].update();
      }

      var freqBands = [];
      for (var i = 0; i < 16; i++) {
        freqBands.push([]);
      }

      l = data.freqL.length;
      var bandStrL = 0,
          bandStrR = 0,
          bandWidth = 256 / freqBands.length;
      for (var i = 0; i < l; i++) {
        // do your stuff here
        if (i % bandWidth === 0) {
          this._spawnPlane(bandStrL / bandWidth / 255, i);
          this._spawnPlane(bandStrR / bandWidth / 255, i * 2);
          bandStrL = 0;
          bandStrR = 0;
        }
        bandStrL += data.freqL[i];
        bandStrR += data.freqR[i];
        /*let freqStr = data.freq[ i ]
        if (freqStr > 0) {
          this._spawnPlane(freqStr / 255, i)
        }*/
      }

      /*n = data.time.length // for wave // from 0 -256, no sound = 128
      for(i = 0; i < n; i++) {
        // do your stuff here
      }*/
    }
  }]);

  return Xp;
})(THREE.Object3D);

module.exports = Xp;

},{"xp/MovingObject":6}]},{},[5]);
