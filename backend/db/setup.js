import dbPromise from './database.js';

export async function setupDatabase() {
    const db = await dbPromise;

    await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const items = [
        // Electronics
        { title: 'Wireless Headphones', price: 89.99, category: 'Electronics', image_url: 'https://placehold.co/400x400?text=Headphones', description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.' },
        { title: 'Smartphone X100', price: 699.99, category: 'Electronics', image_url: 'https://placehold.co/400x400?text=Smartphone', description: 'Latest generation smartphone with a 6.7" AMOLED display and 128GB storage.' },
        { title: 'Bluetooth Speaker', price: 49.99, category: 'Electronics', image_url: 'https://placehold.co/400x400?text=Speaker', description: 'Portable Bluetooth speaker with rich bass and waterproof design.' },
        { title: 'Smartwatch Pro', price: 199.99, category: 'Electronics', image_url: 'https://placehold.co/400x400?text=Smartwatch', description: 'Feature-packed smartwatch with health tracking and GPS.' },

        // Clothing
        { title: 'Classic White T-Shirt', price: 14.99, category: 'Clothing', image_url: 'https://placehold.co/400x400?text=T-Shirt', description: '100% cotton T-shirt with a soft and comfortable fit.' },
        { title: 'Denim Jeans', price: 39.99, category: 'Clothing', image_url: 'https://placehold.co/400x400?text=Jeans', description: 'Stylish denim jeans with a modern slim fit.' },
        { title: 'Hooded Sweatshirt', price: 29.99, category: 'Clothing', image_url: 'https://placehold.co/400x400?text=Hoodie', description: 'Warm and cozy hoodie available in multiple colors.' },
        { title: 'Summer Dress', price: 34.99, category: 'Clothing', image_url: 'https://placehold.co/400x400?text=Dress', description: 'Lightweight summer dress perfect for warm days.' },

        // Home & Kitchen
        { title: 'Ceramic Mug Set', price: 24.99, category: 'Home & Kitchen', image_url: 'https://placehold.co/400x400?text=Mug+Set', description: 'Set of 4 ceramic mugs with modern minimalist design.' },
        { title: 'Non-stick Frying Pan', price: 27.99, category: 'Home & Kitchen', image_url: 'https://placehold.co/400x400?text=Frying+Pan', description: 'Durable non-stick frying pan with ergonomic handle.' },
        { title: 'Cotton Bed Sheet', price: 49.99, category: 'Home & Kitchen', image_url: 'https://placehold.co/400x400?text=Bed+Sheet', description: 'Soft 100% cotton bed sheet with 300 thread count.' },
        { title: 'Table Lamp', price: 44.99, category: 'Home & Kitchen', image_url: 'https://placehold.co/400x400?text=Lamp', description: 'Modern bedside table lamp with warm LED lighting.' },

        // Books
        { title: 'The Silent Forest', price: 12.99, category: 'Books', image_url: 'https://placehold.co/400x400?text=Book+1', description: 'A thrilling mystery novel set deep in an isolated forest.' },
        { title: 'Learning TypeScript', price: 29.99, category: 'Books', image_url: 'https://placehold.co/400x400?text=Book+2', description: 'Comprehensive guide to mastering TypeScript and modern JavaScript.' },
        { title: 'The Art of Mindfulness', price: 18.99, category: 'Books', image_url: 'https://placehold.co/400x400?text=Book+3', description: 'An insightful journey into meditation and self-awareness.' },
        { title: 'History of Modern Europe', price: 22.50, category: 'Books', image_url: 'https://placehold.co/400x400?text=Book+4', description: 'Detailed historical account of Europe from 1700 to the present.' },

        // Sports & Outdoors
        { title: 'Yoga Mat', price: 19.99, category: 'Sports & Outdoors', image_url: 'https://placehold.co/400x400?text=Yoga+Mat', description: 'Non-slip yoga mat ideal for home or studio workouts.' },
        { title: 'Hiking Backpack', price: 59.99, category: 'Sports & Outdoors', image_url: 'https://placehold.co/400x400?text=Backpack', description: 'Durable 40L backpack with water-resistant material.' },
        { title: 'Stainless Steel Water Bottle', price: 14.50, category: 'Sports & Outdoors', image_url: 'https://placehold.co/400x400?text=Water+Bottle', description: 'Insulated water bottle that keeps drinks cold for 24 hours.' },
        { title: 'Tennis Racket', price: 79.99, category: 'Sports & Outdoors', image_url: 'https://placehold.co/400x400?text=Tennis+Racket', description: 'Lightweight tennis racket designed for all skill levels.' }
    ];

    for (const item of items) {
        await db.run(
            `INSERT INTO items (title, price, category, image_url, description)
       VALUES (?, ?, ?, ?, ?)`,
            [item.title, item.price, item.category, item.image_url, item.description]
        );
    }
}
