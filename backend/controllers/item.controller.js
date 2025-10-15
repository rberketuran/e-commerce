import dbPromise from '../db/database.js';

// Get all items with user-friendly error handling
export const getAllItems = async (req, res) => {
    try {
        const db = await dbPromise;
        const items = await db.all('SELECT * FROM items');
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        const item = await db.get('SELECT * FROM items WHERE id = ?', [id]);

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getItemsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const db = await dbPromise;
        const items = await db.all('SELECT * FROM items WHERE category = ?', [category]);
        res.json(items);
    } catch (error) {
        console.error('Error fetching items by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createItem = async (req, res) => {
    const { title, price, category, image_url, description } = req.body;
    try {
        const db = await dbPromise;
        const result = await db.run(
            'INSERT INTO items (title, price, category, image_url, description) VALUES (?, ?, ?, ?, ?)',
            [title, price, category, image_url, description]
        );
        res.status(201).json({ id: result.lastID, title, price, category, image_url, description });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { title, price, category, image_url, description } = req.body;
    try {
        const db = await dbPromise;
        const result = await db.run(
            'UPDATE items SET title = ?, price = ?, category = ?, image_url = ?, description = ? WHERE id = ?',
            [title, price, category, image_url, description, id]
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ id, title, price, category, image_url, description });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        const result = await db.run('DELETE FROM items WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
