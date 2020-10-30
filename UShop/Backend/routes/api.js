const Database = require("../database/Database");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const tokens = require("../tokens");
const multer = require('multer');
const assetsPath = `${__dirname}/../assets/`;
const upload = multer({ dest: assetsPath });
const fs = require('fs');
const { response, request } = require("express");

const db = new Database();

const isUndefined = (value) => {
    return typeof value === 'undefined';
}

const deleteFile = (name) => {
    return new Promise((resolve, reject) => {
        fs.unlink(`${assetsPath}${name}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ result: 'One file deleted from assets folder' })
            }
        });
    });
}

const renameFile = (name, newName) => {
    return new Promise((resolve, reject) => {
        fs.rename(`${assetsPath}${name}`, `${assetsPath}${newName}`, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ result: 'One file renamed in assets folder' })
            }
        });
    });
}

const authorize = (request, response, next) => {
    try {
        const token = request.body.token;

        if (token == null) {
            throw new Error("Token Not Provided");
        }

        jwt.verify(token, tokens.secrets.access, (error, user) => {
            if (error) {
                throw new Error("Invalid Token");
            } else {
                request.user = user;

                next();
            }
        });
    } catch (e) {
        request.error = e.message;

        next();
    }
}

router.get('/categories', async (request, response) => {
    try {
        const res = await db.select('*').from('Categories').send();

        response.status(200).json(res);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/category/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const res = await db.select('*').from('Categories').where({ Id: id }).send();

        response.status(200).json(res[0]);
    } catch (e) {
        console.error(e);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.post('/category', upload.single('img'), authorize, async (request, response) => {
    try {
        if (isUndefined(request.file)) {
            return response.status(400).send({ error: "Bad request" });
        }

        if (!isUndefined(request.error)) {
            deleteFile(request.file.filename)
            return response.status(400).send({ error: "Bad request" })
        }

        const name = request.body.name;

        if (request.user.email !== 'admin@admin.com' || isUndefined(name)) {
            deleteFile(request.file.filename);
            return response.status(401).send({ error: "Permission Denied" });
        }

        const res = await db.insert('Categories', [name]);

        await renameFile(request.file.filename, `category${res.rows[0].id}.png`);

        return response.status(200).json({ result: "Category inserted" });
    } catch (e) {
        console.error(e.message);

        return response.status(500).send({ error: "Internal server error" });
    }
});

router.get('/products/:filters', async (request, response) => {
    try {
        const decodedRequest = JSON.parse(Buffer.from(request.params.filters, 'base64').toString());

        const { categoryId, filters } = decodedRequest;

        const variationKeys = ['size', 'color'];

        const condition = Object.keys(filters).reduce((a, e) => (a[variationKeys.includes(e) ? e : `description ->> '${e}'`] = filters[e], a), {});

        const items = await db.select('Items.*').distinct_on('id').from('Items').join('ItemVariations', 'Items.id = ItemVariations.ItemId', 'full').where({ CategoryId: categoryId }).where_in(condition).send();

        response.status(200).json(items);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/products', async (request, response) => {
    try {
        const products = await db.select('*').from('Items').send()

        response.status(200).json(products);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/product/:id', async (request, response) => {
    try {
        const id = request.params.id;

        let item = (await db.select('*').from('Items').where({ Id: id }).send())[0];

        const variationKeys = ['size', 'color'];

        for (const value of variationKeys) {
            const prop = await db.select(value).distinct().from('ItemVariations').where({ ItemId: id }).send();

            item[value] = prop.map(e => e[value]);
        }

        response.status(200).json(item);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/filters/:categoryid', async (request, response) => {
    try {
        const id = request.params.categoryid;

        const descriptions = (await db.select('description').from('Items').where({ CategoryId: id }).send()).map(e => e.description);

        let filters = {};

        const descriptionKeys = [...new Set([].concat.apply([], descriptions.map(e => Object.keys(e))))];

        for (const value of descriptionKeys) {
            const filter = await db.select(`description ->> '${value}'`).as(value).distinct().from('Items').where({ CategoryId: id }).send();

            filters[value] = filter.map(e => e[value]).filter(e => e !== null);
        }

        const variationKeys = ['size', 'color'];

        for (const value of variationKeys) {
            const filter = await db.select(value).distinct().from('ItemVariations INNER JOIN Items ON ItemVariations.ItemId = Items.Id').where({ CategoryId: id }).send();

            if (filter.length > 0) {
                filters[value] = filter.map(e => e[value]);
            }
        }

        response.status(200).json(filters);
    } catch (e) {
        console.error(e.message);

        response.status(500).json({ error: "Internal server error" });
    }
});

router.get('/orders', async (request, response) => {
    try {
        const orders = await db.select('*').from('Orders').send();

        response.status(200).json(orders);
    } catch (e) {
        console.log(e.message);

        response.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/order', authorize, async (request, response) => {
    try {
        const products = request.body.products;

        const order = await db.insert('Orders', [request.user.email, request.body.details, 'recieved']);

        const orderId = order.rows[0].id;

        for (const value of products) {
            await db.update('ItemVariations').set(`quantity = quantity - ${value.quantity}`).where({ ...JSON.parse(value.variation), ItemId: value.id }).send();

            await db.insert('OrderProducts', [orderId, value.id, value.quantity]);
        }

        response.status(200).json({ status: "New order added" });
    } catch (e) {
        console.log(e.message);
    }
});

module.exports = router;