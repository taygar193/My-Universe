// Inicializamos carrito y total
let storedCartRaw = localStorage.getItem('productos');
let storedTotalRaw = localStorage.getItem('total');

let cart;
let totalPrice;

try {
    cart = storedCartRaw ? JSON.parse(storedCartRaw) : [];
} catch (e) {
    cart = [];
}

try {
    totalPrice = storedTotalRaw ? JSON.parse(storedTotalRaw) : 0;
    if (isNaN(totalPrice)) totalPrice = 0;
} catch (e) {
    totalPrice = 0;
}

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

if (!id) {
   alert("No se recibió un producto válido");
}

const detailProduct = async () => {
   try {
      const res = await fetch(`https://6934ed5dfa8e704dafbc8513.mockapi.io/myproductos/products/?id=${id}`);
      const data = await res.json();
      const product = data[0];

      if (!product) {
         alert("Producto no encontrado");
      }

      const container = document.getElementById('description');

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
         <p><span>Más información:<span></p>
         <p>Marca: ${product.brand}</p>
         <p>Categoría: ${product.category}</p>
         <p>Tags: ${product.tags.join(", ")}</p>
      `;

      container.appendChild(card);

   } catch (error) {
      console.log(error);
   }
}

// Agregar producto al carrito (con subtotal)
function agregarBotonDinamico() {
   const cards = document.querySelectorAll('.Infocard');

   cards.forEach(card => {
      const button = card.querySelector('.agregar-carrito');
      if (!button) return;

      const title = button.dataset.nombre;
      const price = parseFloat(button.dataset.precio);

      button.addEventListener('click', () => {

         const existing = cart.find(p => p.title === title);

         if (existing) {
            existing.count++;
            existing.totalPrice = existing.count * existing.price;
         } else {
            cart.push({
               title,
               price,
               count: 1,
               totalPrice: price
            });
         }

         // Recalculamos total general
         totalPrice = cart.reduce((sum, p) => sum + p.totalPrice, 0);

         localStorage.setItem('productos', JSON.stringify(cart));
         localStorage.setItem('total', JSON.stringify(totalPrice));

         const contador = document.querySelector('.count');
         if (contador) contador.textContent = cart.length;
      });
   });
}

document.addEventListener('DOMContentLoaded', async () => {
   await detailProduct();
   agregarBotonDinamico();
});