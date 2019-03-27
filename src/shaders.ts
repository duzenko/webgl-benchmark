export { shader, initShaderPrograms }

var gl: WebGL2RenderingContext

class RectShader {
    handle: WebGLProgram
    constructor() {
        this.handle = 0
    }
    Draw( x: number, y: number, w: number, h: number ) {
        var loc = gl.getUniformLocation( this.handle, 'center' )
        gl.uniform2f( loc, x, y )
        var loc = gl.getUniformLocation( this.handle, 'size' )
        gl.uniform2f( loc, w, h )
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 )
    }
}

const shader: RectShader = new RectShader()

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

function initShaderPrograms( _gl: WebGL2RenderingContext ) {
    gl = _gl
    const vsSource = `#version 300 es
        uniform vec2 center, size;
        out vec4 texCoord;
        void main() {
            float a = radians(float(gl_VertexID * 90 + 45));
            gl_Position.x = sin(a);
            gl_Position.y = cos(a);
            gl_Position.xy *= sqrt(2.0)*size;
            gl_Position.w = 1.0;
            gl_Position.xy += center;
            texCoord = sign(gl_Position)*-0.5+0.5;
        }
    `

    const fsSource = `#version 300 es
        precision mediump float;
        uniform sampler2D uSampler;
        in vec4 texCoord;
        out vec4 FragColor;
        void main() {
            FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            FragColor = texture(uSampler, texCoord.xy);
        }
    `

    shader.handle = <WebGLShader>initShaderProgram( vsSource, fsSource )
}