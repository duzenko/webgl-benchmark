import * as shaders from "./shaders";

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
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    gl.viewport( 0, 0, canvas.width, canvas.height )
    frame++
    if ( frame % 10 == 0 ) {
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

function initBuffers() {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    const positions = [
        1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        -1.0, -1.0,
    ];
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW )

    gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( 0 );
    return {
        position: positionBuffer,
    };
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
        var vendor = gl.getParameter( debugInfo.UNMASKED_VENDOR_WEBGL )
        var renderer = gl.getParameter( debugInfo.UNMASKED_RENDERER_WEBGL )
        console.log( renderer )
    }

    initBuffers()
    shaders.initShaderPrograms( gl )
    let btn = document.getElementById( "btnStartTest" )
    if ( btn )
        btn.addEventListener( "click", ( e: Event ) => startTest() )
    startTest()
}

function startTest() {
    requestAnimationFrame( animationFrame )
}