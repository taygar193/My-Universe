// =======================================================
// 📌 POO – MODELOS Y SERVICIO DE PRODUCTOS
// =======================================================

class Product {
    constructor({ id, title, price, description, thumbnail, brand, category, tags }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.thumbnail = thumbnail;
        this.brand = brand;
        this.category = category;
        this.tags = tags;
    }
}

class ProductService {
    constructor(apiURL) {
        this.apiURL = apiURL;
    }

    // Obtener TODOS los productos
    getAllProducts = async () => {
        try {
            const response = await fetch(this.apiURL);
            const res = await response.json();
            return res.map(p => new Product(p));
        } catch (error) {
            console.error("Error obteniendo productos:", error);
        }
    };

    // Obtener un producto por ID
    getProductById = async (id) => {
        try {
            const response = await fetch(`${this.apiURL}/${id}`);
            const res = await response.json();
            return new Product(res);
        } catch (error) {
            console.error("Error obteniendo producto por ID:", error);
        }
    };
}
