import * as Global from 'globals'

export { ShaderState, BaseShader }

enum ShaderState {
    Loading, Loaded, Error, OK
}

class BaseShader {
    handle: WebGLProgram
    state: ShaderState
    src: any
    constructor( url: string ) {
        this.handle = 0
        this.state = ShaderState.Loading
        fetch( '/shader?' + url ).then( response => {
            return response.json()
        } ).then( src => {
            this.src = src
            this.state = ShaderState.Loaded
            this.CheckCompile()
        } )
    }
    CheckCompile() {
        if ( Global.webgl2 && this.state == ShaderState.Loaded )
            this.Compile()
    }
    Compile() {
        this.handle = <WebGLShader>initShaderProgram( this.src.vertex, this.src.fragment )
        this.state = this.handle == 0 ? ShaderState.Error : ShaderState.OK
    }
    Draw() {
        Global.webgl2.drawArrays( Global.webgl2.TRIANGLE_FAN, 0, 4 )
    }
}

function loadShader( type: GLenum, source: string ) {
    const shader = Global.webgl2.createShader( type );
    if ( shader ) {
        Global.webgl2.shaderSource( shader, source );
        Global.webgl2.compileShader( shader );
        if ( !Global.webgl2.getShaderParameter( shader, WebGL2RenderingContext.COMPILE_STATUS ) ) {
            console.log( 'Shader compile error: ' + Global.webgl2.getShaderInfoLog( shader ) );
            Global.webgl2.deleteShader( shader );
            return null
        }
    }
    return shader
}

function initShaderProgram( vsSource: string, fsSource: string ) {
    const shaderProgram = Global.webgl2.createProgram()
    const vertexShader = loadShader( WebGL2RenderingContext.VERTEX_SHADER, vsSource )
    const fragmentShader = loadShader( WebGL2RenderingContext.FRAGMENT_SHADER, fsSource )
    if ( !shaderProgram || !vertexShader || !fragmentShader )
        return null
    Global.webgl2.attachShader( shaderProgram, vertexShader );
    Global.webgl2.attachShader( shaderProgram, fragmentShader );
    Global.webgl2.linkProgram( shaderProgram );
    if ( !Global.webgl2.getProgramParameter( shaderProgram, WebGL2RenderingContext.LINK_STATUS ) ) {
        console.log( 'Shader link error: ' + Global.webgl2.getProgramInfoLog( shaderProgram ) )
        return null
    }
    Global.webgl2.useProgram( shaderProgram )
    return shaderProgram
}