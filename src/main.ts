import * as shaders from "shaders/shaders"
import { webgl2, set_webgl2 } from "globals"
import { rectShader } from "shaders/rect"
import { spiralShader } from "shaders/spiral"
import * as buffers from "buffers"
import { loadTexture } from "textures"

var lastTime: number
var frame: number = 0
var textures: ( WebGLTexture | null )[] = [null, null]

main()

function main() {
    const canvas = <HTMLCanvasElement>document.querySelector( "#glCanvas" )
    if ( !canvas )
        return
    const _gl = canvas.getContext( "webgl2" )
    if ( !_gl ) {
        alert( "Unable to initialize WebGL. Your browser or machine may not support it." )
        return
    }
    set_webgl2( _gl )
    var debugInfo = <WEBGL_debug_renderer_info>webgl2.getExtension( 'WEBGL_debug_renderer_info' )
    var renderer = webgl2.getParameter( debugInfo.UNMASKED_RENDERER_WEBGL )
    console.log( renderer )

    buffers.initBuffers( webgl2 )
    textures = <WebGLTexture[]>[
        'images/affair-anniversary-asad-1024975.jpg',
        'images/Blue_jay_1482_-_2.jpg',
        'images/pexels-photo-556416.jpeg',
    ].map( s => loadTexture( s ) ).filter( t => t )
    let btn = document.getElementById( "btnStartTest" )
    if ( btn )
        btn.addEventListener( "click", ( e: Event ) => startTest() )
    startTest()
}

function startTest() {
    frame = 0
    requestAnimationFrame( animationFrame )
}

function render() {
    webgl2.clearColor( 0.41, .5 + .5 * Math.sin( lastTime * 0.001 ), 0.0, 1.0 );
    webgl2.clear( WebGL2RenderingContext.COLOR_BUFFER_BIT )
    const v = [
        [0, 0, .9, .9],
        [-.4, .4, .3, .4],
        [.4, .4, .3, .4]
    ]
    if ( rectShader.Use() )
        textures.forEach( ( t, index ) => {
            webgl2.bindTexture( WebGL2RenderingContext.TEXTURE_2D, t )
            rectShader.Center( v[index][0], v[index][1] )
            rectShader.Size( v[index][2], v[index][3] )
            var x = Math.sin( lastTime * 0.002 )
            rectShader.Saturation = index == 0 ? x * .9 + 1 : 1
            rectShader.Brightness = index == 1 ? x * .6 : 0
            rectShader.Contrast = index == 2 ? x * .9 + 1 : 1
            rectShader.Draw()
        } )
    spiralShader.Draw()
}

function animationFrame( now: number ) {
    // var maxViewPort = gl.getParameter( gl.MAX_VIEWPORT_DIMS )
    webgl2.canvas.width = window.innerWidth
    webgl2.canvas.height = window.innerHeight
    webgl2.viewport( 0, 0, webgl2.canvas.width, webgl2.canvas.height )
    if ( frame++ % 10 == 1 ) {
        const e = document.getElementById( 'viewport' )
        if ( e ) {
            var h = webgl2.canvas.width + 'x' + webgl2.canvas.height
            h += '<br/>' + Math.round( 1000 / ( now - lastTime ) ) + ' FPS'
            e.innerHTML = h
        }
    }
    lastTime = now
    render()
    if ( frame < 200 )
        requestAnimationFrame( animationFrame )
}