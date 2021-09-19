// create alarm instead of setTimeout

chrome.alarms.create({ when: Date.now() + 50000 });

// get a list of created time of all tabs

chrome.tabs.onCreated.addListener(addTabToStorage);

const getCurrentTime = () => {
  const date = new Date();
  return date.getTime();
};

function addTabToStorage(tab) {
  const payload = { id: tab.id, startTime: getCurrentTime() };
  chrome.storage.local.get(["initialTime"], function (result) {
    const initialTime = result.initialTime;
    if (!initialTime) {
      chrome.storage.local.set({ initialTime: [payload] });
    }
    initialTime.push(payload);
    chrome.storage.local.set({ initialTime });
  });
}

// reset start time when moved back to the tab
chrome.tabs.onActivated.addListener(callback);

async function callback(info) {
  initialTime.map((tabs) => {
    if (info.tabId === tabs.id) {
      tabs.startTime = getCurrentTime();
      return tabs;
    }

    return tabs;
  });
}

// check at an interval of 50 seconds if the tab is inactive for the closing time

chrome.alarms.onAlarm.addListener((alarm) => {
  // get the time stored in local storage
  chrome.storage.local.get(["time", "initialTime"], async function (result) {
    let time = result.time;
    let initialTime = result.initialTime || [];

    // if time not set then set the time and assign default 5 seconds to closing time
    if (!time) {
      chrome.storage.local.set({ time: 5 });
      time = 5;
    }

    let closingTime = time * 60000;

    let urlMathcher = await chrome.tabs.query({
      url: "https://meet.google.com/*",
    });

    let activeTabs = await chrome.tabs.query({ active: true });

    const refreshTimingForTabs = [...activeTabs, ...urlMathcher];

    initialTime = initialTime.map((tabs) => {
      // check for current active tabs and reset its time to current
      refreshTimingForTabs.forEach((element) => {
        if (element.id == tabs.id) {
          tabs.startTime = getCurrentTime();
          return tabs;
        }
      });

      return tabs;
    });

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
  });

  chrome.alarms.create({ when: Date.now() + 50000 });
});
