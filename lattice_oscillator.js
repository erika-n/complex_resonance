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
let checkRandom;
let checkLinear;
let linear = true;
let normalModes = [false, false, false, false];
let random = false;



class Phonon {
    timestep = 0.1;
    radius = 2;
    c = 0.00;
    mass = 1.0;
    x = 0;
    v = 0;
 

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

    updateForce(left_obj, right_obj){
        if(linear){
            this.updateForceLinear(left_obj, right_obj);
        }else{
            this.updateForceNonlinear(left_obj, right_obj);
        }
    }

    updateForceLinear(left_obj, right_obj) {
        // Linear coupling
        // F1  k(-2*x1 + x2 + x0), x0 = 0
        // F2  k(-2*x2 + x1 + x3), x3 = 0
        this.force = -2.0 * this.k * this.x + left_obj.k * left_obj.x + right_obj.k * right_obj.x;

    }

    updateForceNonlinear(left_obj, right_obj) {
        // FPUT (Fermi Pasta Ulam Tsingou) non-linear oscillator

        alpha = 0.9;
        this.force = (-2.0 * this.k * this.x + left_obj.k * left_obj.x + right_obj.k * right_obj.x) * (1 + alpha * (left_obj.x - right_obj.x));

    }

    updatePosition() {
        let a = this.force / this.mass;
        this.v += a * this.timestep;
        this.x += this.v * this.timestep;
    }

    draw(init_x, mult_x, y_loc) {
        noStroke()
        //circle(init_x + mult_x*this.x/2.0, y_loc, this.radius);
        circle(init_x, y_loc + 200 * this.x, this.radius);
    }

}

function reset() {


    let n_objects = int(nSlider.value()) + 2;

    objects = [n_objects];
    let k = PI ** kSlider.value();
    let zeta = 2.0 ** zetaSlider.value();

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
                objects[i].x += (1.0/normalModes.length)*sin((n + 1) * PI * i / (n_objects - 1));
            }
       }
        
    }
    if(random){
        rand_i = Math.floor((objects.length - 2)*Math.random()) + 1
        rand_r = 0.1*radius*Math.random()
        objects[rand_i].x = rand_r;
    }


}

function changedCheckboxEvent() {
    normalModes[0] = checkNormal1.checked();
    normalModes[1] = checkNormal2.checked();
    normalModes[2] = checkNormal3.checked();
    normalModes[3] = checkNormal4.checked();
    random = checkRandom.checked();
    linear = checkLinear.checked();
    reset();
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



    createDiv('spring constant (0 - 8 logarithmic)');
    kSlider = createSlider(-10, 4, 1);
    kSlider.mouseReleased(reset);
    createDiv('damping ratio (zeta, 0 - 2 logarithmic)');
    zetaSlider = createSlider(-20, 1, -10);
    zetaSlider.mouseReleased(reset);
    createDiv('n phonons');
    nSlider = createSlider(1, 500, 2*3*4 - 1);
    nSlider.mouseReleased(reset);
    createDiv('');

    createDiv('Normal Modes')
    checkNormal1 = createCheckbox('1', false);
    checkNormal2 = createCheckbox('2', false);
    checkNormal3 = createCheckbox('3', false);
    checkNormal4 = createCheckbox('4', false);
    checkRandom = createCheckbox('random', false);
    checkLinear = createCheckbox('Linear', true);
    checkNormal1.changed(changedCheckboxEvent);
    checkNormal2.changed(changedCheckboxEvent);
    checkNormal3.changed(changedCheckboxEvent);
    checkNormal4.changed(changedCheckboxEvent);
    checkRandom.changed(changedCheckboxEvent);
    checkLinear.changed(changedCheckboxEvent);



    createA('index.html', 'Return to index');
    reset();
}




function draw() {

    // update
    for (j = 0; j < 1; j++) {

        for (i = 1; i < objects.length - 1; i++) {
            left_obj = objects[i - 1];
            //right_obj = objects[n_objects - 1]; //TMPDEBUG: no leftwards communication
            right_obj = objects[i + 1];
            objects[i].updateForce(left_obj, right_obj);

        }



        for (i = 1; i < objects.length - 1; i++) {
            objects[i].updatePosition();
        }




    }





    // draw
    background(0);
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
