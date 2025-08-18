const togglebtn = document.getElementById("togglebtn");
const addsnippet = document.getElementById("addsnippet");
const AddSnippetBox = document.getElementById("AddSnippet");
const tittle = document.getElementById("tittle");
const value = document.getElementById("value");
const saveData = document.getElementById("saveData");
const databox = document.getElementById("databox");
const searchData = document.getElementById("searchData");
const snippetList = document.getElementById("snippetList");

addsnippet.addEventListener("click", () => {
  AddSnippetBox.classList.remove("hidden");
});

togglebtn.addEventListener("click", () => {
  AddSnippetBox.classList.add("hidden");
});
const storeData = () => {
  const data = {
    Tittle: tittle.value.trim(),
    Value: value.value.trim(),
  };

  if (!data.Tittle || !data.Value) return;

  chrome.storage.sync.get("userData", (result) => {
    const currentData = result.userData || [];
    currentData.push(data);

    chrome.storage.sync.set({ userData: currentData }, () => {
      console.log("Data saved to storage:", currentData);

      tittle.value = "";
      value.value = "";
      AddSnippetBox.classList.add("hidden");

      getStorageData();
      chrome.runtime.sendMessage({ action: "recreate_context_menu" });
    });
  });
};

saveData.addEventListener("click", storeData);
const getStorageData = () => {
  chrome.storage.sync.get("userData", ({ userData }) => {
    if (!Array.isArray(userData)) return;

    snippetList.innerHTML = "";

    userData.forEach(({ Tittle, Value }) => {
      const clone = databox.cloneNode(true);
      clone.id = "";
      clone.classList.remove("hidden");

      clone.querySelector("span").textContent = Tittle;
      clone.querySelector("p").textContent = Value;

      snippetList.appendChild(clone);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  getStorageData();
});

searchData.addEventListener("input", (e) => {
  console.log("searching..");
  const searchValue = e.target.value.toLowerCase();

  chrome.storage.sync.get("userData", (result) => {
    const currentData = result.userData || [];

    const searchedValues = currentData.filter((item) => {
      return (
        item.Value.toLowerCase().includes(searchValue) ||
        item.Tittle.toLowerCase().includes(searchValue)
      );
    });

    snippetList.innerHTML = "";
    searchedValues.forEach(({ Tittle, Value }) => {
      const clone = databox.cloneNode(true);
      clone.id = "";
      clone.classList.remove("hidden");
      clone.querySelector("span").textContent = Tittle;
      clone.querySelector("p").textContent = Value;
      snippetList.append(clone);
    });
  });
});
