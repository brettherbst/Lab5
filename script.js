// script.js


/* Bullet 1- const vars */
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const rect = canvas.getContext('2d');
const genMeme = document.getElementById('generate-meme');

/* slider for volume */
const volumeGroup = document.getElementById('volume-group');
const inputSlider = volumeGroup.querySelectorAll('input')[0];
const volume = volumeGroup.querySelectorAll('img')[0];


/* Bulllet 2/3 - const vars*/
const inFile = document.getElementById('image-input');

/* Buttons */
const clearButton = document.getElementById('button-group').querySelectorAll('button')[0];
const submit = genMeme.querySelectorAll('button')[0];
const inText = document.getElementById('button-group').querySelectorAll('button')[1];

/* voices stuff */
const synth = window.speechSynthesis;
var voices = [];
const voiceSelection = document.getElementById('voice-selection');


/* Bullet 1 implementation */
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // Clearing canvas context
  rect.clearRect(0,0, canvas.width, canvas.height);

  // filling w/ black
  rect.fillStyle = 'black';
  rect.fillRect(0,0,canvas.width,canvas.height);
  //clearing form
  genMeme.reset();

  //grab dimensions
  var dims = getDimmensions(canvas.width,canvas.height,img.width,img.height);

  //drawing image
  rect.drawImage(img, dims.startX,dims.startY,dims.width,dims.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/* Bulllet 2 */
inFile.addEventListener('change', files);
function files(){

  let newImg = inFile.files[0];

  //creates url than can then be used to store in src
  img.src = URL.createObjectURL(newImg);

  //setting image name by extracting the image file name from the file path
  img.alt = newImg.name;
};

/* Function used in Bullet 3 */
function populateVoiceList() {
  voices = synth.getVoices();

  for (var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelection.appendChild(option);
  }
}

genMeme.addEventListener('submit', (event) => {
  var topT = document.getElementById('text-top').value;
  var bottomT = document.getElementById('text-bottom').value;

  
  rect.textAlign = 'center';
  rect.font = '70px Comic Sans';
  rect.fillStyle = 'black';

  
  rect.fillText(topT, canvas.width / 2, canvas.height / 16);
  rect.fillText(bottomT, canvas.width / 2, canvas.height * .9);



  submit.disabled = true;
  clearButton.disabled = false;
  inText.disabled = false;
  voiceSelection.disabled = false;
  populateVoiceList();
  event.preventDefault();
});



/* Bullet 4 */
clearButton.addEventListener('click', () => {
  // clears text
  rect.clearRect(0, 0, canvas.width, canvas.height);
  //resets generate meme
  genMeme.reset();


  //adjusts buttons
  inText.disabled = true;
  clearButton.disabled = true;
  submit.disabled = false;
});

/* Bullet 6 */
inText.addEventListener('click', () => {
  var speakTop = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  var speakBottom = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);

  var selectedOption = voiceSelection.selectedOptions[0].getAttribute('data-name');

  for (var i = 0; i < voices.length ; i++) {
    if (voices[i].name === selectedOption) {
      speakTop.voice = voices[i];
      speakBottom.voice = voices[i];
    }
  }
  speakTop.volume = inputSlider.value / 100;
  synth.speak(speakTop);
  speakBottom.volume = inputSlider.value / 100;
  synth.speak(speakBottom);
})

/* Bullet 7 */
volumeGroup.addEventListener('input', () => {

  if (inputSlider.value > 66) {
    volume.src = 'icons/volume-level-3.svg';
    volume.alt = 'Level 3';
  }
  else if (inputSlider.value <= 66 && inputSlider.value >= 34) {
    volume.src = 'icons/volume-level-2.svg';
    volume.alt = 'Level 2';
  }
  else if (inputSlider.value < 34 && inputSlider.value != 0) {
    volume.src = 'icons/volume-level-1.svg';
    volume.alt = 'Level 1';
  }
  else{
    volume.src = 'icons/volume-level-0.svg';
    volume.alt = 'Level 0';
  }
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
