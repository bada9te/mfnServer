const path = require('path');
const express = require('express');
require('dotenv').config();

const initFrontend = (app) => {
    app.use('/api/uploads/images', express.static(path.join(__dirname, '..', '..', '..', 'uploads', 'images')));
    app.use('/api/uploads/audios', express.static(path.join(__dirname, '..', '..', '..', 'uploads', 'audios')));
    app.use('/api/uploads/others', express.static(path.join(__dirname, '..', '..', '..', 'uploads', 'others')));

    if (process.env.CLIENT_BASE == "/") {
        // pages
        app.use(express.static(path.join(__dirname, '..', '..', '..', 'public')));
        app.get('/app/*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', '..', '..', 'public', 'index.html'));
        });
    } else {
        console.log("[APP] Running server only!");
    }
}

module.exports = initFrontend;
