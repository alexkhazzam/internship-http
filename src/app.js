const loading = document.querySelector("#loading");
const ul = document.querySelector("#search-results-list");
const itemInfo = document.querySelector("#item-information");
const h1 = document.querySelector('#search-header');
const searchResults = document.querySelector("#search-results");
const closeAllBtn = document.querySelector("#close-all");
const information = document.querySelector("#information");
let objCount = 0;
let currentObjectCount = 0;
let invalidOrNot;
let totalChildren = 0;

function sendHttpRequest(method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = "json"; //no need for "JSON.parse()"

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
  let userInput = document.querySelector("input").value.trim();
  const responseData = await sendHttpRequest(
    "GET",
    `https://api.github.com/search/repositories?q=${userInput}&sort=stars&order=des&per_page=100` //100 per page seems to be the max...CPU will blow up--doesn't go more. Need to parse JSON data for every other page until there is no more data left
  );
  console.log(responseData);
  endModal();
  searchResults.style.display = "block";
  if (responseData.total_count === 0) {
    appendErrorToDOM();
  } else {
    for (let i = 0; i <= 100; i++) {
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
      console.log(jsonObj);
      appendToDOM(jsonObj, objName);
    }
  }
}

function appendToDOM(obj, objName) {
  if (ul.childElementCount === 100) {
    ul.textContent = "";
    itemInfo.textContent = "";
    objCount = 0;
  }
  currentObjectCount++
  objCount++;
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
    
    const p1 = document.createElement("p");
    p1.textContent = `Full Name: ${obj.fullName}`;
    const p2 = document.createElement("p");
    p2.textContent = `Description: ${obj.description}`;
    const p3 = document.createElement("p");
    p3.textContent = `Language: ${obj.language}`;
    const p4 = document.createElement("p");
    p4.textContent = `Github Url: ${obj.githubUrl}`;
    const p5 = document.createElement("p");
    p5.textContent = `Homepage Url: ${obj.homepageUrl}`;
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
    
    listItem.append(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);
    itemInfo.append(listItem);
    totalChildren++;
    console.log(totalChildren);
    listItem.onmouseover = () => {
      listItem.style.backgroundColor = "white";
    };
    
    scrollUpBtn.style.display = "block";
    closeAllBtn.style.display = "block";
    
    closeAllBtn.addEventListener("click", () => {
      itemInfo.textContent = "";
      information.style.display = "none";
    });
    h1.style.display = 'block';
    scrollUpBtn.scrollIntoView({ behavior: "smooth" });
    scrollUpBtn.addEventListener("click", () => {
      const search = document.querySelector("#search");
      search.scrollIntoView({ behavior: "smooth" });
    });
    xBtn.addEventListener("click", () => {
      itemInfo.removeChild(listItem);
      totalChildren = totalChildren - 1;
      console.log(totalChildren);
      if (totalChildren === 0) {
        information.style.display = "none";
      }
    });
  });
}

function appendErrorToDOM() {
  ul.textContent = '';
  const li = document.createElement('li');
  li.textContent = 'No Results Found';
  h1.style.display = 'none';
  information.style.display = "none";
  ul.append(li);
}

function endModal() {
  loading.style.display = "none";
}

const searchBtn = document.querySelector("button");
searchBtn.addEventListener("click", () => {
  loading.style.display = "block";
  navigateServer();
});
