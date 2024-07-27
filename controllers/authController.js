const db = require('../db');

exports.showLoginPage = (req, res) => {
    res.render('login');
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', username);
    const query = 'SELECT * FROM faculty WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            console.log('Login successful:', results[0].id);
            res.redirect(`/faculty/dashboard/${results[0].id}`);
        } else {
            console.log('Invalid credentials');
            res.send('Invalid credentials');
        }
    });
};

const multer = require('multer');
const path = require('path');

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/'); // Upload files to the 'uploads' directory
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // Limit file size if needed
}).fields([{ name: 'pdf_path', maxCount: 1 }, { name: 'image_path', maxCount: 1 }]);

exports.showRegisterPage = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            res.status(500).send('File upload error');
            return;
        }

        console.log('Request body:', req.body);  // Log the entire request body
        console.log('Request files:', req.files);  // Log the uploaded files

        const { name, office_number, free_time, department, username, password } = req.body;
        const pdfPath = req.files && req.files['pdf_path'] ? '/uploads/' + req.files['pdf_path'][0].filename : null;
        const imagePath = req.files && req.files['image_path'] ? '/uploads/' + req.files['image_path'][0].filename : null;

        console.log('Register request received:', { name, office_number, free_time, department, pdfPath, imagePath, username, password });

        if (!name || !office_number || !username || !password) {
            res.status(400).send('Required fields are missing');
            return;
        }

        const query = 'INSERT INTO faculty (name, office_number, free_time, department, pdf_path, image_path, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [name, office_number, free_time, department, pdfPath, imagePath, username, password], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                res.status(500).send('Server error');
                return;
            }
            console.log('Registration successful:', username);
            res.redirect('/auth/login');
        });
    });
};
