const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');

router.get('/dashboard/:id', facultyController.showDashboard);
router.post('/dashboard/:id', facultyController.updateFaculty);
//router.get('/', facultyController.showSearchPage);
router.get('/search', facultyController.searchFaculty);

module.exports = router;
