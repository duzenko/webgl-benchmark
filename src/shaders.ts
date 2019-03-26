var gl: WebGL2RenderingContext

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

export function initShaderPrograms( _gl: WebGL2RenderingContext ) {
    gl = _gl
    const vsSource = `#version 300 es
        out vec4 position;
        void main() {
            float a = radians(float(gl_VertexID * 90 + 45));
            gl_Position.x = sin(a);
            gl_Position.y = cos(a);
            gl_Position.w = 2.0;
            position = gl_Position;
        }
    `

    const fsSource = `#version 300 es
        precision mediump float;
        uniform sampler2D uSampler;
        in vec4 position;
        out vec4 FragColor;
        void main() {
            FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            FragColor = texture(uSampler, position.xy);
        }
    `

    initShaderProgram( vsSource, fsSource )
}