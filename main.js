let title = document.querySelector(".title"),
  price = document.querySelector(".price"),
  texes = document.querySelector(".texes"),
  ads = document.querySelector(".ads"),
  discount = document.querySelector(".discount"),
  totalSpan = document.querySelector(".total-span"),
  count = document.querySelector(".count"),
  category = document.querySelector(".category"),
  creat = document.querySelector(".creat"),
  tbody = document.querySelector("tbody"),
  thead = document.querySelector("thead"),
  addDeleteButton = document.querySelector(".add-delete-button"),
  search = document.querySelector(".search"),
  indexUpdate,
  table = ``;

//  function add multiple Event

function addListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(" ");
  for (var i = 0, iLen = events.length; i < iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
}

// keyup & click

addListenerMulti(price, "keyup click", () => getTotal());
addListenerMulti(ads, "keyup click", () => getTotal());
addListenerMulti(texes, "keyup click", () => getTotal());
addListenerMulti(discount, "keyup click", () => getTotal());

// get total

function getTotal() {
  let priceTotal = Number(price.value);
  let texesTotal = Number(texes.value);
  let adsTotal = Number(ads.value);
  let discountTotal = Number(discount.value);

  if (price.value != "") {
    let totalNumber = priceTotal + texesTotal + adsTotal - discountTotal;
    totalSpan.innerText = totalNumber;
    totalSpan.parentElement.style.background = "rgb(58, 184, 146)";
  } else {
    totalSpan.innerText = "";
    totalSpan.parentElement.style.background = "";
  }
}

// creat product

let dataPro;

if (localStorage.getItem("product") != null) {
  dataPro = JSON.parse(localStorage.getItem("product"));
} else {
  dataPro = [];
}

creat.addEventListener("click", function () {
  getData();
  ShowData();
});

function getData() {
  let dataProducts = [
    title.value,
    Number(price.value),
    Number(texes.value),
    Number(ads.value),
    Number(discount.value),
    Number(totalSpan.innerText),
    Number(count.value),
    category.value,
  ];
  const [Title, Price, Texes, Ads, Discount, TotalSpan, Count, Category] = dataProducts;
  let newPro = {
    Title,
    Price,
    Texes,
    Ads,
    Discount,
    TotalSpan,
    Count,
    Category,
  };

  if (title.value != "" && price.value != "" && category.value != "") {
    if (creat.innerText === "CREATE") {
      if (newPro.Count > 1 && newPro.Count <= 1000) {
        for (let i = 0; i < newPro.Count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      dataPro[indexUpdate] = newPro;
      creat.innerText = "create";
      count.style.display = "block";
    }
    clearInputs();
    localStorage.setItem("product", JSON.stringify(dataPro));
  }
}

// save Local Storage

// clear inputs

function clearInputs() {
  title.value = "";
  price.value = "";
  texes.value = "";
  ads.value = "";
  discount.value = "";
  totalSpan.innerText = "";
  count.value = "";
  category.value = "";
  title.focus();
}

// read data
let shortCut = (data, i) => {
  table += `
    <tr>
      <td>${i + 1}</td>
      <td>${data.Title}</td>
      <td>${data.Price}</td>
      <td>${data.Texes}</td>
      <td>${data.Ads}</td>
      <td>${data.Category}</td>
      <td>${data.TotalSpan}</td>
      <td><button onclick="updateData(${i})" class="update">update</button></td>
      <td><button onclick="deleteData(${i})" class="delete">delete</button></td>
    </tr>`;
};
function ShowData() {
  getTotal();
  table = ``;
  let i = 0;
  for (let data of dataPro) {
    shortCut(data, i);
    i += 1;
  }
  tbody.innerHTML = table;

  showDelete();
}
ShowData();

// delete item

function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  ShowData();
}

// show button all delete and thead

function showDelete() {
  if (dataPro.length > 0) {
    addDeleteButton.innerHTML = `
    <button  onclick="deleteAll()" class="delete-all">Delete All ( ${dataPro.length} ) </button>
    `;
    thead.innerHTML = `
    <tr>
      <th>id</th>
      <th>title</th>
      <th>price</th>
      <th>taxes</th>
      <th>ads</th>
      <th>category</th>
      <th>total</th>
      <th>update</th>
      <th>delete</th>
    </tr>
    `;
  } else {
    addDeleteButton.innerHTML = "";
    thead.innerHTML = "";
  }
}
// fun delete All
function deleteAll() {
  localStorage.clear();
  dataPro.splice(0);
  ShowData();
}

// update

function updateData(i) {
  title.value = dataPro[i].Title;
  price.value = dataPro[i].Price;
  texes.value = dataPro[i].Texes;
  ads.value = dataPro[i].Ads;
  discount.value = dataPro[i].Discount;
  count.style.display = "none";
  category.value = dataPro[i].Category;

  creat.innerText = `update`;
  getTotal();
  indexUpdate = i;
  scroll({ top: 0, behavior: "smooth" });
}

// search

let searchMood = "title";

function getSearchMood(Class) {
  searchMood = Class == `search-title` ? "title" : "Category";
  search.placeholder = `search by ${searchMood}`;
  search.value = "";
  search.focus();
  ShowData();
}

search.addEventListener("keyup", function () {
  searchData(this.value);
});

function searchData(value) {
  let showDataSearch = (data, keySear, i) => {
    if (data[keySear].toLowerCase().includes(value.toLowerCase())) {
      shortCut(data, i);
    }
  };
  table = ``;
  let i = 0;
  for (let data of dataPro) {
    if (searchMood == "title") {
      showDataSearch(data, "Title", i);
    } else {
      showDataSearch(data, "Category", i);
    }
    i++;
  }
  tbody.innerHTML = table;
}

// clean date
