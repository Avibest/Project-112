var prediction = "";

Webcam.set({
  width: 350,
  height: 300,
  image_format: "png",
  png_quality: 90
});

var camera = document.getElementById("camera");
Webcam.attach("#camera");

function take_snapshot() {
  Webcam.snap(function (data_uri) {
    document.getElementById("result").innerHTML =
      '<img id="image_captured" src="' + data_uri + '" alt="Captured gesture snapshot" />';
    document.getElementById("status").textContent =
      "Snapshot captured. Keep your hand close to the camera for accurate prediction.";
  });
}

console.log("ml5 Version:", ml5.version);

// Use your Teachable Machine model
var classifier = ml5.imageClassifier(
  "https://teachablemachine.withgoogle.com/models/T9P_LqnQ1/model.json",
  modelLoaded
);

function modelLoaded() {
  console.log("Model Loaded");
  document.getElementById("status").textContent =
    "Model loaded. Keep your hand close to the camera, then capture and predict.";

  // Optional audio reminder
  try {
    var synth = window.speechSynthesis;
    var utter = new SpeechSynthesisUtterance(
      "Model loaded. Keep your hand close to the camera for best results."
    );
    synth.speak(utter);
  } catch (e) {
    console.warn("Speech synthesis unavailable:", e);
  }
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
    document.getElementById("status").textContent =
      "Please capture a snapshot first. Keep your hand close to the camera.";
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
  var raw = top.label || "";
  var label = raw.trim().toLowerCase();
  console.log("Top label:", raw);

  document.getElementById("result_gesture_name").innerHTML = raw;
  prediction = raw;
  speak();

  var emojiEl = document.getElementById("result_emoji");
  var quoteEl = document.getElementById("quote");

  if (label === "best") {
    emojiEl.innerHTML = "&#128077;"; // 👍 thumbs up
    quoteEl.innerHTML = "All The Best";
  } else if (label === "super") {
    emojiEl.innerHTML = "&#128076;"; // 👌 OK hand
    quoteEl.innerHTML = "That is Super!";
  } else if (label === "victory") {
    emojiEl.innerHTML = "&#9996;"; // ✌️ victory
    quoteEl.innerHTML = "That Was a Marvelous Victory";
  } else {
    emojiEl.innerHTML = "❓";
    quoteEl.innerHTML = "Gesture not recognized";
  }

  document.getElementById("status").textContent =
    "Prediction complete. If results seem off, keep your hand closer to the camera and try again.";
}
