const Logger = require('./debugging-tools/Logger');
const EKATTEDatabase = require('./database-tools/EKATTEDatabase');
const FilesProvider = require('./database-tools/FilesProvider');
const express = require('express');

const apiRouter = require('./routes/api');

const app = express();

//Intercept requests to a static file to avoid 304 Not Modified
app.disable('etag');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use('/api', apiRouter);

const initializeDatabase = async() => {
    try {
        await FilesProvider.prepareFiles();
        console.log({ res: "Files prepared successfully" });
        await EKATTEDatabase.create();
        console.log({ res: "Tables created" });
        await EKATTEDatabase.insert();
        console.log({ res: "Tables inserted" });
    } catch {
        console.log("Initializing error!");
    }
}

const initializeServer = async() => {
    if (await EKATTEDatabase.doesTablesExist()) {
        console.log({ res: "Databse already exists" });
    } else {
        console.log({ res: "Databse does NOT exist yet" });

        initializeDatabase();
    }
}

initializeServer();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(Logger.now() + ` Listening on port ${port}...`));