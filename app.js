require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');
const path = require('path');

const app = express();

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
