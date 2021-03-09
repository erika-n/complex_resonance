
// Simple harmonic oscillator:
// Force of spring = constant times spring length
// Creates a perfect sine wave

// these determine frequency
mass = 1; // mass of object
k = 0.1;  // spring constant

y = 40.0; // y with inital offset (determines amplitude)
v = 0.0; // velocity with initial offset (determines phase)


anchor_y = 0; // center


timestep = 0.1;

// stored values for wave drawing
values = [];
n_values = 500;

function setup(){
  w = 500;
  if(window.outerWidth < w){
    w = 0.8*window.outerWidth; //0.8*window.innerWidth;
    
  }
  h = 3.0*w/4.0;
  let canvas = createCanvas(w, h);  
  canvas.parent("p5_sketch");
  anchor_y = height/2.0;
  values = [n_values];
  for(i = 0; i < values.length; i++){
    values[i] = -1000;  
  }


}

function draw(){
  
  background(0);
  
  // update
  F = -k*y; // spring force
  a = F/mass; // acceleration
  v += a*timestep;
  y += v*timestep;

  
    // Shift the values to the right
  for (i = n_values - 1; i > 0; i--) {
    values[i] = values[i-1];
  }
  values[0] = y;
  
  // draw
  
  // center line
  
  stroke(255);
  strokeWeight(0.2);
  line(30, anchor_y, width - 30, anchor_y);
  
  // anchor
  fill(255);
  noStroke();
  anchor_x = width/6.0;
  circle(anchor_x, anchor_y, 6);

  // pendulum connector line
  stroke(255);
  strokeWeight(1);
  line(anchor_x, anchor_y, anchor_x, anchor_y - y);
  
  // oscillator
  fill(0, 0, 255);
  noStroke();
  circle(anchor_x, anchor_y - y, 14);
  
  // wave
  wave_buffer = 30;
  wave_x0 = anchor_x + wave_buffer;
  wave_w = width - wave_x0 - wave_buffer;
  point_w = wave_w/n_values;
  stroke(0, 0, 255);
  strokeWeight(0.5);
  
  strokeWeight(3);
  for(i = 0; i < n_values - 1; i++){
    if(values[i + 1] > -900){
      line(wave_x0 + point_w*i, anchor_y - values[i], wave_x0 + point_w*(i + 1), anchor_y - values[i + 1]);   
    }
    
  }
  
  
}
