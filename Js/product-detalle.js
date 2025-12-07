// Variables locales para este script
let PDstoredCartRaw = localStorage.getItem('productos');
let PDstoredTotalRaw = localStorage.getItem('total');

let PDcart;
let PDtotalPrice;

// Parse seguro del carrito
try {
   PDcart = PDstoredCartRaw ? JSON.parse(PDstoredCartRaw) : [];
} catch (e) {
   PDcart = [];
}

// Parse seguro del total
try {
   PDtotalPrice = PDstoredTotalRaw ? JSON.parse(PDstoredTotalRaw) : 0;
   if (isNaN(PDtotalPrice)) PDtotalPrice = 0;
} catch (e) {
   PDtotalPrice = 0;
}

function actualizarContador() {
    const contador = document.querySelector('.count');
    if (!contador) return;

    if (PDcart.length === 0) {
        contador.style.display = "none"; // escondemos el círculo si está vacío
    } else {
        contador.style.display = "flex"; // lo mostramos
        contador.textContent = PDcart.length;
    }
}


// Obtener id del producto desde query string
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

if (!id) {
   alert("No se recibió un producto válido");
}

// Función para cargar detalle del producto
const detailProduct = async () => {
   try {
      const res = await fetch(`https://6934ed5dfa8e704dafbc8513.mockapi.io/myproductos/products/?id=${id}`);
      const data = await res.json();
      const product = data[0];

      if (!product) {
         alert("Producto no encontrado");
         return;
      }

      const container = document.getElementById('description');
      if (!container) return;

      const card = document.createElement('div');
      card.classList.add('Infocard');

      card.innerHTML = `
         <h3>${product.title}</h3>
         <img src="${product.thumbnail}" alt="${product.title}" width="300px">
         <p>${product.description}</p>
         <p>Precio: <span>$${product.price}</span></p>
         <button 
            class="agregar-carrito"
            data-id="${product.id}"
            data-nombre="${product.title}"
            data-precio="${product.price}"
         >Añadir</button>
         <p><span>Más información:</span></p>
         <p>Marca: ${product.brand}</p>
         <p>Categoría: ${product.category}</p>
         <p>Tags: ${product.tags.join(", ")}</p>
      `;

      container.appendChild(card);

   } catch (error) {
      console.error("Error al cargar detalle del producto:", error);
   }
}

// Función para agregar producto al carrito desde product-detalle
function agregarBotonDinamico() {
   const cards = document.querySelectorAll('.Infocard');

   cards.forEach(card => {
      const button = card.querySelector('.agregar-carrito');
      if (!button) return;

      const title = button.dataset.nombre;
      const price = parseFloat(button.dataset.precio);

      button.addEventListener('click', () => {

         const existing = PDcart.find(p => p.title === title);

         if (existing) {
            existing.count++;
            existing.totalPrice = existing.count * existing.price;
         } else {
            PDcart.push({
               title,
               price,
               count: 1,
               totalPrice: price
            });
         }

         // Recalculamos total general
         PDtotalPrice = PDcart.reduce((sum, p) => sum + p.totalPrice, 0);

         // Guardamos en localStorage
         localStorage.setItem('productos', JSON.stringify(PDcart));
         localStorage.setItem('total', JSON.stringify(PDtotalPrice));

         // Actualizamos contador visual si existe
         actualizarContador();
      });
   });
}

// =========================
// INICIALIZACIÓN
// =========================
document.addEventListener('DOMContentLoaded', async () => {
   await detailProduct();
   agregarBotonDinamico();
   actualizarContador();
});