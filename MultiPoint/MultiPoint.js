var VSHADER_SOURCE = 
    'attribute vec4 a_Position; \n'+
    // 'attribute float a_PointSize; \n'+
    // 'uniform vec4 u_Translation;'+
    'uniform float u_CosB, u_SinB;\n'+
    'void main(){\n'+
    'gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n'+
    'gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n'+
    // '   gl_Position = a_Position + u_Translation;\n' +
    // '   gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';

var Tx = 0.5, Ty = 0.5, Tz = 0.0;

var ANGLE = 90.0;

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

    /* var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 5.0); */

    /* var u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');

    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0); */

    var radian = Math.PI * ANGLE / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    var u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');

    gl.uniform1f(u_CosB, cosB);
    gl.uniform1f(u_SinB, sinB);

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) { 
        console.log('Failed to get u_FragColor variable'); 
        return; 
    } 
    gl.uniform4fv(u_FragColor, [1.0, 1.0, 0.0, 1.0]);
       
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        -0.5,0.5, -0.5,-0.5, 0.5,0.5, 0.5,-0.5
    ]);
    var n = 4;

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