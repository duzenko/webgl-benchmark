export { shader, initShaderPrograms, ShaderStatus }

var gl: WebGL2RenderingContext

enum ShaderStatus {
    Loading, Error, OK
}

class RectShader {
    handle: WebGLProgram
    status: ShaderStatus
    constructor( url: string ) {
        this.handle = 0
        this.status = ShaderStatus.Loading
        fetch( '/shaders/' + url + '.vs' ).then( response => {
            return response.text()
        } ).then( vsSource => {
            const fsSource = `#version 300 es
                precision mediump float;
                uniform sampler2D uSampler;
                uniform float brightness, contrast, saturation;
                in vec4 texCoord;
                out vec4 FragColor;
                void main() {
                    FragColor = texture(uSampler, texCoord.xy);
                    float b = dot(FragColor.rgb, vec3(1./3.));
                    FragColor.rgb = mix(vec3(b), FragColor.rgb, saturation );
                    FragColor.rgb = .5 +(FragColor.rgb-.5)*contrast;
                    FragColor.rgb += brightness;
                }
            `
            this.handle = <WebGLShader>initShaderProgram( vsSource, fsSource )
            this.status = this.handle == 0 ? ShaderStatus.Error : ShaderStatus.OK
        } )
    }
    Draw() {
        gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 )
    }
    Center( x: number, y: number ) {
        var loc = gl.getUniformLocation( this.handle, 'center' )
        gl.uniform2f( loc, x, y )
    }
    Size( w: number, h: number ) {
        var loc = gl.getUniformLocation( this.handle, 'size' )
        gl.uniform2f( loc, w, h )
    }
    set Brightness( value: number ) {
        var loc = gl.getUniformLocation( this.handle, 'brightness' )
        gl.uniform1f( loc, value )
    }
    set Contrast( value: number ) {
        var loc = gl.getUniformLocation( this.handle, 'contrast' )
        gl.uniform1f( loc, value )
    }
    set Saturation( value: number ) {
        var loc = gl.getUniformLocation( this.handle, 'saturation' )
        gl.uniform1f( loc, value )
    }
}

var shader: RectShader

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
    shader = new RectShader( 'rect' )
}