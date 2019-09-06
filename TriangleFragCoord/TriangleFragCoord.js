var VSHADER_SOURCE = 
    'attribute vec4 a_Position; \n'+
    'void main(){\n'+
    '   gl_Position = a_Position;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    // 'uniform vec4 u_FragColor;\n' +
    'uniform float u_Width;\n'+
    'uniform float u_Height;\n'+
    'void main() {\n' +
    '   gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);\n' +
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

    /* var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) { 
        console.log('Failed to get u_FragColor variable'); 
        return; 
    } 
    gl.uniform4fv(u_FragColor, [1.0, 1.0, 0.0, 1.0]); */

    var u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    gl.uniform1f(u_Width, gl.drawingBufferWidth);
    var u_Height = gl.getUniformLocation(gl.program, 'u_Height');
    gl.uniform1f(u_Height, gl.drawingBufferHeight);
       
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0,0.5, -0.5,-0.5, 0.5,-0.5
    ]);
    var n = 3;

    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer) {
        console.log('Failed to create the buffer object ');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position);

    return n;
}