var prediction = "";

Webcam.set({
  width: 350,
  height: 300,
  image_format: "png", // fixed key name
  png_quality: 90
});

var camera = document.getElementById("camera");
Webcam.attach("#camera");

function take_snapshot() {
  Webcam.snap(function (data_uri) {
    document.getElementById("result").innerHTML =
      '<img id="image_captured" src="' + data_uri + '" alt="Captured gesture snapshot" />';
    document.getElementById("status").textContent = "Snapshot captured. Click Predict Gesture.";
  });
}

console.log("ml5 Version:", ml5.version);

var classifier = ml5.imageClassifier(
  "https://teachablemachine.withgoogle.com/models/n_h2846qi/model.json",
  modelLoaded
);

function modelLoaded() {
  console.log("Model Loaded");
  document.getElementById("status").textContent = "Model loaded. You can capture and predict.";
}

function speak() {
  try {
    var synth = window.speechSynthesis;
    var speak_data = "The prediction is " + prediction;
    var utterThis = new SpeechSynthesisUtterance(speak_data);
    synth.speak(utterThis);
  } catch (e) {
    console.warn("Speech synthesis unavailable:", e);
  }
}

function check() {
  var img = document.getElementById("image_captured");
  if (!img) {
    document.getElementById("status").textContent = "Please capture a snapshot first.";
    return;
  }
  document.getElementById("status").textContent = "Predicting...";
  classifier.classify(img, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    document.getElementById("status").textContent = "Error while predicting. Check console.";
    return;
  }

  if (!results || results.length === 0) {
    document.getElementById("status").textContent = "No prediction returned.";
    return;
  }

  var top = results[0];
  document.getElementById("result_gesture_name").innerHTML = top.label || "(unknown)";
  prediction = top.label || "";
  speak();

  var emojiEl = document.getElementById("result_emoji");
  var quoteEl = document.getElementById("quote");

  // Map labels to emoji & quote
  if (top.label === "Amazing") {
    emojiEl.innerHTML = "&#128076;"; // OK hand
    quoteEl.innerHTML = "This is Looking Amazing";
  } else if (top.label === "Best") {
    emojiEl.innerHTML = "&#128077;"; // Thumbs up
    quoteEl.innerHTML = "All The Best";
  } else {
    emojiEl.innerHTML = "&#9996;"; // Victory
    quoteEl.innerHTML = "That Was a Marvelous Victory";
  }

  document.getElementById("status").textContent = "Prediction complete.";
}
