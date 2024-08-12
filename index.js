const express = require('express');
const coininfo = require('coininfo');
const bitcoin = require('bitcoinjs-lib');
const coinstring = require('coinstring');

const app = express();

app.get('/generate-address', (req, res) => {
    try {
        // DigiByte network parameters
        const digibyte = coininfo.digibyte.main;

        // Generate a random key pair
        const keyPair = bitcoin.ECPair.makeRandom({ network: digibyte.toBitcoinJS() });

        // Get the private key in WIF (Wallet Import Format)
        const privateKeyWIF = keyPair.toWIF();

        // Get the public key
        const { address } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network: digibyte.toBitcoinJS(),
        });

        // Return the address and private key
        res.json({
            success: true,
            address,
            privateKey: privateKeyWIF,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
