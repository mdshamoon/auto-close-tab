// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let initialTime = [];
/**
 *
 *
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
let closingTime = 600000;

chrome.tabs.onCreated.addListener(call);

function call(tab) {
  const date = new Date();
  const timeInSeconds = date.getTime();
  const payload = { id: tab.id, startTime: timeInSeconds };
  initialTime.push(payload);
}

setInterval(() => {
  const date = new Date();
  const timeInSeconds = date.getTime();
  initialTime = initialTime.filter((tabs) => {
    let timeDifference = timeInSeconds - tabs.startTime;
    if (timeDifference > closingTime) {
      chrome.tabs.remove(tabs.id);
      return false;
    }
    return true;
  });

  chrome.tabs.query({ active: true }, function (tabArray) {
    initialTime = initialTime.map((tabs) => {
      if (tabArray[0].id === tabs.id) {
        const date = new Date();
        const timeInSeconds = date.getTime();
        tabs.startTime = timeInSeconds;
        return tabs;
      }

      return tabs;
    });
  });
}, 50000);

chrome.tabs.onActivated.addListener(callback);

function callback(info) {
  initialTime.map((tabs) => {
    if (info.tabId === tabs.id) {
      const date = new Date();
      const timeInSeconds = date.getTime();
      tabs.startTime = timeInSeconds;
      return tabs;
    }

    return tabs;
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  closingTime = request.time * 60000;
});
