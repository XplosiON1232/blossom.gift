const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

const ejs = require('ejs');
app.set('view engine', 'ejs');
app.use('',express.static(path.join(__dirname, 'public')));

// const { default: axios } = require("axios");

// Firebase Setup
var admin = require("firebase-admin");
var serviceAccount = require("./data/key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('/', (req, res) => {
    res.redirect('https://blossom.cx')
})

app.get('/:id', (req, res) => {
    const id = req.params.id; // Document ID for the gift
    const giftRef = db.collection('gifts');
    
    var query = giftRef.doc(id);
    query
        .get()
        .then((docSnap) => {
            if (docSnap.exists) {
                // Define data and fetch information
                const data = docSnap.data();
                const claimed = data['Claimed'];
                const claimerID = data['Claimer ID'];
                const giftName = data['Gift Name'];
                const icon = data['Icon'];
                const productID = data['Product ID'];
                const receipt = data['Receipt'];
                const senderID = data['Sender ID'];
                const senderName = data['Sender Name'];
                const theme = data['Theme'];
                const isGift = data['isGift'];

                if (isGift == true) {
                    if (claimed == false) {
                        // If it's not claimed, send the index.ejs
                        res.render('index', { claimed, claimerID, giftName, icon, productID, receipt, senderID, senderName, theme });
                    }
                    if (claimed == true) {
                        // If it is claimed, send the claimed page
                        res.send('This gift is claimed.')
                    }
                }
                if (isGift == false) {
                    // This is not a gift...
                    // Send 'Gift is not available' page
                    res.send('Gift is not available')
                }
            } else {
                res.status(404).json({ error: 'Doc Not Found' });
            }
        })
        .catch((error) => {
            console.log('Error', error);
            res.status(500).json({ error: 'Internal server error' });
        });
});

app.listen(port, () => {
    console.log(`Live on port ${port}`)
})