import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.route.js';
import dotenv from 'dotenv';

/* import { setupDatabase } from './db/setup.js';

// Initialize and setup the database
setupDatabase().then(() => {
    console.log('Database setup complete.');
}).catch((error) => {
    console.error('Database setup failed:', error);
}); */

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
const isProd = process.env.NODE_ENV === "production";
const allowedOrigin = isProd
    ? ""
    : "http://localhost:4200";


// Middleware
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use('/api/v1/items', itemRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});