require('dotenv').config();
var con = require('./connection');
var express = require('express');
var app = express();
var bp = require('body-parser');
var cors = require('cors');

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

// Render link page
app.get('/', function (req, res) {
    res.render(__dirname+'/link');
});

// Handle donation form submission
app.post('/donation_done', function (req, res) {
    var { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country } = req.body;
    var sql = "INSERT INTO donation (firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    con.query(sql, [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country], function (err, result) {
        if (err) {
            console.error("Error in donation_done:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/data');
    });
});

// Render donation data page
app.get('/data', function (req, res) {
    var sql = "SELECT * FROM donation";
    con.query(sql, function (err, result) {
        if (err) {
            console.error("Error in data:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.render(__dirname + "/data", { data: result });
    });
});

// Handle donation deletion
app.get('/delete-data', function (req, res) {
    var sql = "DELETE FROM donation WHERE dId=?";
    var dId = req.query.dId;
    con.query(sql, [dId], function (err, result) {
        if (err) {
            console.error("Error in delete-data:", err);
        }
        res.redirect('/data');
    });
});

// Render update donation form
app.get('/updateData', function (req, res) {
    var sql = "SELECT * FROM donation WHERE dId=?";
    var dId = req.query.dId;
    con.query(sql, [dId], function (err, result) {
        if (err) {
            console.error("Error in update-data:", err);
        }
        res.render(__dirname+"/update", { student: result });
    });
});

// Handle donation update
app.post('/updateData_done', function(req, res) {
    var { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country, dId } = req.body;
    var sql = "UPDATE donation SET firstName=?, lastName=?, phoneNumber=?, donationAmount=?, donationItem=?, donationAddress=?, city=?, state=?, postalCode=?, country=? WHERE dId=?";

    con.query(sql, [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country, dId], function(err, result) {
        if (err) throw err;
        res.redirect('/data');
    });
});

// POSTMAN APIs
app.get('/donationget', (req, res) => {
    var sql = 'SELECT * FROM donation';
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving data from database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            console.log('Data retrieved successfully');
            res.json({ success: true, data: results });
        }
    });
});

app.get('/donationget/:id', (req, res) => {
    const donationId = req.params.id;
    const sql = 'SELECT * FROM donation WHERE dId = ?';

    con.query(sql, [donationId], (err, results) => {
        if (err) {
            console.error('Error retrieving data from the database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            if (results.length === 0) {
                res.status(404).json({ success: false, message: 'Donation not found' });
            } else {
                console.log('Data retrieved successfully');
                res.json({ success: true, data: results[0] });
            }
        }
    });
});

app.post('/donation_done', function (req, res) {
    var { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country } = req.body;
    var sql = "INSERT INTO donation (firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    con.query(sql, [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country], function (err, result) {
        if (err) {
            console.error("Error in donation_done:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
        res.status(201).json({ success: true, message: "Donation added successfully" });
    });
});

app.delete('/donation/:donationId', function (req, res) {
    const donationId = req.params.donationId;

    if (!donationId) {
        return res.status(400).json({ success: false, error: "Invalid donation ID" });
    }

    var sql = "DELETE FROM donation WHERE dId = ?";

    con.query(sql, [donationId], function (err, result) {
        if (err) {
            console.error("Error in deleting donation:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Donation not found" });
        }

        res.json({ success: true, message: "Donation deleted successfully" });
    });
});

app.put('/donation/:id', (req, res) => {
    const donationId = req.params.id;
    const { firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country } = req.body;
    const data = [firstName, lastName, phoneNumber, donationAmount, donationItem, donationAddress, city, state, postalCode, country, donationId];

    const sql = `
        UPDATE donation
        SET firstName=?, lastName=?, phoneNumber=?, donationAmount=?, donationItem=?, donationAddress=?, city=?, state=?, postalCode=?, country=?
        WHERE dId=?
    `;

    con.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error updating data in the database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ success: false, message: 'Donation not found' });
            } else {
                console.log('Data updated successfully');
                res.json({ success: true, message: 'Donation updated successfully' });
            }
        }
    });
});

// Contact us form (POSTMAN APIs)
app.get('/Contactget', (req, res) => {
    var sql = 'SELECT * FROM contact';
    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving data from database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            console.log('Data retrieved successfully');
            res.json({ success: true, data: results });
        }
    });
});

app.get('/Contactget/:id', (req, res) => {
    const contactId = req.params.id;
    const sql = 'SELECT * FROM contact WHERE id = ?';

    con.query(sql, [contactId], (err, results) => {
        if (err) {
            console.error('Error retrieving data from database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            if (results.length === 0) {
                res.status(404).json({ success: false, message: 'Contact not found' });
            } else {
                console.log('Data retrieved successfully');
                res.json({ success: true, data: results[0] });
            }
        }
    });
});

app.post('/Contact_done', function (req, res) {
    var { name, email, message } = req.body;
    var sql = "INSERT INTO contact (name, email, message) VALUES (?, ?, ?)";

    con.query(sql, [name, email, message], function (err, result) {
        if (err) {
            console.error("Error in Contact_done:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
        res.status(201).json({ success: true, message: "Contact added successfully" });
    });
});

app.delete('/Contact/:contactId', function (req, res) {
    const contactId = req.params.contactId;

    if (!contactId) {
        return res.status(400).json({ success: false, error: "Invalid contact ID" });
    }

    var sql = "DELETE FROM contact WHERE id = ?";

    con.query(sql, [contactId], function (err, result) {
        if (err) {
            console.error("Error in deleting contact:", err);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Contact not found" });
        }

        res.json({ success: true, message: "Contact deleted successfully" });
    });
});

app.put('/Contact/:id', (req, res) => {
    const contactId = req.params.id;
    const { name, email, message } = req.body;
    const data = [name, email, message, contactId];

    const sql = `
        UPDATE contact
        SET name=?, email=?, message=?
        WHERE id=?
    `;

    con.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error updating data in the database: ', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            if (result.affectedRows === 0) {
                res.status(404).json({ success: false, message: 'Contact not found' });
            } else {
                console.log('Data updated successfully');
                res.json({ success: true, message: 'Contact updated successfully' });
            }
        }
    });
});

var server = app.listen(8000, () => {
    console.log('Server is running..');
});
