main();

var canvas: HTMLCanvasElement
var gl: WebGLRenderingContext

function render( now: number ) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport( 0, 0, canvas.width, canvas.height )
    const e = document.getElementById( 'viewport' )
    if ( e )
        e.innerHTML = canvas.width + 'x' + canvas.height

    const vp = gl.getParameter( gl.VIEWPORT );
    // Set clear color to black, fully opaque
    gl.clearColor( 0.5, now % 1000 * 0.001, 0.0, 1.0 );
    // Clear the color buffer with specified clear color
    gl.clear( gl.COLOR_BUFFER_BIT );
    //gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    requestAnimationFrame( render )
}

function main() {
    canvas = <HTMLCanvasElement>document.querySelector( "#glCanvas" )
    if ( !canvas )
        return;
    const _gl = canvas.getContext( "webgl" )
    if ( !_gl )
        return;
    gl = _gl;

    // Only continue if WebGL is available and working
    if ( gl === null ) {
        alert( "Unable to initialize WebGL. Your browser or machine may not support it." );
        return;
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
    
        void main() {
        gl_Position = aVertexPosition;
        gl_Position.w = 3.0;
        }
    `;

    const fsSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    `;

    // initShaderProgram( gl, vsSource, fsSource );
    // initBuffers( gl );
    requestAnimationFrame( render );
}