const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mt5XlO',
    database: 'user_db',
});

db.connect((err) => {
    if (err) {
        console.log('Database connection error:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// User Registration
app.post('/register', upload.single('image'), (req, res) => {
    const { name, email, password } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const query = 'INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)';

    db.query(query, [name, email, password, image], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Registration failed' });
        } else {
            res.status(200).json({ message: 'User registered successfully' });
        }
    });
});

// User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, result) => {
        if (err || result.length === 0) {
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Fetch User Data by ID
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err || result.length === 0) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
