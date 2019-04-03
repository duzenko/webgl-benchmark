import { webgl2 } from 'globals'

export function loadTexture( url: string ) {
    const texture = webgl2.createTexture();
    webgl2.bindTexture( WebGL2RenderingContext.TEXTURE_2D, texture );

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = WebGL2RenderingContext.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = WebGL2RenderingContext.RGBA;
    const srcType = WebGL2RenderingContext.UNSIGNED_BYTE;
    const pixel = new Uint8Array( [0, 0, 255, 255] );  // opaque blue
    webgl2.texImage2D( WebGL2RenderingContext.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel );

    const image = new Image();
    image.onload = function () {
        webgl2.bindTexture( WebGL2RenderingContext.TEXTURE_2D, texture );
        webgl2.texImage2D( WebGL2RenderingContext.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image );
        webgl2.generateMipmap( WebGL2RenderingContext.TEXTURE_2D );
    };
    image.src = url;

    return texture;
}