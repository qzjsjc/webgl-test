var VSHADER_SOURCE = 
    'attribute vec4 a_Position; \n'+
    // 'uniform mat4 u_xformMatrix;'+
    'uniform mat4 u_ModelMatrix;\n'+
    'void main(){\n'+
    // '   gl_Position = u_xformMatrix * a_Position;\n' +
    '   gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';

var Tx = 0.50, Ty = 0, Tz = 0.0;

var ANGLE = 45.0;

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

    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    /* var xformMatrix = new Float32Array([
        cosB, sinB, 0.0, 0.0, 
        -sinB, cosB, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 
        0.0, 0.0, 0.0, 1.0
    ]); */

    /* var xformMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.5, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0, 
        0.0, 0.0, 0.0, 1.0
    ]); */

    /* var xformMatrix = new Matrix4();
    xformMatrix.setRotate(ANGLE,0,0,1); 
    
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);*/

    var modelMatrix = new Matrix4();
    /* modelMatrix.setRotate(ANGLE,0,0,1);
    modelMatrix.translate(Tx, Ty, Tz); */
    modelMatrix.setTranslate(Tx, Ty, Tz);
    modelMatrix.rotate(ANGLE,0,0,1);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) { 
        console.log('Failed to get u_FragColor variable'); 
        return; 
    } 
    gl.uniform4fv(u_FragColor, [1.0, 1.0, 0.0, 1.0]);
       
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var x

    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5,0.5, -0.5,-0.5, 0.5,0.5//, 0.5,-0.5
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