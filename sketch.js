let teapot;
let rot;
let sliderHue;
let sliderNumRings;
let sliderTeapotsPerRing;
let numRings = 5; // Number of rings of teapots around the central teapot
let teapotsPerRing = 20; // Number of teapots in each ring
let initialHues = []; // Array to store initial hues for each ring

function preload() {
  teapot = loadModel('teapot.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);

  // Create sliders for different properties
  sliderHue = createSlider(0, 360, 120);
  sliderHue.position(10, 10);
  sliderHue.style('width', '80px');

  sliderNumRings = createSlider(1, 10, 5, 1); // Min, max, initial value, step
  sliderNumRings.position(10, 50);
  sliderNumRings.style('width', '80px');

  sliderTeapotsPerRing = createSlider(5, 50, 20, 5); // Min, max, initial value, step
  sliderTeapotsPerRing.position(10, 100);
  sliderTeapotsPerRing.style('width', '80px');

  rot = 0;

  // Initialize initial hues for each ring
  for (let j = 0; j < numRings; j++) {
    initialHues[j] = random(360);
  }
}

function drawGalaxyBackground() {
  // Extend galaxy background beyond canvas boundaries
  let offsetX = width / 2;
  let offsetY = height / 2;

  // Set galaxy background
  background(0); // Black background
  randomSeed(4); // Set seed for consistent randomness
  noStroke();

  // Draw stars
  for (let i = 0; i < 500; i++) { // Draw 500 stars
    let x = random(-offsetX, width + offsetX); // X pos
    let y = random(-offsetY, height + offsetY); // Y pos
    let starSize = random(1, 5);
    fill(280, 75, 100, random(200)); // Purple color with randomized transparency
    ellipse(x, y, starSize, starSize);
  }
}

function draw() {
  drawGalaxyBackground();
  
  pointLight(0, 0, 100, 0, 0, 300);

  // Update properties based on sliders
  teapotsPerRing = sliderTeapotsPerRing.value();
  numRings = sliderNumRings.value();

  for (let j = 0; j < numRings; j++) {
    let circleRadius = (numRings - j) * 100; // Radius of the circle of teapots for each ring
    let scaleFactor = map(j, 0, numRings - 1, 3, 1); // Scale factor for the teapots in this ring
    let hue = (initialHues[j] + sliderHue.value()) % 360; // Adjust hue based on the slider value
    let rotationSpeed = map(j, 0, numRings - 1, 0.1, 0.05); // Rotation speed for teapots in this ring

    // Determine rotation direction based on ring index
    let ringRotationSpeed = rotationSpeed * (j % 2 === 0 ? 1 : -1);

    for (let i = 0; i < teapotsPerRing; i++) {
      let angle = map(i, 0, teapotsPerRing, 0, TWO_PI) + rot * ringRotationSpeed; // Add rotation to the angle
      let x = cos(angle) * circleRadius;
      let y = sin(angle) * circleRadius;

      push();
      translate(x, y, -300); // Move the teapots to the circumference of the circle
      scale(scaleFactor); // Scale down the surrounding teapots
      noStroke();
      fill(hue, 100, 100); // Set the color based on the adjusted hue

      specularMaterial(hue, 100, 100); // Set the color based on the adjusted hue
      shininess(50); // Adjust the shininess

      rotateX(HALF_PI);
      rotateZ(rot);
      rotateX(rot);
      model(teapot);
      pop();
    }
  }

  // Draw the central teapot
  push();
  scale(20); // Scale up the central teapot
  translate(0, 5, -300); // Move the central teapot to the center of the canvas
  rotateX(HALF_PI);
  rotateZ(rot);

  noStroke();
  fill(255, 192, 203); // Set the color of the central teapot based on the hue slider value
  specularMaterial(hue, 100, 100); // Set the color based on the adjusted hue
  shininess(50); // Adjust the shininess

  model(teapot);
  pop();

  // Rotate the teapots
  rot += 0.02; // Constant rotation speed
}
