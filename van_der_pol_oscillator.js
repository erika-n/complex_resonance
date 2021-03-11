// Van der Pol oscillator
// Jenkins, "Self-oscillation" pg. 17


y1 = 0; // y with inital offset (determines amplitude)
v1 = 0; // velocity with initial offset (determines phase)
alpha1 = 0;
beta1 = 0;
omega1 = 0;

setting = 3;

if(setting == 0){
  // increases amplitude then levels off (Fig. 11 (a))
  y1 = 0.1; // y with inital offset (determines amplitude)
  v1 = 0.0; // velocity with initial offset (determines phase)
  alpha1 = 0.2;
  beta1 = 0.2;
  omega1 = 1.0;
}else if(setting ==1 ){
  // decreases amplitude then levels off (Fig. 11(b))
  y1 = 4.0; // y with inital offset (determines amplitude)
  v1 = -4.0; // velocity with initial offset (determines phase)
  alpha1 = 0.2;
  beta1 = 0.2;
  omega1 = 1.0;

}else if(setting == 2){
  // sharp buildup and decay (Fig. 12(a))
  y1 = 0.1;
  v1 = 0.0;
  alpha1 = 5.0;
  beta1 = 5.0;
  omega1 = 1.0;
}else if(setting == 3){
  // sharp buildup and decay (Fig. 12(b))
  y1 = 2.2;
  v1 = -12.0;
  alpha1 = 5.0;
  beta1 = 5.0;
  omega1 = 1.0;
}



anchor_y = 0; // center


timestep = 0.02;

// stored values for wave drawing
values1 = [];

n_values = 1000;

function setup(){
  w = 400;
  if(0.75*window.displayWidth < w){
    w = 0.8*window.displayWidth; 
    
  }
  h = 3.0*w/4.0;
  let canvas = createCanvas(w, h);  
  canvas.parent('p5_sketch');  
  anchor_y = height/2.0;
  values1 = [n_values];
  
  for(i = 0; i < n_values; i++){
    values1[i] = -1000;  
  }

}

function draw(){
  
  debugger;
  // update
  
  // van der pol oscillator

  a1 = (alpha1 - beta1*y1**2)*v1 - omega1**2*y1;
  v1 += a1*timestep;
  y1 += v1*timestep;

  
  // store values
  for (i = n_values - 1; i > 0; i--) {
    values1[i] = values1[i-1];

  }
  values1[0] = y1;

  
  // draw
  background(0);
  y_mult = 20;

  // center line
  
  stroke(255);
  strokeWeight(0.2);
  line(30, anchor_y, width - 30, anchor_y);
  
  // anchor
  fill(255);
  noStroke();
  anchor_x = width/6.0;
  circle(anchor_x, anchor_y, 6);

  // pendulum connector line2
  stroke(255);
  strokeWeight(1);
  line(anchor_x, anchor_y, anchor_x, anchor_y - y_mult*y1);
 
  // oscillators
  osc1_color = color(0, 0, 255);
  osc2_color = color(0, 255, 0);
  fill(osc1_color);
  noStroke();
  circle(anchor_x, anchor_y - y_mult*y1, 12);

  
  // wave
  wave_x0 = 2.0*anchor_x;
  wave_w = width - wave_x0 - 100;
  point_w = wave_w/n_values;
  stroke(255); 
  strokeWeight(3);
  
  for(i = 0; i < n_values - 1; i++){
    if(values1[i + 1] > -900){
      stroke(osc1_color);
      line(wave_x0 + point_w*i, anchor_y - y_mult*values1[i], wave_x0 + point_w*(i + 1), anchor_y - y_mult*values1[i + 1]);   
    }
  }
  
  
}
