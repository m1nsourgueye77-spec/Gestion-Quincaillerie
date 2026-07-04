if (!localStorage.getItem("auth")) {
  if (!window.location.href.includes("login.html")) {
    window.location.href = "login.html";
  }
}


// ===================== UTILITAIRE =====================
function exists(id) {
  return document.getElementById(id) !== null;
}

// ===================== PANIER =====================
let cart = [];
let total = 0;

function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  displayCart();
}

function displayCart() {
  if (!exists("cartList")) return;

  const cartList = document.getElementById("cartList");
  const totalEl = document.getElementById("total");

  cartList.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} FCFA`;
    cartList.appendChild(li);
  });

  totalEl.textContent = total;
}

// ===================== WHATSAPP =====================
function sendWhatsApp() {
  if (cart.length === 0) return alert("Panier vide");

  let message = "Commande Gi.Code :\n";

  cart.forEach(i => {
    message += `- ${i.name} : ${i.price} FCFA\n`;
  });

  message += `\nTotal: ${total} FCFA`;

  let phone = "221776813749";
  window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message));
}

// ===================== RECHERCHE =====================
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    let value = this.value.toLowerCase();

    document.querySelectorAll(".product").forEach(p => {
      let text = p.textContent.toLowerCase();
      p.style.display = text.includes(value) ? "block" : "none";
    });
  });
});

// ===================== STOCK =====================
let stock = JSON.parse(localStorage.getItem("stock")) || [];

function addProduct() {
  if (!exists("prodName")) return;

  let name = document.getElementById("prodName").value;
  let qty = document.getElementById("prodQty").value;
  let price = document.getElementById("prodPrice").value;

  if (!name) return;

  stock.push({ name, qty, price });
  localStorage.setItem("stock", JSON.stringify(stock));
  displayStock();
}

function displayStock() {
  if (!exists("stockTable")) return;

  const table = document.getElementById("stockTable");
  table.innerHTML = "";

  stock.forEach((item, i) => {
    table.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td><button onclick="deleteStock(${i})">❌</button></td>
      </tr>
    `;
  });
}

function deleteStock(i) {
  stock.splice(i, 1);
  localStorage.setItem("stock", JSON.stringify(stock));
  displayStock();
}

// ===================== CLIENTS =====================
let clients = JSON.parse(localStorage.getItem("clients")) || [];

function addClient() {
  if (!exists("clientName")) return;

  let name = document.getElementById("clientName").value;
  let phone = document.getElementById("clientPhone").value;

  if (!name) return;

  clients.push({ name, phone });
  localStorage.setItem("clients", JSON.stringify(clients));
  displayClients();
}

function displayClients() {
  if (!exists("clientList")) return;

  const list = document.getElementById("clientList");
  list.innerHTML = "";

  clients.forEach(c => {
    list.innerHTML += `<li>${c.name} - ${c.phone}</li>`;
  });
}

// ===================== FOURNISSEURS =====================
let fournisseurs = JSON.parse(localStorage.getItem("fournisseurs")) || [];

function addFournisseur() {
  if (!exists("fournName")) return;

  let name = document.getElementById("fournName").value;
  let phone = document.getElementById("fournPhone").value;

  if (!name) return;

  fournisseurs.push({ name, phone });
  localStorage.setItem("fournisseurs", JSON.stringify(fournisseurs));
  displayFournisseurs();
}

function displayFournisseurs() {
  if (!exists("fournList")) return;

  const list = document.getElementById("fournList");
  list.innerHTML = "";

  fournisseurs.forEach(f => {
    list.innerHTML += `<li>${f.name} - ${f.phone}</li>`;
  });
}

// ===================== AUTO LOAD =====================
window.addEventListener("load", () => {
  displayCart();
  displayStock();
  displayClients();
  displayFournisseurs();
});





// ===================== DASHBOARD =====================
function updateDashboard() {
  if (!document.getElementById("totalProducts")) return;

  let stock = JSON.parse(localStorage.getItem("stock")) || [];
  let clients = JSON.parse(localStorage.getItem("clients")) || [];
  let fournisseurs = JSON.parse(localStorage.getItem("fournisseurs")) || [];

  let totalStock = stock.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  document.getElementById("totalProducts").textContent = stock.length;
  document.getElementById("totalClients").textContent = clients.length;
  document.getElementById("totalFournisseurs").textContent = fournisseurs.length;
  document.getElementById("totalStock").textContent = totalStock;
}

window.addEventListener("load", updateDashboard);






function genererFacture() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let client = document.getElementById("clientFacture").value;
  let produit = document.getElementById("produitFacture").value;
  let prix = document.getElementById("prixFacture").value;

  if (!client || !produit || !prix) {
    alert("Remplir tous les champs");
    return;
  }

  doc.setFontSize(18);
  doc.text("FACTURE - ALI QUINCAILLER", 10, 10);

  doc.setFontSize(12);
  doc.text("Client: " + client, 10, 30);
  doc.text("Produit: " + produit, 10, 40);
  doc.text("Prix: " + prix + " FCFA", 10, 50);

  let total = Number(prix);
  doc.text("TOTAL: " + total + " FCFA", 10, 70);

  doc.save("facture.pdf");
}




// ===================== LOGIN SIMPLE =====================
function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("auth", "true");
    window.location.href = "index.html";
  } else {
    alert("Identifiants incorrects");
  }
}



// ===================== VENTES =====================
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveSale() {
  if (cart.length === 0) return;

  let sale = {
    date: new Date().toLocaleString(),
    items: cart,
    total: total
  };

  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  cart = [];
  total = 0;
  displayCart();
}




// ===================== AFFICHER VENTES =====================
function displaySales() {
  let list = document.getElementById("salesList");
  if (!list) return;

  let sales = JSON.parse(localStorage.getItem("sales")) || [];

  list.innerHTML = "";

  sales.forEach(s => {
    let items = s.items.map(i => i.name).join(", ");

    list.innerHTML += `
      <li>
        📅 ${s.date} <br>
        🛒 ${items} <br>
        💰 Total: ${s.total} FCFA
      </li>
      <hr>
    `;
  });
}

window.addEventListener("load", displaySales);




// ===================== EXPORT DONNÉES =====================
function exportData() {
  let data = {
    stock: JSON.parse(localStorage.getItem("stock")) || [],
    clients: JSON.parse(localStorage.getItem("clients")) || [],
    fournisseurs: JSON.parse(localStorage.getItem("fournisseurs")) || [],
    sales: JSON.parse(localStorage.getItem("sales")) || []
  };

  let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup_gicode.json";
  a.click();
}