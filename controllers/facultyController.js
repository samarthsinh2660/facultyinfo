const db = require('../db');

exports.showDashboard = (req, res) => {
    const query = 'SELECT * FROM faculty WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('dashboard', { faculty: results[0] });
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

// Update faculty details endpoint
exports.updateFaculty = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            // Handle error (e.g., return an error response to the client)
            return res.status(500).json({ error: 'Error uploading files' });
        }

        // Check and log req.files
        console.log('req.files:', req.files);

        // Files uploaded successfully, continue updating database
        const { office_number, free_time, department } = req.body;
        const pdfPath = req.files && req.files['pdf_path'] ? '/uploads/' + req.files['pdf_path'][0].filename : null;
        const imagePath = req.files && req.files['image_path'] ? '/uploads/' + req.files['image_path'][0].filename : null;

        const query = 'UPDATE faculty SET office_number = ?, free_time = ?, department = ?, pdf_path = ?, image_path = ? WHERE id = ?';
        db.query(query, [office_number, free_time, department, pdfPath, imagePath, req.params.id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                // Handle database update error
                return res.status(500).json({ error: 'Error updating faculty details' });
            }
            res.redirect(`/faculty/dashboard/${req.params.id}`);
        });
    });
};


exports.showSearchPage = (req, res) => {
    res.render('index');
};

exports.searchFaculty = (req, res) => {
    const facultyName = req.query.faculty_name; // Assuming you're using a query parameter named faculty_name
    console.log('Searching for faculty by name:', facultyName);

    const query = 'SELECT * FROM faculty WHERE name = ?'; // Corrected table name
    db.query(query, [facultyName], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Server error');
            return;
        }

        console.log('Query results:', results);

        if (results.length > 0) {
            console.log('Faculty found:', results);
            res.render('faculty_details', { faculty: results });
        } else {
            console.log('Faculty not found');
            res.status(404).send('Faculty not found');
        }
    });
};
