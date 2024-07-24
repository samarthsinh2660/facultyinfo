require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const path = require('path');

const app = express();
const multer = require('multer');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/'); // Upload files to the 'uploads' directory
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload with a 2 MB file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 2097152 }, // 2 MB limit
}).fields([{ name: 'pdf_path', maxCount: 1 }, { name: 'image_path', maxCount: 1 }]);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/auth', authRoutes);
app.use('/faculty', facultyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
