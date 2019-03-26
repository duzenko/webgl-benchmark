import * as shaders from "./shaders";
import * as buffers from "./buffers";

main();

var canvas: HTMLCanvasElement
var gl: WebGL2RenderingContext

var lastTime: number
var frame: number = 0

function render() {
    gl.clearColor( 0.41, lastTime % 1000 * 0.001, 0.0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT )
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 )
}

function animationFrame( now: number ) {
    var maxViewPort = gl.getParameter( gl.MAX_VIEWPORT_DIMS )
    canvas.width = 8192 //window.innerWidth
    canvas.height = 8192 //window.innerHeight
    gl.viewport( 0, 0, canvas.width, canvas.height )
    if ( frame++ % 10 == 1 ) {
        const e = document.getElementById( 'viewport' )
        if ( e ) {
            var h = canvas.width + 'x' + canvas.height
            h += '<br/>' + Math.round( 1000 / ( now - lastTime ) ) + ' FPS'
            e.innerHTML = h
        }
    }
    lastTime = now
    render()
    if ( frame < 200 )
        requestAnimationFrame( animationFrame )
}

function main() {
    canvas = <HTMLCanvasElement>document.querySelector( "#glCanvas" )
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
    let btn = document.getElementById( "btnStartTest" )
    if ( btn )
        btn.addEventListener( "click", ( e: Event ) => startTest() )
    startTest()
}

function startTest() {
    frame = 0
    requestAnimationFrame( animationFrame )
}