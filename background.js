const createContextMenus = () => {
  chrome.contextMenus.removeAll(() => {
    chrome.storage.sync.get("userData", ({ userData }) => {
      if (!Array.isArray(userData)) return;
      userData.forEach((item, index) => {
        chrome.contextMenus.create({
          id: `TapNFill_${index}`,
          title: `${item.Tittle} - ${item.Value}`,
          contexts: ["editable"],
        });
      });
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension startup");
  createContextMenus();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recreate_context_menu") {
    createContextMenus();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("TapNFill")) {
    const index = parseInt(info.menuItemId.split("_")[1]);
    chrome.storage.sync.get("userData", ({ userData }) => {
      if (!Array.isArray(userData)) return;
      const item = userData[index];
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (value) => {
          const active = document.activeElement;
          if (!active) return;
          if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") {
            active.value = value;
            active.dispatchEvent(new Event("input", { bubbles: true }));
          } else if (active.isContentEditable) {
            active.innerText = value;
            active.dispatchEvent(new Event("input", { bubbles: true }));
          }
        },
        args: [item.Value],
      });
    });
  }
});
