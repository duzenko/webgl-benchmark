import { webgl2 } from 'globals'

export { ShaderState, BaseShader }

enum ShaderState {
    Loading, Loaded, Error, OK
}

class BaseShader {
    handle: WebGLProgram
    state: ShaderState
    src: any
    name: string
    constructor( name: string ) {
        this.handle = 0
        this.name = name
        this.state = ShaderState.Loading
        fetch( '/shader?name=' + name ).then( response => {
            return response.json()
        } ).then( src => {
            this.src = src
            this.state = ShaderState.Loaded
        } )
    }
    CheckCompile() {
        if ( !webgl2 )
            return false
        switch ( this.state ) {
            case ShaderState.Error:
                return false
            case ShaderState.Loaded:
                return this.Compile()
            case ShaderState.OK:
                return true
        }
        return false
    }
    Compile() {
        this.handle = <WebGLShader>initShaderProgram( this.src.vertex, this.src.fragment )
        if ( !this.handle ) {
            this.state = ShaderState.Error
            console.log( 'Failed to compile ' + this.name )
            return false
        } else {
            this.state = ShaderState.OK
            return true
        }
    }
    Use() {
        if ( !this.CheckCompile() )
            return false
        webgl2.useProgram( this.handle )
        return true
    }
    /*Draw() {
        webgl2.drawArrays( WebGL2RenderingContext.TRIANGLE_FAN, 0, 4 )
    }*/
}

function loadShader( type: GLenum, source: string ) {
    const shader = webgl2.createShader( type )
    if ( shader ) {
        webgl2.shaderSource( shader, source )
        webgl2.compileShader( shader )
        if ( !webgl2.getShaderParameter( shader, WebGL2RenderingContext.COMPILE_STATUS ) ) {
            var s = '?';
            switch ( type ) {
                case WebGL2RenderingContext.VERTEX_SHADER:
                    s = 'Vertex'
                    break
                case WebGL2RenderingContext.FRAGMENT_SHADER:
                    s = 'Fragment'
                    break
            }
            console.log( s + ' shader compile error: ' + webgl2.getShaderInfoLog( shader ) )
            webgl2.deleteShader( shader )
            return null
        }
    }
    return shader
}

function initShaderProgram( vsSource: string, fsSource: string ) {
    const shaderProgram = webgl2.createProgram()
    const vertexShader = loadShader( WebGL2RenderingContext.VERTEX_SHADER, vsSource )
    const fragmentShader = loadShader( WebGL2RenderingContext.FRAGMENT_SHADER, fsSource )
    if ( !shaderProgram || !vertexShader || !fragmentShader )
        return null
    webgl2.attachShader( shaderProgram, vertexShader );
    webgl2.attachShader( shaderProgram, fragmentShader );
    webgl2.linkProgram( shaderProgram );
    if ( !webgl2.getProgramParameter( shaderProgram, WebGL2RenderingContext.LINK_STATUS ) ) {
        console.log( 'Shader link error: ' + webgl2.getProgramInfoLog( shaderProgram ) )
        return null
    }
    webgl2.useProgram( shaderProgram )
    return shaderProgram
}