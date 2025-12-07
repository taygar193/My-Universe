// =========================
// VARIABLES GLOBALES
// =========================
let cart = JSON.parse(localStorage.getItem('productos')) || [];
let totalPrice = JSON.parse(localStorage.getItem('total')) || 0;


// =========================
// AGREGAR PRODUCTO
// =========================
function agregarBotonDinamico() {
   const cards = document.querySelectorAll('.card');

   cards.forEach(card => {
      const button = card.querySelector('.agregar-carrito');
      if (!button) return;

      const title = button.dataset.nombre;
      const price = parseFloat(button.dataset.precio);

      button.addEventListener('click', () => {

         // Buscar si existe
         const existing = cart.find(p => p.title === title);

         if (existing) {
            existing.count++;
         } else {
            cart.push({
               title,
               price,
               count: 1
            });
         }

         totalPrice += price;

         localStorage.setItem('productos', JSON.stringify(cart));
         localStorage.setItem('total', totalPrice);

         const contador = document.querySelector('.count');
         if (contador) contador.textContent = cart.length;
      });
   });
}


// =========================
// MOSTRAR CARRITO
// =========================
function handleCart() {
   const carritoProduct = document.getElementById('itemProducts');
   if (!carritoProduct) return;

   if (cart.length === 0) {
      carritoProduct.innerHTML = "<p>El carrito está vacío</p>";
      return;
   }

   const tabla = document.createElement("table");
   tabla.innerHTML = `
      <thead>
         <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
         </tr>
      </thead>
      <tbody>
         ${
            cart.map(p => `
               <tr>
                  <td>${p.title}</td>
                  <td>$${p.price}</td>
                  <td>${p.count}</td>
               </tr>
            `).join("")
         }
      </tbody>
      <button onclick="limpiarCarrito()">Limpiar Carrito</button>
   `;

   carritoProduct.appendChild(tabla);
}


// =========================
// LIMPIAR CARRITO
// =========================
function limpiarCarrito() {
   if (!confirm("¿Seguro que querés vaciar el carrito?")) return;

   cart = [];
   totalPrice = 0;

   localStorage.removeItem('productos');
   localStorage.removeItem('total');

   const contador = document.querySelector('.count');
   if (contador) contador.textContent = 0;

   location.reload();
}


// =========================
// CARGAR PRODUCTOS DE API
// =========================
const loadProduct = async () => {
   const container = document.getElementById('product-list');
   if (!container) return;

   try {
      const res = await fetch("https://6934ed5dfa8e704dafbc8513.mockapi.io/myproductos/products");
      const products = await res.json();

      printProducts(products);
   } catch (err) {
      console.error("Error al cargar productos", err);
   }
};


// =========================
// IMPRIMIR PRODUCTOS
// =========================
function printProducts(products) {
   const container = document.getElementById('product-list');
   if (!container) return;

   products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
         <a href="./product-detalle.html?id=${product.id}">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h4>${product.title}</h4>
         </a>
         <p>Precio: $${product.price}</p>

         <button 
            class="agregar-carrito"
            data-id="${product.id}"
            data-nombre="${product.title}"
            data-precio="${product.price}"
         >Añadir</button>
      `;

      container.appendChild(card);
   });

   agregarBotonDinamico();
}


// =========================
// INICIO
// =========================
document.addEventListener("DOMContentLoaded", () => {
   loadProduct();
   handleCart();
});
