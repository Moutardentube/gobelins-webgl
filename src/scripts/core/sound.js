// Want to customize things ?
// http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

class Sound extends Emitter {

  constructor() {
    super()

    this._context = new AudioContext()

    this._bufferSize = 512 // change this value for more or less data

    this._analyserL = this._context.createAnalyser()
    this._analyserL.fftSize = this._bufferSize
    this._analyserR = this._context.createAnalyser()
    this._analyserR.fftSize = this._bufferSize

    this._splitter = this._context.createChannelSplitter()

    this._binCount1 = this._analyserL.frequencyBinCount // this._bufferSize / 2
    this._binCount2 = this._analyserR.frequencyBinCount // this._bufferSize / 2
    console.log( this._binCount )

    this._dataFreqArrayL = new Uint8Array( this._binCount1 )
    this._dataTimeArrayL = new Uint8Array( this._binCount1 )
    this._dataFreqArrayR = new Uint8Array( this._binCount2 )
    this._dataTimeArrayR = new Uint8Array( this._binCount2 )


    this._binds = {}
    this._binds.onLoad = this._onLoad.bind( this )
  }

  load( url ) {
    this._request = new XMLHttpRequest()
    this._request.open( "GET", url, true )
    this._request.responseType = "arraybuffer"

    this._request.onload = this._binds.onLoad
    this._request.send()
  }

  _onLoad() {
    this._context.decodeAudioData( this._request.response, ( buffer ) => {
      this._source = this._context.createBufferSource()
      //this._source.connect( this._analyser )
      this._source.connect( this._splitter )

      this._splitter.connect(this._analyserL, 0, 0)
      this._splitter.connect(this._analyserR, 1, 0)

      this._source.buffer = buffer
      this._source.connect( this._context.destination )
      this._source.start( 0 )

      this.emit( "start" )
    }, () => {
      console.log( "error" )
    } )
  }

  getData() {
    this._analyserL.getByteFrequencyData( this._dataFreqArrayL )
    this._analyserL.getByteTimeDomainData( this._dataTimeArrayL )
    this._analyserR.getByteFrequencyData( this._dataFreqArrayR )
    this._analyserR.getByteTimeDomainData( this._dataTimeArrayR )
    return {
      freqL: this._dataFreqArrayL, // from 0 - 256, no sound = 0
      freqR: this._dataFreqArrayR, // from 0 - 256, no sound = 0
      //time: this._dataTimeArrayL // from 0 -256, no sound = 128
    }
  }

}

module.exports = new Sound()
