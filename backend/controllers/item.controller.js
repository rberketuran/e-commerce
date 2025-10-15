import dbPromise from '../db/database.js';

// ----------------------------- HELPER: ERROR HANDLER -----------------------------
function handleError(res, error, customMessage = 'An unexpected error occurred', statusCode = 500) {
    console.error(customMessage + ':', error);
    const response = {
        success: false,
        message: customMessage,
    };
    if (process.env.NODE_ENV === 'development') {
        response.details = {
            code: error.code,
            errno: error.errno,
            message: error.message,
        };
    }
    res.status(statusCode).json(response);
}

// ----------------------------- GET ALL ITEMS -----------------------------
export const getAllItems = async (req, res) => {
    try {
        const db = await dbPromise;
        const items = await db.all('SELECT * FROM items');
        res.json({ success: true, data: items });
    } catch (error) {
        handleError(res, error, 'Failed to fetch item list');
    }
};

// ----------------------------- GET ITEM BY ID -----------------------------
export const getItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        const item = await db.get('SELECT * FROM items WHERE id = ?', [id]);
        if (!item)
            return res.status(404).json({ success: false, message: `No item found with ID ${id}` });

        res.json({ success: true, data: item });
    } catch (error) {
        handleError(res, error, `Failed to fetch item with ID ${id}`);
    }
};

// ----------------------------- GET ITEMS BY CATEGORY -----------------------------
export const getItemsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const db = await dbPromise;
        const items = await db.all('SELECT * FROM items WHERE category = ?', [category]);
        res.json({ success: true, data: items });
    } catch (error) {
        handleError(res, error, `Failed to fetch items for category "${category}"`);
    }
};

// ----------------------------- CREATE ITEM -----------------------------
export const createItem = async (req, res) => {
    try {
        const { title, price, category, image_url, description } = req.body;

        if (!title || !price || !category)
            return res.status(400).json({
                success: false,
                message: 'Title, price, and category are required fields.',
            });

        const db = await dbPromise;
        const result = await db.run(
            'INSERT INTO items (title, price, category, image_url, description) VALUES (?, ?, ?, ?, ?)',
            [title, price, category, image_url, description]
        );

        const newItem = await db.get('SELECT * FROM items WHERE id = ?', [result.lastID]);
        res.status(201).json({ success: true, data: newItem });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                success: false,
                message: 'Cannot create item due to a database constraint violation.',
            });
        }
        handleError(res, error, 'Failed to create item');
    }
};

// ----------------------------- UPDATE ITEM -----------------------------
export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { title, price, category, image_url, description } = req.body;

    try {
        const db = await dbPromise;
        const existing = await db.get('SELECT * FROM items WHERE id = ?', [id]);
        if (!existing)
            return res.status(404).json({ success: false, message: `No item found with ID ${id}` });

        const updatedTitle = title ?? existing.title;
        const updatedPrice = price ?? existing.price;
        const updatedCategory = category ?? existing.category;
        const updatedImage = image_url ?? existing.image_url;
        const updatedDescription = description ?? existing.description;

        await db.run(
            'UPDATE items SET title = ?, price = ?, category = ?, image_url = ?, description = ? WHERE id = ?',
            [updatedTitle, updatedPrice, updatedCategory, updatedImage, updatedDescription, id]
        );

        const updatedItem = await db.get('SELECT * FROM items WHERE id = ?', [id]);
        res.json({ success: true, data: updatedItem });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                success: false,
                message: 'Cannot update item due to a database constraint violation.',
            });
        }
        handleError(res, error, `Failed to update item with ID ${id}`);
    }
};

// ----------------------------- DELETE ITEM -----------------------------
export const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const db = await dbPromise;
        const item = await db.get('SELECT * FROM items WHERE id = ?', [id]);
        if (!item)
            return res.status(404).json({ success: false, message: `No item found with ID ${id}` });

        await db.run('DELETE FROM items WHERE id = ?', [id]);
        res.json({ success: true, data: item });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete item due to a database constraint.',
            });
        }
        handleError(res, error, `Failed to delete item with ID ${id}`);
    }
};
