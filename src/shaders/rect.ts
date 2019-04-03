import * as shaders from "shaders"
import * as Globals from "globals"

export { rectShader }

class RectShader extends shaders.BaseShader {
    Draw() {
        Globals.webgl2.drawArrays( WebGL2RenderingContext.TRIANGLE_FAN, 0, 4 )
    }
    Center( x: number, y: number ) {
        var loc = Globals.webgl2.getUniformLocation( this.handle, 'center' )
        Globals.webgl2.uniform2f( loc, x, y )
    }
    Size( w: number, h: number ) {
        var loc = Globals.webgl2.getUniformLocation( this.handle, 'size' )
        Globals.webgl2.uniform2f( loc, w, h )
    }
    set Brightness( value: number ) {
        var loc = Globals.webgl2.getUniformLocation( this.handle, 'brightness' )
        Globals.webgl2.uniform1f( loc, value )
    }
    set Contrast( value: number ) {
        var loc = Globals.webgl2.getUniformLocation( this.handle, 'contrast' )
        Globals.webgl2.uniform1f( loc, value )
    }
    set Saturation( value: number ) {
        var loc = Globals.webgl2.getUniformLocation( this.handle, 'saturation' )
        Globals.webgl2.uniform1f( loc, value )
    }
}

var rectShader: RectShader = new RectShader( 'rect' )
