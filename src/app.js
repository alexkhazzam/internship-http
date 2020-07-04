const loading = document.querySelector("#loading");
const ul = document.querySelector("#search-results-list");
const clearBtn = document.querySelector("#clear");
const search = document.querySelector("#search");
const itemInfo = document.querySelector("#item-information");
let userInput = document.querySelector("input");
const h1 = document.querySelector("#search-header");
const searchResults = document.querySelector("#search-results");
const closeAllBtn = document.querySelector("#close-all");
const information = document.querySelector("#information");
let objCount = 0;
let invalidOrNot;
let totalChildren = 0;

//using single quotes for a more modern JavaScript-feel

function sendHttpRequest(method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json"; //alternatively, can do "JSON.parse()"

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        console.log(xhr.status);
        reject(new Error("Something went wrong!"));
      }
      endModal();
    };

    xhr.onerror = function () {
      console.log(xhr.response);
      console.log(xhr.status);
      endModal();
      reject(new Error("Failed to send request!"));
    };
    xhr.send();
  });
  return promise;
}

async function navigateServer() {
  const responseData = await sendHttpRequest(
    "GET",
    `https://api.github.com/search/repositories?q=${userInput.value.trim()}&sort=stars&order=des&per_page=100&` //100 per page seems to be the max...CPU will blow up--doesn't go more. Need to parse JSON data for every other page until there is no more data left
  );
  endModal();
  searchResults.style.display = "block";
  if (responseData.total_count === 0) {
    appendErrorToDOM();
  } else {
    ul.textContent = "";
    objCount = 0;
    for (let i = 0; i < responseData.items.length; i++) {
      //100 is the max repositories per page
      let path = responseData.items[i];
      const jsonObj = {
        fullName: path.full_name,
        description: path.description,
        language: path.language,
        githubUrl: path.html_url,
        homepageUrl: path.homepage,
        created: path.created_at,
        updated: path.updated_at,
        stars: path.stargazers_count,
        watchers: path.watchers_count,
        openIssues: path.open_issues_count,
      };
      const objName = {
        name: path.name,
      };
      appendToDOM(jsonObj, objName);
    }
  }
}

function appendToDOM(obj, objName) {
  clearBtn.style.display = "inline-block";
  objCount++; //keeps track of what number element is in the DOM and displays it for
  const scrollUpBtn = document.querySelector("#scroll-up");
  const li = document.createElement("li");
  li.textContent = `${objCount}: ${objName.name}`;
  ul.append(li);
  li.addEventListener("click", () => {
    information.style.display = "block";
    const listItem = document.createElement("li");
    listItem.id = "info-li";

    const xBtn = document.createElement("button");
    xBtn.textContent = "X";
    xBtn.className = "x-btn";
    listItem.appendChild(xBtn);

    const h2 = document.createElement("h2");
    h2.textContent = objName.name;
    const p1 = document.createElement("p");
    p1.textContent = `Full Name: ${obj.fullName}`;
    const p2 = document.createElement("p");
    p2.textContent = `Description: ${obj.description}`;
    const p3 = document.createElement("p");
    p3.textContent = `Language: ${obj.language}`;
    const p4 = document.createElement("p");
    p4.textContent = `Github Url: ${obj.githubUrl}`;
    p4.className = "p-hover";
    p4.addEventListener("click", () => {
      open(`${obj.githubUrl}`);
    });
    p4.style.color = "blue";
    const p5 = document.createElement("p");
    p5.textContent = `Homepage Url: ${obj.homepageUrl}`;
    p5.addEventListener("click", () => {
      open(`${obj.homepageUrl}`);
    });
    p5.className = "p-hover";
    p5.style.color = "blue";
    const p6 = document.createElement("p");
    p6.textContent = `Created: ${obj.created}`;
    const p7 = document.createElement("p");
    p7.textContent = `Updated: ${obj.updated}`;
    const p8 = document.createElement("p");
    p8.textContent = `Stars: ${obj.stars}`;
    const p9 = document.createElement("p");
    p9.textContent = `Watchers: ${obj.watchers}`;
    const p10 = document.createElement("p");
    p10.textContent = `Open Issues: ${obj.openIssues}`;

    listItem.append(h2, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
    itemInfo.append(listItem);
    totalChildren++;
    listItem.onmouseover = () => {
      listItem.style.backgroundColor = "white";
    };

    scrollUpBtn.style.display = "block";
    closeAllBtn.style.display = "block";

    closeAllBtn.addEventListener("click", () => {
      search.scrollIntoView({ behavior: "smooth" });
      itemInfo.textContent = "";
      information.style.display = "none";
    });

    h1.style.display = "block";
    scrollUpBtn.scrollIntoView({ behavior: "smooth" });
    scrollUpBtn.addEventListener("click", () => {
      const search = document.querySelector("#search");
      search.scrollIntoView({ behavior: "smooth" });
    });

    xBtn.addEventListener("click", () => {
      itemInfo.removeChild(listItem);
      totalChildren = totalChildren - 1;
      if (totalChildren === 0) {
        information.style.display = "none";
        search.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function appendErrorToDOM() {
  ul.textContent = "";
  const li = document.createElement("li");
  li.textContent = "No Results Found";
  h1.style.display = "none";
  information.style.display = "none";
  ul.append(li);
}

function endModal() {
  loading.style.display = "none";
}

const searchBtn = document.querySelector("button");
searchBtn.addEventListener("click", () => {
  if (userInput.value.trim() === "") {
    alert("Enter a valid input.");
  } else {
    loading.style.display = "block";
    navigateServer();
  }
});

clearBtn.addEventListener("click", () => {
  clearBtn.style.display = "none";
  itemInfo.textContent = "";
  userInput.value = "";
  ul.textContent = "";
  searchResults.style.display = "none";
  information.style.display = "none";
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
