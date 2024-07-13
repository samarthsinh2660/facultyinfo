const db = require('../db');

exports.showDashboard = (req, res) => {
    const query = 'SELECT * FROM faculty WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) throw err;
        res.render('dashboard', { faculty: results[0] });
    });
};

exports.updateFaculty = (req, res) => {
    const { office_number, free_time } = req.body;
    const query = 'UPDATE faculty SET office_number = ?, free_time = ? WHERE id = ?';
    db.query(query, [office_number, free_time, req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect(`/faculty/dashboard/${req.params.id}`);
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
