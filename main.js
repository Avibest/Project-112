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

  document.getElementById("result_gesture_name").innerHTML = raw;
  prediction = raw;
  speak();

  var emojiEl = document.getElementById("result_emoji");
  var quoteEl = document.getElementById("quote");

  if (label === "amazing") {
    emojiEl.innerHTML = "👏"; // clapping
    quoteEl.innerHTML = "This is Looking Amazing";
  } else if (
    label === "best" ||
    label === "thumbs up" ||
    label === "thumbsup" ||
    label === "like"
  ) {
    emojiEl.innerHTML = "&#128077;"; // 👍 thumbs up
    quoteEl.innerHTML = "All The Best";
  } else if (label === "super") {
    emojiEl.innerHTML = "&#128076;"; // 👌 OK hand (circle + 3 fingers)
    quoteEl.innerHTML = "That is Super!";
  } else if (label === "victory") {
    emojiEl.innerHTML = "&#9996;"; // ✌️ victory hand
    quoteEl.innerHTML = "That Was a Marvelous Victory";
  } else {
    emojiEl.innerHTML = "❓";
    quoteEl.innerHTML = "Gesture not recognized";
  }

  document.getElementById("status").textContent =
    "Prediction complete. Keep your hand close to the camera and try again if needed.";
}
