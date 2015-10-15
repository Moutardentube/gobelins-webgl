const loop = require( "core/loop" )
const stage = require( "core/stage" )
const engine = require( "core/engine" )
const sound = require( "core/sound" )

stage.init()
engine.init()

/*var gui = new dat.GUI()
gui.add(engine.effectFilm.uniforms.grayscale, 'value')
gui.add(engine.effectFilm.uniforms.nIntensity, 'value')
gui.add(engine.effectFilm.uniforms.sIntensity, 'value')
gui.add(engine.effectFilm.uniforms.sCount, 'value')*/

document.getElementById( "main" ).appendChild( engine.dom )

const xp = new ( require( "xp/Xp" ) )()
engine.scene.add( xp )

sound.load( "mp3/anycolor.mp3" )
sound.on( "start", () => {
  loop.add( () => {
    xp.update( sound.getData() )
  })
})

loop.start()
