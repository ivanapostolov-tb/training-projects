const { Pool, Client } = require("pg");
const xlsx = require('node-xlsx');

const pool = new Pool({
    user: "ekatte_user",
    host: "localhost",
    database: "ekatte_db",
    password: "ekatte_pass",
    port: "5432"
});

const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (typeof res !== 'undefined') {
                resolve(res)
            } else {
                reject(err);
            }
        });
    });
}

//Unified Classifier of the Administrative-Territorial and Territorial Units (UCATTU)

class EKATTEDatabase {
    static create() {
        const sql = `
        CREATE TABLE Provinces(id VARCHAR(3) NOT NULL UNIQUE, name VARCHAR(255) NOT NULL); 
        CREATE TABLE Municipalities(id VARCHAR(2) NOT NULL, province_code VARCHAR(3) NOT NULL, name VARCHAR(255) NOT NULL); 
        CREATE TABLE Towns(ucattu_code INT NOT NULL UNIQUE, municipality_code VARCHAR(5) NOT NULL, name VARCHAR(255) NOT NULL, kind INT NOT NULL)`;

        return executeQuery(sql);
    }

    static insert() {
        const provincesPath = __dirname + "/../assets/Ek_obl.xlsx";
        const municipalitiesPath = __dirname + "/../assets/Ek_obst.xlsx";
        const townsPath = __dirname + "/../assets/Ek_atte.xlsx";

        return new Promise((resolve, reject) => {
            try {
                const provinces = xlsx.parse(provincesPath)[0].data;
                const municipalities = xlsx.parse(municipalitiesPath)[0].data;
                const towns = xlsx.parse(townsPath)[0].data;

                const provincesSQL = "INSERT INTO Provinces VALUES($1, $2);";
                const municipalitiesSQL = "INSERT INTO Municipalities VALUES($1, $2, $3);";
                const townsSQL = "INSERT INTO Towns VALUES($1, $2, $3, $4);";

                for (let i = 1; i < provinces.length; i++) {
                    executeQuery({ text: provincesSQL, values: [provinces[i][0], provinces[i][2]] }).catch(err => { reject(err) });
                }

                for (let i = 1; i < municipalities.length; i++) {
                    executeQuery({ text: municipalitiesSQL, values: [municipalities[i][0].slice(-2), municipalities[i][0].substring(0, 3), municipalities[i][2]] }).catch(err => { reject(err) });
                }

                for (let i = 2; i < towns.length; i++) {
                    executeQuery({ text: townsSQL, values: [towns[i][0], towns[i][4], towns[i][2], towns[i][6]] }).catch(err => { reject(err) });
                }

                resolve({ result: "All records inserted successfully" });
            } catch {
                reject({ error: "Database Insert Error" });
            }
        });
    }

    static truncate() {
        const sql = "TRUNCATE TABLE Towns; TRUNCATE TABLE Municipalities; TRUNCATE TABLE Provinces";

        return executeQuery(sql);
    }

    static drop() {
        const sql = "DROP TABLE Towns; DROP TABLE Municipalities; DROP TABLE Provinces";

        return executeQuery(sql);
    }

    static async doesTablesExist() {
        const sql = "SELECT to_regclass('Towns'); SELECT to_regclass('Provinces'); SELECT to_regclass('Municipalities');";
        try {
            const results = await executeQuery(sql);

            for (let i = 0; i < results.length; i++) {
                if (!results[i].rows[0].to_regclass) {
                    return false;
                }
            }

            return true;
        } catch {
            console.log({ err: "Error occurred while trying to check if tables exist" });

            return false;
        }
    }

    static selectAllDistinctTownNames() {
        const sql = "SELECT DISTINCT name FROM Towns";

        return executeQuery(sql);
    }

    static selectAllTowns() {
        const sql = "SELECT * FROM Towns";

        return executeQuery(sql);
    }

    static selectByMunicipalityCode(code) {
        const sql = "SELECT * FROM Municipalities WHERE id = $1 AND province_code = $2";

        return executeQuery({ text: sql, values: [code.slice(-2), code.substring(0, 3)] });
    }

    static selectByProvinceCode(code) {
        const sql = "SELECT * FROM Provinces WHERE id = $1";

        return executeQuery({ text: sql, values: [code] });
    }

    static selectByUcattuCode(code) {
        const sql = "SELECT * FROM Towns WHERE ucattu_code = $1";

        return executeQuery({ text: sql, values: [code] });
    }

    static selectTownByName(name) {
        const sql = "SELECT * FROM Towns WHERE name = $1";

        return executeQuery({ text: sql, values: [name] });
    }

    static getProvincesCount() {
        return new Promise((resolve, reject) => {
            executeQuery("SELECT COUNT(id) FROM Provinces WHERE id IS NOT NULL").then(res => {
                resolve(parseInt(res.rows[0].count));
            }).catch(err => {
                reject(err.code);
                //Code 42P01 means relation "provinces" does not exist
            });
        });
    }

    static getMunicipalitiesCount() {
        return new Promise((resolve, reject) => {
            executeQuery("SELECT COUNT(id) FROM Municipalities WHERE id IS NOT NULL").then(res => {
                resolve(parseInt(res.rows[0].count));
            }).catch(err => {
                reject(err.code);
            });
        });
    }

    static getTownsCount() {
        return new Promise((resolve, reject) => {
            executeQuery("SELECT COUNT(ucattu_code) FROM Towns WHERE ucattu_code IS NOT NULL").then(res => {
                resolve(parseInt(res.rows[0].count));
            }).catch(err => {
                reject(err.code);
            });
        });
    }
}

module.exports = EKATTEDatabase;