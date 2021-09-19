let time;

chrome.storage.local.get(["time"], function (result) {
  time = result.time;
  if (!time) {
    chrome.storage.local.set({ time: 10 });
    time = 10;
  }
  document.querySelector("#time-input").value = time;
  document.querySelector("#rangevalue").innerHTML = time;
});

document.querySelector("#time-input").addEventListener("change", function (e) {
  document.querySelector("#rangevalue").innerHTML = e.target.value;
  console.log(e.target.value);
  chrome.storage.local.set({ time: e.target.value });
});
