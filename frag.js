const frag = `
	precision highp float;

	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform vec2 tex_size;
	uniform bool mouseIsPressed;
	uniform float u_time;
	uniform vec3 u_lightDir;
	uniform vec3 u_col;
	uniform mat3 uNormalMatrix;
	uniform float u_pixelDensity;
	uniform sampler2D u_tex_title;

	//attributes, in
	varying vec4 var_centerGlPosition;
	varying vec3 var_vertNormal;
	varying vec2 var_vertTexCoord;

	${frag_functions_default}

	void main(){
		vec2 st = var_vertTexCoord.xy /u_resolution.yy-0.5;
		vec2 i_st_original = floor(st); 
		if (cnoise(vec3(u_time*5.0))>0.3){
			st.x+=rand(st+i_st_original)/100.;
		}
		if (cnoise(vec3(u_time*50.))>0.5){
			st.y+=rand(st+0.5+i_st_original)/100.;
		}

		st*= scale2d(vec2(1.25));
		st.x+=0.1;
		st.y+=0.05;
		if (u_resolution.x<500./1000.){
			st*= scale2d(vec2(1.1));
			st.x+=0.2;
			st.y-=0.15;
			
		}
		st.x*=u_resolution.x/u_resolution.y*tex_size.y/tex_size.x;
		
 
		st.x += var_vertTexCoord.x * u_resolution.x /  tex_size.x ;
		st.y -= var_vertTexCoord.y * u_resolution.y /  tex_size.y-0.35 ;


		// st.y += 50. * u_resolution.y /  tex_size.y;
		// st.x-=0.4;

		st.y+= sin(st.x*10.+u_mouse.y)*0.03;

		// }

		vec2 i_st = floor(st*40.);
		
		float tileC = mod(st.x+ cnoise(vec3(i_st,u_time*(mouseIsPressed?5.:1.))),20.)>20.?1.:0.;
		
		vec3 color = vec3(1.);
		
		// if (mouseIsPressed){

		// 	if (sin(st.x*100.)>0.9){
		// 		st.x+=mod(st.x,0.05);	
		// 	}
		// 	if (sin(st.y*100.)>0.9){
		// 		st.y+=mod(st.y,0.05);	
		// 	}
		// }
	
		st += rand(st)/510.;
		float d = distance(u_mouse,st);
		if (cnoise(vec3(i_st.y+u_time*1.))>0.){
			st.x+= sin(u_time+i_st.y*20.+u_mouse.x/2.)*0.02;
		}
		st+=d*0.1;
		
		if (mouseIsPressed){
			if (sin(st.x*50.+ mod(st.y,100.)*20.)>0.5){
				st.x+= floor(30.*rand(st+u_time*5.+u_mouse.y/5.))/1000.*d;
			}
		}


		if (mouseIsPressed){
			float dd = distance(st,u_mouse );
			// if (dd<0.2){
			st.x+=rand(st)*(0.002/dd/dd);

		}


		vec4 textTitle = texture2D(u_tex_title,st);
		vec3 tColor = vec3(1.)-vec3(textTitle.a)-tileC;
		bool tiles = mod(st.x*0.2+i_st.x+u_time/20. ,0.5+u_time/50.)>0.5;
		
		vec4 finalColor = vec4(tColor,tColor.r>=0.3?0.:0.95);
		if (tiles && rand(i_st)>0.95){
			finalColor= vec4(0.,0.,0.,1.);	
		}
		

		
		if (st.x<0. || st.x> 1.) finalColor.a = 0.;
		if (st.y<0. || st.y> 1.) finalColor.a = 0.;

		gl_FragColor= finalColor;
	}
`;
