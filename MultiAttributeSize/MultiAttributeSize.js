var VSHADER_SOURCE = 
    'attribute vec4 a_Position; \n'+
    'attribute float a_PointSize; \n'+
    'attribute vec4 a_Color;\n'+
    'varying vec4 v_Color;\n'+
    'void main(){\n'+
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = a_PointSize;\n' +
    '   v_Color = a_Color;\n'+
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '   gl_FragColor = v_Color;\n' +
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

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);


    // gl.drawArrays(gl.POINTS, 0, n);
    // gl.drawArrays(gl.LINE_LOOP, 0, n);
    gl.drawArrays(gl.TRIANGLES, 0, n);
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    // gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

function initVertexBuffers1(gl) {
    var vertices = new Float32Array([
        0.0,0.5, -0.5,-0.5, 0.5,-0.5
    ]);
    var n = 3;

    var sizes = new Float32Array([
        10.0, 20.0, 30.0
    ]);

    var vertexBuffer = gl.createBuffer();
    var sizeBuffer = gl.createBuffer();

    if(!vertexBuffer||!sizeBuffer) {
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

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
}

function initVertexBuffers(gl){
    var verticesSizes = new Float32Array([
        0.0, 0.5,  10.0,  1.0, 0.0, 0.0, 
        -0.5, -0.5,  20.0,  0.0, 1.0, 0.0, 
        0.5, -0.5,  30.0,  0.00, 0.0, 1.0
    ]);
    var n = 3;

    var vertexSizeBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    var FSIZE = verticesSizes.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
    gl.enableVertexAttribArray(a_PointSize);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}