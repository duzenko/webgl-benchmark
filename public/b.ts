main();

var canvas: HTMLCanvasElement
var gl: WebGL2RenderingContext

var lastTime: number
var frame: number = 0

function render() {
    gl.clearColor( 0.5, lastTime % 1000 * 0.001, 0.0, 1.0 );
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

function loadShader( type: GLenum, source: string ) {
    const shader = gl.createShader( type );
    if ( shader ) {
        gl.shaderSource( shader, source );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
            console.log( 'Shader compile error: ' + gl.getShaderInfoLog( shader ) );
            gl.deleteShader( shader );
            return null
        }
    }
    return shader
}

function initShaderProgram( vsSource: string, fsSource: string ) {
    const shaderProgram = gl.createProgram()
    const vertexShader = loadShader( gl.VERTEX_SHADER, vsSource )
    const fragmentShader = loadShader( gl.FRAGMENT_SHADER, fsSource )
    if ( !shaderProgram || !vertexShader || !fragmentShader )
        return null
    gl.attachShader( shaderProgram, vertexShader );
    gl.attachShader( shaderProgram, fragmentShader );
    gl.linkProgram( shaderProgram );
    if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
        console.log( 'Shader link error: ' + gl.getProgramInfoLog( shaderProgram ) )
        return null
    }
    gl.useProgram( shaderProgram )
    return shaderProgram
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

    var available_extensions = gl.getSupportedExtensions()

    const vsSource = `
        attribute vec4 aVertexPosition;
    
        void main() {
        gl_Position = aVertexPosition;
        gl_Position.w = 3.0;
        }
    `

    const fsSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `

    initShaderProgram( vsSource, fsSource )
    initBuffers()
    let btn = document.getElementById( "btnStartTest" )
    if ( btn )
        btn.addEventListener( "click", ( e: Event ) => startTest() )
    startTest()
}

function startTest() {
    requestAnimationFrame( animationFrame )
}