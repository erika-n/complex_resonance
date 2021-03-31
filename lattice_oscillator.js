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

let checkNormal1;
let checkNormal2;
let checkNormal3;
let checkNormal4;
let checkPluck;
let checkLinear;
let linear = true;
let normalModes = [false, false, false, false];
let pluck= false;
let pluc_loc = 0;
let pluck_force = 1;
let pluck_i = 0;



class Phonon {
    timestep = 0.3;
    radius = 2;
    c = 0.00;
    mass = 1.0;
    x = 0;
    v = 0;
    additional_force = 0;
 

    constructor(x, v, k, zeta) {
        this.x = x;
        this.v = v;
        this.k = k;
        this.setZeta(zeta);
    }

    // Set damping ratio
    setZeta(zeta) {
        this.c = zeta * 2 * sqrt(this.mass * this.k);
    }

    updateForce(neighbors){
        if(linear){
            this.updateForceLinear(neighbors);
        }else{
            this.updateForceNonlinear(neighbors);
        }
    }

    springForce(){
        return this.k*this.x;
    }

    updateForceLinear(neighbors) {
        // Linear coupling
        // F = k(-2*x1 + x2 + x0)

        let f = 0;
 
        for(let i = 0; i < 2; i++){
            f += neighbors[i].springForce();
        }
        f += -1*neighbors.length * this.springForce();
        f -= this.c*this.v;
        f += this.additional_force;
        this.force = f;

    }

    updateForceNonlinear(neighbors) {
        // FPUT (Fermi Pasta Ulam Tsingou) non-linear oscillator
        // ONLY WORKS IN 1-D!
        this.updateForceLinear(neighbors) 
        let alpha = 0.9;
        let nlForce = 1 + alpha * (neighbors[0].x - neighbors[1].x);
        this.force *= nlForce;
    }

    updatePosition() {
        let a = this.force / this.mass;
        this.v += a * this.timestep;
        this.x += this.v * this.timestep;
        this.additional_force = 0;
    }

    draw(init_x, mult_x, y_loc) {
        noStroke()
        //circle(init_x + mult_x*this.x/2.0, y_loc, this.radius);
        circle(init_x, y_loc + 0.5*height * this.x, this.radius);
    }

}

function reset() {
    normalModes[0] = checkNormal1.checked();
    normalModes[1] = checkNormal2.checked();
    normalModes[2] = checkNormal3.checked();
    normalModes[3] = checkNormal4.checked();
    pluck = checkPluck.checked();
    linear = checkLinear.checked();

    let n_objects = int(nSlider.value()) + 2;

    objects = [n_objects];
    let k = 0.01*4*kSlider.value();
    let zeta = 0.0001*zetaSlider.value();

    let radius = int(0.8 * width / n_objects);
    if (radius < 2) {
        radius = 2;
    }
    if (radius > 12) {
        radius = 12;
    }

    for (i = 0; i < n_objects; i++) {
        objects[i] = new Phonon(0, 0, k, 0.01);
        objects[i].setZeta(zeta);
        objects[i].radius = radius;
        objects[i].x = 0
        for(n = 0; n < normalModes.length; n++){
            if(normalModes[n]){
                objects[i].x += (0.5/normalModes.length)*sin((n + 1) * PI * i / (n_objects - 1));
            }
       }
        
    }

    if(pluck){
        // pluck_i = 10; // do pluck over n cycles;
        // pluck_force = 0.01;
        // pluck_loc = int(0.5*objects.length);

        pluck_freq = 3.1
        for (i = 1; i < n_objects - 1; i++) {
        
            objects[i].x = 0.4*sin(pluck_freq* PI * i / (n_objects - 1));
            
       }

    }


}



function setup() {
    w = 0.9 * displayWidth;
    // if(0.8*window.displayWidth < w){
    //   w = 0.8*window.displayWidth; 

    // }
    h = 0.5 * w;
    let canvas = createCanvas(w, h);
    canvas.parent('p5_sketch');

    y_loc = height / 2.0;
    colorMode(HSB, 255);



    createDiv('spring constant');
    kSlider = createSlider(0, 100, 50, 0);
    kSlider.mouseReleased(reset);
    createDiv('damping ratio');
    zetaSlider = createSlider(0, 100, 10, 0);
    zetaSlider.mouseReleased(reset);
    createDiv('n phonons');
    nSlider = createSlider(1,200, 2*3*4*5 - 1);
    nSlider.mouseReleased(reset);
    createDiv('');

    createDiv('Normal Modes')
    checkNormal1 = createCheckbox('1', true);
    checkNormal2 = createCheckbox('2', false);
    checkNormal3 = createCheckbox('3', false);
    checkNormal4 = createCheckbox('4', false);
    checkPluck = createCheckbox('pluck', false);
    checkLinear = createCheckbox('Linear', true);
    checkNormal1.changed(reset);
    checkNormal2.changed(reset);
    checkNormal3.changed(reset);
    checkNormal4.changed(reset);
    checkPluck.changed(reset);
    checkLinear.changed(reset);



    createA('index.html', 'Return to index');

    reset();
}




function draw() {

    // update
    for (let j = 0; j < 5; j++) {

        if(pluck_i > 0){

            objects[pluck_loc].additional_force += pluck_force;
            pluck_i -= 1;
        }

        for (let i = 1; i < objects.length - 1; i++) {
            left_obj = objects[i - 1];
            //right_obj = objects[n_objects - 1]; //TMPDEBUG: no leftwards communication
            right_obj = objects[i + 1];
        
            neighbors = Array();
            neighbors.push(left_obj);
            neighbors.push(right_obj);
            objects[i].updateForce([left_obj, right_obj]);

        }





        for (let i = 1; i < objects.length - 1; i++) {
            objects[i].updatePosition();
        }




    }





    // draw
    background(20);
    x0 = width / 10.0;
    xwidth = width - 2 * x0;
    xinc = xwidth / (objects.length - 1);

    stroke(255);
    strokeWeight(0.3);
    line(x0, y_loc, x0 + xwidth, y_loc);

    // stroke(0.3*255, 255, 255);
    // strokeWeight(0.2);
    // let y_lim = 200;
    // line(x0, y_loc + y_lim, x0 + xwidth, y_loc + y_lim);
    // line(x0, y_loc - y_lim, x0 + xwidth, y_loc - y_lim);

    noStroke();



    for (i = 1; i < objects.length - 1; i++) {
        fill(255 * i / objects.length, 255, 255);
        objects[i].draw(x0 + i * xinc, xinc, y_loc);
    }

    fill(90);

    objects[0].draw(x0, xinc, y_loc);
    objects[objects.length - 1].draw(x0 + xwidth, xinc, y_loc);

  
}
