function getURL() {
  var time = document.getElementById("time").value;

  chrome.runtime.sendMessage({ time: time }, function (response) {});
}

var x = document.getElementById("save");
x.onclick = function () {
  getURL();
  this.innerHTML = "Saved Successfully";
};
