const Databse = require("../database/Database");
const Hasher = require("../utilities/Hasher");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const db = new Databse();
const hs = new Hasher();

const tokens = require("../tokens");

let refreshTokens = [];

const authenticate = async (email, password) => {
    if (await db.doesUserExist(email)) {
        const user = (await db.select("Password, Salt").from('Users').where({ Email: email }).send())[0];
        //const user = (await db.select("Users", null, [{ Email: email }])).rows[0];

        console.log(user.password + ' Sample ' + hs.hash(password, user.salt));

        return hs.compare(user.password, user.salt, password);
    } else {
        return false;
    }
};

const generateAccessToken = (email) => {
    return jwt.sign({ email: email }, tokens.secrets.access, { expiresIn: '20m' });
}

const generateRefreshToken = (email) => {
    return jwt.sign({ email: email }, tokens.secrets.refresh);
}

router.post("/sign-in", async (request, response) => {
    try {
        const { mail, pass } = request.body;

        if (await authenticate(mail, pass)) {
            const accessToken = generateAccessToken(mail);
            const refreshToken = generateRefreshToken(mail);

            refreshTokens.push(refreshToken);
            const record = (await db.select('FirstName, LastName').from('Users').where({ Email: mail }).send())[0];

            response.status(200).json({
                accessToken: accessToken,
                refreshToken: refreshToken,
                firstName: record.firstname,
                lastName: record.lastname
            });
        } else {
            response.status(401).json({ error: 'Invalid user email or password' });
        }
    } catch (e) {
        console.error(e.message);

        response.status(500).send({ error: "Internal server error" });
    }
});

router.post("/sign-up", async (request, response) => {
    try {
        const { fname, lname, mail, pass } = request.body;

        const salt = hs.generateSalt();

        await db.insert('Users', [mail, hs.hash(pass, salt), salt, fname, lname]);

        response.status(200).send({ response: "User inserted" });
    } catch (e) {
        console.error(e.message);

        response.status(500).send({ error: "Internal server error" });
    }
});

router.post("/token", (request, response) => {
    try {
        const refreshToken = request.body.token;

        if (refreshToken == null) {
            return response.status(401).json({ error: "Unauthorized Error" });
        }

        if (!refreshTokens.includes(refreshToken)) {
            return response.status(403).json({ error: "Forbidden Error" });
        }

        jwt.verify(refreshToken, tokens.secrets.refresh, (error, user) => {
            if (error) {
                return response.status(403).json({ error: "Forbidden Error" });
            } else {
                response.status(200).json({ accessToken: generateAccessToken(user.email) });
            }
        });
    } catch (e) {
        throw new Error(e.message);
    }
});

module.exports = router;