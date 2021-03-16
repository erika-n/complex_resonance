// lattice oscillator
// based on phonons in a lattice (https://en.wikipedia.org/wiki/Phonon#Classical_treatment)

objects = [];
y_loc = 0;
max_kinetic_energy = 0;
force = 0;
let resetButton;
let kSlider;
let zetaSlider;
let timestepSlider;
let nSlider;


class Phonon{
  timestep = 0.1;
  radius = 2;
  c = 0.00; 
  mass = 1.0;
  x = 0;
  v = 0;

  constructor( x, v, k, zeta){
    this.x = x;
    this.v = v;
    this.k = k;
    this.setZeta(zeta);
  }

  // Set damping ratio
  setZeta(zeta){
    this.c = zeta*2*sqrt(this.mass*this.k);  
  }


  updateForce(left_obj, right_obj){

    // F1 = -kx1 + k(x2 - x1) = -2kx1 + kx2 = k(-2*x1 + x2)
    // F2 = -k(x2 - x1) + k(-x2) = -2kx2 + kx1 = k(-2*x2 + x1)


    // F1  k(-2*x1 + x2 + x0), x0 = 0
    // F2  k(-2*x2 + x1 + x3), x3 = 0


    this.force = -2.0*this.k*this.x + left_obj.k*left_obj.x + right_obj.k*right_obj.x;
    this.force -= this.c*this.v;

  }

  updatePosition(){
    let a = this.force/this.mass;
    this.v += a*this.timestep;
    this.x += this.v*this.timestep;
  }

  draw(init_x, mult_x, y_loc){
    noStroke()
    //circle(init_x + mult_x*this.x/2.0, y_loc, this.radius);
    circle(init_x, y_loc + 200*this.x, this.radius);
  }

}

function reset(){
  let n_objects = int(nSlider.value()) + 2;
  objects = [n_objects];
  let k = PI**kSlider.value();
  let zeta = 2.0**zetaSlider.value();

  let r = int(0.8*width/n_objects);
  if(r < 2){
    r = 2;
  }
  if( r > 12){
    r = 12;
  }
  for(i = 0; i < n_objects; i++){
    objects[i] = new Phonon(0, 0, k, 0.01);
    objects[i].setZeta(zeta);
    objects[i].radius = r;
  }
  objects[int(n_objects/30.0) + 1].x = 1.0;


}



function setup(){
  w = 0.9*displayWidth;
  // if(0.8*window.displayWidth < w){
  //   w = 0.8*window.displayWidth; 
    
  // }
  h = 0.5*w;
  let canvas = createCanvas(w, h);  
  canvas.parent('p5_sketch'); 
  
  y_loc = height/2.0;
  colorMode(HSB, 255);

  

  createDiv('spring constant (0 - 8 logarithmic)');
  kSlider = createSlider(-10, 3, 1);
  kSlider.mouseReleased(reset);
  createDiv('damping ratio (zeta, 0 - 2 logarithmic)');
  zetaSlider = createSlider(-20, 1, -10);
  zetaSlider.mouseReleased(reset);
  createDiv('n phonons');
  nSlider = createSlider(1, 500, 100, 1);
  nSlider.mouseReleased(reset);
  createDiv('');
  createA('index.html', 'Return to index');
  reset();
}




function draw(){

  // update
  for(j = 0; j < 1; j++){

    for(i = 1; i < objects.length- 1; i++){
      left_obj = objects[i - 1];
      //right_obj = objects[n_objects - 1]; //TMPDEBUG: no leftwards communication
      right_obj = objects[i + 1];
      objects[i].updateForce(left_obj, right_obj);

    }  

    for(i = 1; i < objects.length - 1; i++){
      objects[i].updatePosition();
    }

  }


  // draw
  background(0);
  x0 = width/10.0;
  xwidth = width - 2*x0;
  xinc = xwidth/(objects.length - 1);

  stroke(255);
  strokeWeight(0.3);
  line(x0, y_loc, x0 + xwidth, y_loc);

  // stroke(0.3*255, 255, 255);
  // strokeWeight(0.2);
  // let y_lim = 200;
  // line(x0, y_loc + y_lim, x0 + xwidth, y_loc + y_lim);
  // line(x0, y_loc - y_lim, x0 + xwidth, y_loc - y_lim);

  noStroke();


  
  for(i = 1; i < objects.length - 1; i++){
    fill(255*i/objects.length, 255, 255);
    objects[i].draw(x0 + i*xinc, xinc, y_loc);
  }                    

  fill(90);

  objects[0].draw(x0, xinc, y_loc);
  objects[objects.length - 1].draw(x0 + xwidth, xinc, y_loc);


}
