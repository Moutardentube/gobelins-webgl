class MovingObject extends THREE.Object3D {
	
	constructor(scale, freq) {
		super()

		this.emitter = new Emitter()

		var geom = new THREE.PlaneGeometry(5, 400 * Math.pow(scale, 3))

		var tessellateModifier = new THREE.TessellateModifier( 8 )

		for ( var i = 0; i < 6; i ++ ) {
			tessellateModifier.modify( geom )
		}

		var explodeModifier = new THREE.ExplodeModifier()
		explodeModifier.modify( geom )

		var numFaces = geom.faces.length

		geom = new THREE.BufferGeometry().fromGeometry( geom )

		var displacement = new Float32Array( numFaces * 3 * 3 )

		for ( var f = 0; f < numFaces; f ++ ) {
			var index = 9 * f

			var d = 10 * ( 0.5 - Math.random() )

			for ( var i = 0; i < 3; i ++ ) {
				displacement[ index + ( 3 * i )     ] = d
				displacement[ index + ( 3 * i ) + 1 ] = d
				displacement[ index + ( 3 * i ) + 2 ] = d

			}

		}

		geom.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 3 ) )

		this.uniforms = {
			amplitude: { type: "f", value: 0.0 }
		}

		var shaderMaterial = new THREE.ShaderMaterial( {
			uniforms:       this.uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent
		})


	    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color("hsl(" + freq * 5 * 360 / 248 + ", 80%, 60%)") })
	    const mesh = new THREE.Mesh(geom, mat)

	    this.direction = Math.PI * 4 * freq / 248
	    this.speed = 7

	    this.m = new THREE.Matrix4()
		this.m.makeTranslation (Math.cos(this.direction), Math.sin(this.direction), this.speed)

	    this.add(mesh)
	    var m = new THREE.Matrix4()
	    m.makeTranslation(0, Math.sin(this.direction) * 200, 0)
	    this.applyMatrix(m)
	    /*console.log (freq * 360 / 248)
	    console.log(Math.PI * freq * 2 / 248 % (2 * Math.PI))*/
	}

	update() {
			//console.log(this.position.x, this.position.y)
		if (this.position.z > 1000) {
			this._destroy()
			return
		}
		this.applyMatrix(this.m)

		var time = Date.now() * 0.001
		this.uniforms.amplitude.value = 1.0 + Math.sin( time * 0.5 )
	}

	_destroy() {
		this.emitter.emit('destroy', this)
	}

}

module.exports = MovingObject