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

exports.showRegisterPage = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    const { name, office_number, free_time, username, password } = req.body;
    console.log('Register request received:', username);
    const query = 'INSERT INTO faculty (name, office_number, free_time, username, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, office_number, free_time, username, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Server error');
            return;
        }
        console.log('Registration successful:', username);
        res.redirect('/auth/login');
    });
};
