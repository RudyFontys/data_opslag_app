const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Database connectie
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Bevolkingsregister'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Routes voor Adres
app.get('/adressen', (req, res) => {
    db.query('SELECT * FROM Adres', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/adres', (req, res) => {
    const { adres, woonplaats } = req.body;
    db.query('INSERT INTO Adres (Adres, Woonplaats) VALUES (?, ?)',
        [adres, woonplaats], (err, result) => {
            if (err) throw err;
            res.status(201).send('Address added');
        });
});

// Routes voor Inwoner
app.get('/inwoners', (req, res) => {
    db.query('SELECT * FROM Inwoner', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/inwoner', (req, res) => {
    const { naam, achternaam, geslacht, adres_id, geboortedatum } = req.body;
    db.query('INSERT INTO Inwoner (Naam, Achternaam, Geslacht, Adres_ID, Geboortedatum) VALUES (?, ?, ?, ?, ?)',
        [naam, achternaam, geslacht, adres_id, geboortedatum], (err, result) => {
            if (err) throw err;
            res.status(201).send('Inwoner added');
        });
});

app.put('/inwoner/:id', (req, res) => {
    const { id } = req.params;
    const { naam, achternaam, geslacht, adres_id, geboortedatum, sterfdatum } = req.body;
    db.query('UPDATE Inwoner SET Naam = ?, Achternaam = ?, Geslacht = ?, Adres_ID = ?, Geboortedatum = ?, Sterfdatum = ? WHERE Inwoner_ID = ?',
        [naam, achternaam, geslacht, adres_id, geboortedatum, sterfdatum, id], (err, result) => {
            if (err) throw err;
            res.send('Inwoner updated');
        });
});

// Routes voor Relatie
app.get('/relaties', (req, res) => {
    db.query('SELECT * FROM Relatie', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/relatie', (req, res) => {
    const { inwoner_id_1, inwoner_id_2, relatie_type } = req.body;
    db.query('INSERT INTO Relatie (Inwoner_ID_1, Inwoner_ID_2, Relatie_type) VALUES (?, ?, ?)',
        [inwoner_id_1, inwoner_id_2, relatie_type], (err, result) => {
            if (err) throw err;
            res.status(201).send('Relatie added');
        });
});

// Routes voor HuwelijksCheck
app.get('/huwelijkschecks', (req, res) => {
    db.query('SELECT * FROM HuwelijksCheck', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/huwelijkscheck', (req, res) => {
    const { inwoner_id_1, inwoner_id_2, inteelt_percentage, goedkeuring } = req.body;
    db.query('INSERT INTO HuwelijksCheck (Inwoner_ID_1, Inwoner_ID_2, Inteelt_Percentage, Goedkeuring) VALUES (?, ?, ?, ?)',
        [inwoner_id_1, inwoner_id_2, inteelt_percentage, goedkeuring], (err, result) => {
            if (err) throw err;
            res.status(201).send('Huwelijkscheck added');
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});