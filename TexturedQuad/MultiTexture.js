var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n'+
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main(){\n'+
    '   gl_Position = a_Position;\n' +
    '   v_TexCoord = a_TexCoord;\n'+
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler0;\n'+
    'uniform sampler2D u_Sampler1;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main() {\n' +
    ' vec4 color0 = texture2D(u_Sampler0, v_TexCoord);\n' +
    ' vec4 color1 = texture2D(u_Sampler1, v_TexCoord);\n' +
    '   gl_FragColor = color0 * color1;\n' +
    '}\n';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;

var ANGLE = 180.0;

function main()
{
    var canvas = document.getElementById('webgl');
    if(!canvas){
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    if(!initShaders(gl,VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    
    var n = initVertexBuffers(gl);
    if(n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.clear(gl.COLOR_BUFFER_BIT);

    if(!initTextures(gl, n)){
        console.log('failed');
    }
    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5,0.5, 0.0, 1.0, 
        -0.5,-0.5, 0.0, 0.0, 
        0.5,0.5, 1.0, 1.0,
        0.5,-0.5, 1.0, 0.0
        /* -0.5,0.5, -0.3, 1.7, 
        -0.5,-0.5, -0.3, -0.2, 
        0.5,0.5, 1.7, 1.7,
        0.5,-0.5, 1.7, -0.2 */
    ]);
    var n = 4;

    var vertexTexCoordBuffer = gl.createBuffer();
    if(!vertexTexCoordBuffer) {
        console.log('Failed to create the buffer object ');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return n;
}

function initTextures(gl, n){
    var texture0 = gl.createTexture();
    var texture1 = gl.createTexture();
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    var image0 = new Image();
    var image1 = new Image();

    image0.onload = function() {
        loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
    }
    image1.onload = function() {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }

    image0.src = '../resources/sky.jpg';
    image1.src = '../resources/circle.gif';

    return true;
}

var g_texUnit0 = false, g_texUnit1 = false;
function loadTexture(gl, n, texture, u_Sampler, image, texUnit){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
    if(texUnit == 0){
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;    
    }else{
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    }
    gl.bindTexture(gl.TEXTURE_2D,texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(u_Sampler, texUnit);

    gl.clear(gl.COLOR_BUFFER_BIT);

    g_texUnit0 && g_texUnit1 && gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}