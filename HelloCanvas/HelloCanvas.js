var VSHADER_SOURCE = 
    'attribute vec4 a_Position; \n'+
    'attribute float a_PointSize; \n'+
    'void main(){\n'+
    '   gl_Position = a_Position;\n' +
    '   gl_PointSize = a_PointSize;\n' +
    '}\n';

var FSHADER_SOURCE = 
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +
    'void main() {\n' +
    '   gl_FragColor = u_FragColor;\n' +
    '}\n';



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
    
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        console.log('Failed to get the storage location of a_PointSize');
        return;
    }
    gl.vertexAttrib1f(a_PointSize, 50.0);

    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) { 
        console.log('Failed to get u_FragColor variable'); 
        return; 
    } 
       
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_Position, u_FragColor)}

    // gl.drawArrays(gl.POINTS, 0, 1);
}

var g_points = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ( (x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = ( canvas.height/2 - (y - rect.top))/(canvas.height/2);
    g_points.push([x,y]);
    var c3 = Math.sqrt(x*x + y*y);
    if(c3 > 1){
        c3 = 1.0;
    }
    g_colors.push([Math.abs(x) , Math.abs(y), c3, 1.0]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i = 0; i < len; i++){
        gl.vertexAttrib2fv(a_Position, g_points[i]);
        gl.uniform4fv(u_FragColor, g_colors[i]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}