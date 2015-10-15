const loop = require( "core/loop" )
const stage = require( "core/stage" )

class Engine {

  constructor() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera( 75, 0, 1, 10000 )
    this.camera.position.z = 1000

    this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0x000000, 1 )

    this.dom = this.renderer.domElement

    // postprocessing

    this._composer = new THREE.EffectComposer( this.renderer )
    var renderPass = new THREE.RenderPass( this.scene, this.camera )
    renderPass.renderToScreen = true
    this._composer.addPass( renderPass )

    /*var effect = new THREE.ShaderPass( THREE.DotScreenShader )
    effect.uniforms[ 'scale' ].value = 4
    this._composer.addPass( effect )*/

    /*var effect = new THREE.ShaderPass( THREE.RGBShiftShader )
    effect.uniforms[ 'amount' ].value = 0.0015
    effect.renderToScreen = true*/

    /*var effectBloom = new THREE.BloomPass( 0.95, 25, 4, 1024 )
    this._composer.addPass( effectBloom )*/

    var effectFilm = new THREE.FilmPass( 0.1, 2, -6, false )
    effectFilm.renderToScreen = true

    /*var effectFocus = new THREE.ShaderPass( THREE.FocusShader )
    effectFocus.uniforms[ "screenWidth" ].value = stage.width
    effectFocus.uniforms[ "screenHeight" ].value = stage.height
    this._composer.addPass( effectFocus )*/

    //this._composer.addPass( renderModel )
    this._composer.addPass( effectFilm )

    //

    this._binds = {}
    this._binds.onUpdate = this._onUpdate.bind( this )
    this._binds.onResize = this._onResize.bind( this )
  }

  _onUpdate() {
    // this.renderer.render( this.scene, this.camera )
    this._composer.render( 0.00001 )
  }

  _onResize() {
    const w = stage.width
    const h = stage.height

    this.renderer.setSize( w, h )
    this._composer.setSize( w, h )

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  init() {
    loop.add( this._binds.onUpdate )
    stage.on( "resize", this._binds.onResize )
    this._onResize()
  }

}

module.exports = new Engine()
