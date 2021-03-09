// Damped harmonic oscillator:
// Oscillator with friction (damping) such that its amplitude drops over time

// these determine frequency
mass = 1; // mass of object
k = 1/10.0;  // spring constant


y = 100.0; // y with inital offset (determines amplitude)
v = 0.0; // velocity with initial offset (determines phase)

// zeta > 0: overdamped (goes to zero with no oscillation)
// zeta = 0: critically damped (goes to zero as quickly as possible without oscillation
// zeta < 0: underdamped (oscillates while amplitude decreases)
zeta = 0.1; // damping ratio

c = 0; // damping constant


anchor_y = 0; // center


timestep = 0.1;

// stored values for wave drawing
values = [];
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
  values = [n_values];
  
  c = zeta*2*sqrt(k*mass); // get damping constant from zeta, k, and mass
  
  for(i = 0; i < n_values; i++){
    values[i] = -1000;  
  }

}

function draw(){
  
  background(0);
  
  // update
  F = -k*y - c*v; // spring force - damping force
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
  wave_x0 = anchor_x + 100;
  wave_w = width - wave_x0 - 100;
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
