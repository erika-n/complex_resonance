// Driven harmonic oscillator
// A simple oscillator drives another oscillator
// Other oscillator syncs to driving oscillator
// Resonance effect: amplitude highest at same natural frequency

mass1 = 1; // mass of object
k1 = 0.01;  // spring constant
y1 = 30.0; // y with inital offset (determines amplitude)
v1 = 0.0; // velocity with initial offset (determines phase)


mass2 = 0.05; // mass of object
k2 = k1;  // spring constant
y2 = 50; // y with inital offset (determines amplitude)
v2 = 0.0; // velocity with initial offset (determines phase)
zeta2 = 0.2; // damping ratio
c2 = 0; // damping coefficient

anchor_y = 0; // center


timestep = 0.1;

// stored values for wave drawing
values1 = [];
values2 = [];

n_values = 1000;

function setup(){
  w = 400;
  if(window.displayWidth < w){
    w = 0.8*window.displayWidth; //0.8*window.innerWidth;
    
  }
  h = 3.0*w/4.0;
  let canvas = createCanvas(w, h);  
  canvas.parent('p5_sketch');  
  anchor_y = height/2.0;
  values1 = [n_values];
  values2 = [n_values];
  
  c2 = zeta2*sqrt(mass2*k2);
  
  for(i = 0; i < n_values; i++){
    values1[i] = -1000;  
    values2[i] = -1000;
  }

}

function draw(){
  

  // update
  
  // simple oscillator
  F1 = -k1*y1;
  a1 = F1/mass1;
  v1 += a1*timestep;
  y1 += v1*timestep;

  //driven oscillator
  F2 = F1 - k2*y2 - c2*v2;
  a2 = F2/mass2;
  v2 += a2*timestep;
  y2 += v2*timestep;
  
  
  // store values
  for (i = n_values - 1; i > 0; i--) {
    values1[i] = values1[i-1];
    values2[i] = values2[i-1];
  }
  values1[0] = y1;
  values2[0] = y2;
  
  // draw
  background(0);
  
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
  line(anchor_x, anchor_y, anchor_x, anchor_y - y1);
  line(anchor_x, anchor_y - y1, anchor_x, anchor_y - y1 + y2);
  
  // oscillators
  osc1_color = color(0, 0, 255);
  osc2_color = color(0, 255, 0);
  fill(osc1_color);
  noStroke();
  circle(anchor_x, anchor_y - y1, 16);
  fill(osc2_color);
  circle(anchor_x, anchor_y - y1 + y2, 16);
  
  // wave
  wave_x0 = anchor_x + 50;
  wave_w = width - wave_x0 - 50;
  point_w = wave_w/n_values;
  stroke(255); 
  strokeWeight(3);
  
  for(i = 0; i < n_values - 1; i++){
    if(values1[i + 1] > -900){
      stroke(osc1_color);
      line(wave_x0 + point_w*i, anchor_y - values1[i], wave_x0 + point_w*(i + 1), anchor_y - values1[i + 1]);   
      stroke(osc2_color);
      line(wave_x0 + point_w*i, anchor_y - values1[i] + values2[i], wave_x0 + point_w* (i + 1), anchor_y - values1[i + 1] + values2[i + 1]);   
    }
    
  }
  
  
}
