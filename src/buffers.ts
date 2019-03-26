export function initBuffers( gl: WebGL2RenderingContext ) {
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer )
    //gl.bufferData( gl.ARRAY_BUFFER, null, gl.STATIC_DRAW )

    gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 0, 0 )
    //gl.enableVertexAttribArray( 0 );
    return {
        position: positionBuffer,
    };
}