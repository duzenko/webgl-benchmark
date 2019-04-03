import * as shaders from "shaders"
import * as buffers from "buffers"
import { loadTexture } from "textures"

var gl: WebGL2RenderingContext

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
    gl = _gl
    if ( gl === null )
        return
    if ( gl ) {
        var debugInfo = <WEBGL_debug_renderer_info>gl.getExtension( 'WEBGL_debug_renderer_info' )
        var renderer = gl.getParameter( debugInfo.UNMASKED_RENDERER_WEBGL )
        console.log( renderer )
    }

    buffers.initBuffers( gl )
    shaders.initShaderPrograms( gl )
    textures = <WebGLTexture[]>[
        'images/affair-anniversary-asad-1024975.jpg',
        'images/Blue_jay_1482_-_2.jpg',
        'images/pexels-photo-556416.jpeg',
    ].map( s => loadTexture( gl, s ) ).filter( t => t )
    let btn = document.getElementById( "btnStartTest" )
    if ( btn )
        btn.addEventListener( "click", ( e: Event ) => startTest() )
    startTest()
}

function startTest() {
    frame = 0
    if ( shaders.shader.status != shaders.ShaderStatus.Error )
        requestAnimationFrame( animationFrame )
}

function render() {
    gl.clearColor( 0.41, .5 + .5 * Math.sin( lastTime * 0.001 ), 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT )
    const v = [
        [0, 0, .9, .9],
        [-.4, .4, .3, .4],
        [.4, .4, .3, .4]
    ]
    if ( shaders.shader.status != shaders.ShaderStatus.OK )
        return
    textures.forEach( ( t, index ) => {
        gl.bindTexture( gl.TEXTURE_2D, t )
        shaders.shader.Center( v[index][0], v[index][1] )
        shaders.shader.Size( v[index][2], v[index][3] )
        var x = Math.sin( lastTime * 0.002 )
        shaders.shader.Saturation = index == 0 ? x * .9 + 1 : 1
        shaders.shader.Brightness = index == 1 ? x * .6 : 0
        shaders.shader.Contrast = index == 2 ? x * .9 + 1 : 1
        shaders.shader.Draw()
    } )
}

function animationFrame( now: number ) {
    // var maxViewPort = gl.getParameter( gl.MAX_VIEWPORT_DIMS )
    gl.canvas.width = window.innerWidth
    gl.canvas.height = window.innerHeight
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height )
    if ( frame++ % 10 == 1 ) {
        const e = document.getElementById( 'viewport' )
        if ( e ) {
            var h = gl.canvas.width + 'x' + gl.canvas.height
            h += '<br/>' + Math.round( 1000 / ( now - lastTime ) ) + ' FPS'
            e.innerHTML = h
        }
    }
    lastTime = now
    render()
    if ( frame < 200 )
        requestAnimationFrame( animationFrame )
}