const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

//async function detailProduct ()
const detailProduct = async () => {
   try {
      const res = await fetch(`https://6934ed5dfa8e704dafbc8513.mockapi.io/myproductos/products/?id=${id}`);
      const data = await res.json();
      const product = data[0];  

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
//Agregar al carrito
function agregarBotonDinamico() {
   const cards = document.querySelectorAll('.Infocard');

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
document.addEventListener('DOMContentLoaded', async () => {
   await detailProduct();
   agregarBotonDinamico();
});