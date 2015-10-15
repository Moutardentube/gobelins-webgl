const MovingObject = require("xp/MovingObject")

class Xp extends THREE.Object3D {

  constructor() {
    super()

    //this._createDummyPlane()
    // this._setOrigin()

    this._planes = []

    this._binds = {}
    this._binds.onDestroy = this._onDestroy.bind(this)
  }

  _onDestroy(plane) {
    // console.log(this._planes.splice(this._planes.filter(function (o) {
    //   return o.name === plane.name
    // })))
    this._destroyPlane(plane)
  }

  _createDummyPlane() {
    const geom = new THREE.PlaneBufferGeometry(1000, 1000, 10, 10)
    const mat = new THREE.MeshBasicMaterial({ color: 0xff00ff, overdraw: 0.5})
    this.mesh = new THREE.Mesh(geom, mat)
    this.add(this.mesh)
  }

  _setOrigin() {
    this.origin = new THREE.Vector3(window.innerWidth / 2, window.innerHeight / 2, -2000)
  }

  _spawnPlane(scale, freq) {
    const plane = new MovingObject(scale, freq)
    plane.emitter.on('destroy', this._binds.onDestroy)
    this.add(plane)

    this._planes.push(plane)

    //plane.translateZ (0)
  }

  _destroyPlane(plane) {
    const idx = this._planes.indexOf(plane)
    if(idx < 0) {
      return
    }
    this._planes.splice(idx, 1)
    plane.emitter.off('destroy', this._binds.onDestroy)
    this.remove(plane)
  }

  update(data) {
    if(!data) {
      return
    }
    // Want to customize things ?
    // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/
    
    // for(let i = 0, l = this._planes.length; i < l; i++) {
    var l = this._planes.length
    while(--l > -1) {
      this._planes[l].update()
    }

    var freqBands = []
    for (let i = 0; i < 16; i++) {
      freqBands.push([])
    }

    l = data.freqL.length
    var bandStrL = 0,
        bandStrR = 0,
        bandWidth = 256 / freqBands.length;
    for (let i = 0; i < l; i++) {
      // do your stuff here
      if (i % bandWidth === 0) {
        this._spawnPlane(bandStrL / bandWidth / 255, i)
        this._spawnPlane(bandStrR / bandWidth / 255, i * 2)
        bandStrL = 0
        bandStrR = 0
      }
      bandStrL += data.freqL[ i ]
      bandStrR += data.freqR[ i ]
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
}

module.exports = Xp
