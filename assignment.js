var gl;
var theta;
var translation;
var scale1 = 1;
var scale2 = 1;
var thetaLoc;
var color_location;
var Tx = 0.5, Ty = 0.5, Tz = 0.0;
var color1 ;
var color2 ;
var color3 ;
var color4 = 1.0;
var rotate_counter = 0.0;
var translation1 = 0.;
var translation2 = 0.;
var vertices = [vec2(-0.9, -0.5), //1
					vec2(-0.8, -0.5), //2
					vec2(-0.9,  0.5), //3	
					vec2(-0.8,  0.5), //4
					vec2(-0.8,  0.35), //5
					vec2(-0.75, 0.435),//6
					vec2(-0.55,  0.0), //7
					vec2(-0.5,  0.1), //8
					vec2(-0.45,  0.0), //9
					vec2(-0.25, 0.435),//10
					vec2(-0.2,  0.35), //11
					vec2(-0.2,  0.5), //12	
					vec2(-0.1,  0.5), //13 
					vec2(-0.2, -0.5), //14 
					vec2(-0.1, -0.5), //15
					vec2(0.2,  -0.5), //16	
					vec2(0.3,  -0.5), //17 
					vec2(0.2,   0.5), //18					
					vec2(0.3,  0.5), //19
					vec2(0.3,  0.27), //20	
					vec2(0.35, 0.4), //21
					vec2(0.65, -0.402), //22
					vec2(0.7,  -0.27), //23
					vec2(0.7,  -0.5), //24
					vec2(0.8, -0.5), //25
					vec2( 0.7, 0.5), //26
					vec2( 0.8,  0.5) ]; //27 
					
for(var i = 0 ;i<27; i++)
{
	vertices[i][0] += 0.05;
	
}					

window.onload = function init()
{

	const canvas = document.querySelector("#glcanvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl)
	{ 
		alert("Unable to initialize WebGl. Your browser or machine may not support it.");
		return;
	}
	
	var program = initShaders(gl, "vertex-shader", "fragment-shader" );

	gl.useProgram( program );
	


	//COLOR

	document.getElementById("slider0").onchange = 
		function() 
		{
			color1 = slider0.value;
			buffer_things();
			
		};
	document.getElementById("slider1").onchange = 
		function() 
		{
			color2 = slider1.value;
			buffer_things();
			
		};
	document.getElementById("slider2").onchange = 
		function() 
		{
			color3 = slider2.value;
			buffer_things();
			
		};
		
	document.getElementById("slider3").onchange = 
		function() 
		{
			color4 = slider3.value;
			buffer_things();
			
		};
	
	//ROTATE WITH BUTTONS
	var myButton_Rotate = document.getElementById("ClockwiseButton");
	myButton_Rotate.addEventListener("click", function () {rotate_counter += -0.01; });
	
	var myButton_Rotate2 = document.getElementById("CounterClockwiseButton");
	myButton_Rotate2.addEventListener("click", function () {rotate_counter += +0.01; });

	//REFRESH PAGE WIH BUTTON
	var myButton_Refresh = document.getElementById("refresh_page");
	myButton_Refresh.addEventListener("click", function () {location.reload();; });


	//ZOOM WITH BUTTONS
	var myButton_zoom_in = document.getElementById("zoom_in");
	myButton_zoom_in.addEventListener("click", 
		function () 
		{ 
			for(var i = 0;i<27;i++)
			{
				//vertices[i] = scale (1.05,vertices[i]);	
				scale1 *= 1.01;
				scale2 *= 1.01;
			}
			buffer_things();
		});
	

	var myButton_zoom_out = document.getElementById("zoom_out");
	myButton_zoom_out.addEventListener("click", 
		function () 
		{ 
			for(var i = 0;i<27;i++)
			{
				//vertices[i] = scale (0.95,vertices[i]);
				scale1 *= 0.99;
				scale2 *= 0.99;
			}
			
			buffer_things();
		});



	//ZOOM WITH WHEEL
	window.addEventListener("wheel", 
		function()
		{
			if(event.deltaY < 0)
			{
				for(var i = 0;i<27;i++)
				{
				//vertices[i] = scale (1.05,vertices[i]);
				scale1 *= 1.01;
				scale2 *= 1.01;
				}
			buffer_things();
				
			}	
			else if(event.deltaY > 0)
			{
				for(var i = 0;i<27;i++)
				{
				//vertices[i] = scale (0.95,vertices[i]);
				scale1 *= 0.99;
				scale2 *= 0.99;
				}
			buffer_things();	
			}				
			
		});
		
		
	//ARROW KEYS	
	window.onkeydown = 
	function(event) 
	{
		
		if(event.keyCode == "38")
		{
			for(var i = 0;i<27;i++)
			{
				//vertices[i] = scale (1,add(vertices[i], vec2(0.,0.01)));
				translation2 += 0.001;
			}
		}
		
		else if(event.keyCode == "37")
		{
			for(var i = 0; i<27 ;i++)
			{
				//vertices[i] = add(vertices[i], vec2(-0.01,0.0));
				translation1 += -0.001;
			}
		}
		else if(event.keyCode == "39")
		{
			for(var i = 0; i<27 ;i++)
			{
				//vertices[i] = add(vertices[i], vec2(0.01,0.0));
				translation1 += 0.001;
			}
		}
		
		else if (event.keyCode == "40")
		{
			for(var i = 0;i<27;i++)
			{
				//vertices[i] = add(vertices[i], vec2(0.,-0.01));
			translation2 += -0.001;

			}
		}
	buffer_things();
	};




	buffer_things();
	function buffer_things()
	{
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
	
	// Associate out shader variables with our data buffer 	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	//TRANSLATION
	translation = gl.getUniformLocation( program, "translation" );
	gl.uniform4f(translation, translation1, translation2, 0.0,0.0);
	
	
	//SCALING
	var scaling = gl.getUniformLocation(program, 'scaling');
	gl.uniform4f(scaling, scale1,scale1,1.,1. );

	//COLOR
	color_location = gl.getUniformLocation(program,"my_color")
	gl.uniform4f(color_location, color1, color2, color3, color4);
	
	//ROTATION
	thetaLoc = gl.getUniformLocation(program, "theta");
	theta = 0;
	gl.uniform1f(thetaLoc, theta);
	gl.clearColor(0.8, 0.8, 0.8, 1.0);


	requestAnimFrame(render);
	}
	


};

function render()
{

		

	gl.clear(gl.COLOR_BUFFER_BIT);
	theta = rotate_counter;
	gl.uniform1f(thetaLoc, theta);


	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 27);
	requestAnimFrame(render);
	
}

