import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import errorHandler from './Middleware/ErrorHandler'

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// !
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Handle SPA routing, serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

// Error handler middleware
app.use(errorHandler);

export default app;
