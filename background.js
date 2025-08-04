const createContextMenus = () => {
  chrome.createMenus.removeAll(() => {
    chrome.storage.sync.get("userData", ({ userData }) => {
      if (!Array.isArray(userData)) return;
      userData.forEach((item, index) => {
        chrome.contextMenus.create({
          id: `snapfill_${index}`,
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
  console.log("Menu item clicked:", info.menuItemId);

  if (info.menuItemId.startsWith("snapfill_")) {
    const index = parseInt(info.menuItemId.split("_")[1]);
  }
});
