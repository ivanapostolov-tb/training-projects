const { Pool, Client } = require("pg");

const pool = new Pool({
    user: "ekatte_user",
    host: "localhost",
    database: "ekatte_db",
    password: "ekatte_pass",
    port: "5432"
});

const sendDBQuery = async (query) => {
    try {
        return await pool.query(query);
    } catch (e) {
        console.log(e);
        throw new Error(`Error occured while executing SQL query: ${JSON.stringify(query)}`);
    }
}

class Database {
    constructor() {
        this.sql = '';
        this.params = [];
    }

    get tables() {
        return [{
            name: 'Categories',
            columns: [{
                name: 'Id',
                type: 'SERIAL',
                rules: 'PRIMARY KEY',
            }, {
                name: 'Name',
                type: 'TEXT',
                rules: 'NOT NULL',
            }],
        }, {
            name: 'Items',
            columns: [{
                name: 'Id',
                type: 'SERIAL',
                rules: 'PRIMARY KEY',
            }, {
                name: 'CategoryId',
                type: 'INT',
                rules: 'NOT NULL',
            }, {
                name: 'Name',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, /*{
                name: 'Amount',
                type: 'INT',
                rules: 'NOT NULL',
            }, {
                name: 'Gender',
                type: 'VARCHAR(255)',
                rules: 'NOT NULL',
            }, {
                name: 'Size',
                type: 'VARCHAR(255)',
                rules: 'NOT NULL',
            }, {
                name: 'Material',
                type: 'VARCHAR(255)',
                rules: 'NOT NULL',
            }, {
                name: 'Brand',
                type: 'VARCHAR(255)',
                rules: 'NOT NULL',
            }, {
                name: 'Color',
                type: 'VARCHAR(255)',
                rules: 'NOT NULL',
            },*/
            {
                name: 'Description',
                type: 'JSON',
                rules: 'NOT NULL'
            }, {
                name: 'Price',
                type: 'FLOAT',
                rules: 'NOT NULL',
            }],
        }, {
            name: 'Orders',
            columns: [{
                name: 'Id',
                type: 'SERIAL',
                rules: 'PRIMARY KEY',
            }, {
                name: 'UserEmail',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'Details',
                type: 'JSON',
                rules: 'NOT NULL',
            }, {
                name: 'Status',
                type: 'TEXT',
                rules: 'NOT NULL',
            }],
        }, {
            name: 'ItemVariations',
            columns: [{
                name: 'ItemId',
                type: 'INT',
                rules: 'NOT NULL',
            }, {
                name: 'Color',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'Size',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'Quantity',
                type: 'INT',
                rules: 'NOT NULL',
            }],
        }, {
            name: 'OrderedProducts',
            columns: [{
                name: 'OrderId',
                type: 'INT',
                rules: 'NOT NULL',
            }, {
                name: 'ItemId',
                type: 'INT',
                rules: 'NOT NULL',
            }, {
                name: 'Amount',
                type: 'INT',
                rules: 'NOT NULL',
            }],
        }, {
            name: 'Users',
            columns: [{
                name: 'Email',
                type: 'TEXT',
                rules: 'PRIMARY KEY',
            }, {
                name: 'Password',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'Salt',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'FirstName',
                type: 'TEXT',
                rules: 'NOT NULL',
            }, {
                name: 'LastName',
                type: 'TEXT',
                rules: 'NOT NULL',
            }],
        }];
    }

    async create(table) {
        const sql = `CREATE TABLE ${table.name}(${table.columns.map(e => e.name + ' ' + e.type + ' ' + e.rules + ', ').reduce((a, b) => a + b).slice(0, -2)});`;

        try {
            return await sendDBQuery(sql);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async createAll() {
        return await Promise.all(this.tables.map(e => this.create(e)));
    }

    async drop(name) {
        const sql = `DROP TABLE ${name};`;

        try {
            return await sendDBQuery(sql);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async dropAll() {
        return await Promise.all(this.tables.map(e => this.drop(e.name)));
    }

    async doesTableExist(name) {
        const sql = `SELECT to_regclass($1);`;

        try {
            const result = await sendDBQuery({ text: sql, values: [name] });

            return result.rows[0].to_regclass ? true : false;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async doAllTablesExist() {
        const results = await Promise.all(this.tables.map(e => this.doesTableExist(e.name)));

        return results.every(Boolean);
    }

    async insert(name, values) {
        try {
            const columns = this.tables.find(e => e.name === name).columns;

            const sql = `INSERT INTO ${name} VALUES(${values.map((e, i) => (columns[i].type === 'SERIAL' ? 'DEFAULT, ' : '') + '$' + (i + 1)).reduce((a, b) => a + ', ' + b)}) RETURNING *;`;

            return await sendDBQuery({ text: sql, values: values });
        } catch (e) {
            console.error({ Error: e.message });

            //throw new Error(e.message);
        }
    }

    async send() {
        try {
            const response = await pool.query({ text: this.sql, values: this.params });

            this.sql = '';
            this.params = [];

            return response.rows;
        } catch (e) {
            console.error(e);

            throw new Error(`Error occured while executing SQL query: ${JSON.stringify(query)}`);
        }
    }

    update(table) {
        this.sql = `UPDATE ${table}`;

        return this;
    }

    set(columns) {
        if (typeof columns === 'object') {
            this.sql += ' SET' + Object.entries(columns).map((e, i) => ` ${e[0]} = $${i + this.params.length + 1}`).toString();

            this.params = this.params.concat(Object.values(columns));
        } else if (typeof columns === 'string') {
            this.sql += ' SET ' + columns;
        }

        return this;
    }

    join(table, relation, direction) {
        if (typeof table === 'string' && typeof relation === 'string' && typeof direction === 'string') {
            this.sql += ` ${direction.toUpperCase()} JOIN ${table} ON ${relation}`;
        }

        return this;
    }

    order_by(columns, order) {
        if (Array.isArray(columns)) {
            columns = columns.join();
        }

        if (typeof columns === 'string' && columns !== '') {
            this.sql = `SELECT * FROM (${this.sql}) ORDER BY ${columns}${typeof order === 'string' ? ' ' + order : ''}`
        }

        return this;
    }

    or_where(conditions) {
        if (typeof conditions === 'object' && conditions !== null) {
            this.sql += ` ${this.sql.includes('WHERE') ? 'OR' : 'WHERE'}`;

            Object.keys(conditions).forEach((e, i) => {
                this.sql += ` ${e}${e.indexOf(' ') >= 0 ? '' : ' ='} $${i + this.params.length + 1} OR`;
            });

            this.sql = this.sql.substring(0, this.sql.lastIndexOf(' '));

            this.params = this.params.concat(Object.values(conditions));
        }

        return this;
    }

    where_in(conditions) {
        if (typeof conditions === 'object' && conditions !== null) {
            this.sql += ` ${this.sql.includes('WHERE') ? 'AND' : 'WHERE'}`;

            Object.keys(conditions).forEach((e, i) => {
                this.sql += ` ${e} IN (${conditions[e].map((a, i) => '$' + (i + this.params.length + 1))}) AND`;

                this.params.push(...conditions[e]);
            });

            this.sql = this.sql.substring(0, this.sql.lastIndexOf(' '));
        }

        console.log(this.sql);

        return this;
    }

    where(conditions) {
        if (typeof conditions === 'object' && conditions !== null) {
            this.sql += ' WHERE';

            Object.keys(conditions).forEach((e, i) => {
                this.sql += ` ${e}${e.indexOf(' ') >= 0 ? '' : ' ='} $${i + this.params.length + 1} AND`;
            });

            this.sql = this.sql.substring(0, this.sql.lastIndexOf(' '));

            this.params = this.params.concat(Object.values(conditions));
        }

        return this;
    }

    from(tables) {
        if (typeof tables === 'string') {
            tables = tables.split(',').map(e => e.trim());
        }

        if (Array.isArray(tables)) {
            this.sql += ' FROM';

            this.sql += tables.reduce((a, e) => a + ` ${e},`, '').slice(0, -1);

            return this;
        }
    }

    as(alias) {
        this.sql += ` AS ${alias}`;

        return this;
    }

    distinct_on(column) {
        this.sql = this.sql.replace('SELECT', `SELECT DISTINCT ON(${column})`);

        return this;
    }

    distinct() {
        this.sql = this.sql.replace('SELECT', 'SELECT DISTINCT');

        return this;
    }

    select(fields) {
        if (typeof fields === 'string') {
            fields = fields.split(',').map(e => e.trim());
        }

        if (Array.isArray(fields)) {
            this.sql = 'SELECT';
            this.params = [];

            this.sql += fields.reduce((a, e) => a + ` ${e},`, '').slice(0, -1);

            return this;
        }
    }

    async doesUserExist(email) {
        const sql = `SELECT COUNT(1) FROM Users WHERE Email = $1`;

        try {
            const result = await sendDBQuery({ text: sql, values: [email] });

            return result.rows[0].count != 0;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async createAdmin() {
        const sql = `INSERT INTO Users VALUES('admin@admin.com', 'ddd11801556540639b233f9070c6bc29bd353d91a32a9623253d4b643b914b6b32166efa1246cfcec7030b305cbe66189a0998ed3dd13dddd1f9af1cbd3c0e25', '7dfe07b69366', 'Admin', 'Admin');`;

        try {
            return await sendDBQuery(sql);
        } catch (e) {
            throw new Error(e.message);
        }
    }
}

module.exports = Database;