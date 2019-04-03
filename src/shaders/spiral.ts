import * as shaders from "shaders"
import { webgl2 } from "globals"

export { spiralShader }

class SpiralShader extends shaders.BaseShader {
    Draw() {
        if ( !this.Use() )
            return
        webgl2.drawArrays( WebGL2RenderingContext.LINE_STRIP, 0, 11111 )
    }
}

var spiralShader: SpiralShader = new SpiralShader( 'spiral' )
