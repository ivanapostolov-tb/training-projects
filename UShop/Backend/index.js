const Logger = require("./debugging-tools/Logger");
const Database = require("./database/Database");
const express = require("express");

const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");

const app = express();

app.disable("etag");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

app.use(express.json());

app.use("/api", apiRouter);
app.use("/auth", authRouter);

app.use(express.static(__dirname + "/assets"));

const db = new Database();

const initialize = async () => {
  try {
    await db.dropAll();

    if (await db.doAllTablesExist()) {
      console.log("Everything is ready");
    } else {
      await db.createAll();
      console.log("Tables were created");
    }

    if (await db.doesUserExist('admin@admin.com')) {
      console.log("Admin exist");
    } else {
      await db.createAdmin();
    }

    await db.insert('Categories', ['Shirts']);
    await db.insert('Categories', ['T-Shirts']);
    await db.insert('Categories', ['Tank Tops']);
    await db.insert('Categories', ['Sweatshirts']);
    await db.insert('Categories', ['Sweater']);
    await db.insert('Categories', ['Coats']);
    await db.insert('Categories', ['Jacket']);
    await db.insert('Categories', ['Jeans']);

    await db.insert('Items', [1, 'Black Casual Shirt US Polo', { gender: 'man', material: 'silk', brand: 'us polo' }, 101.99]);
    await db.insert('ItemVariations', [1, 'black', 'S', 5]);
    await db.insert('ItemVariations', [1, 'white', 'L', 5]);
    await db.insert('Items', [1, 'Red Plaid Winter Shirt TEODOR', { gender: 'man', material: 'cutton', brand: 'teodor' }, 21.99]);
    await db.insert('ItemVariations', [2, 'red', 'S', 5]);
    await db.insert('Items', [1, 'White Spring Shirt H&M', { gender: 'man', material: 'polyester', brand: 'h&m' }, 11.99]);
    await db.insert('ItemVariations', [3, 'white', 'S', 5]);
    await db.insert('Items', [1, 'White Spring Shirt ZARA Premium', { gender: 'man', material: 'spandex', brand: 'zara' }, 89.99]);
    await db.insert('ItemVariations', [4, 'white', 'XS', 5]);
    await db.insert('Items', [1, 'Black Sport Shirt LC Waikiki', { gender: 'man', material: 'polyester', brand: 'lc waikiki' }, 89.99]);
    await db.insert('ItemVariations', [5, 'black', 'M', 5]);
    await db.insert('Items', [1, 'Red Plaid Casual Shirt Lee Cooper', { gender: 'man', material: 'tweed', brand: 'lee cooper' }, 89.99]);
    await db.insert('ItemVariations', [6, 'red', 'L', 5]);
    await db.insert('ItemVariations', [6, 'dark green', 'L', 5]);

    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
    await db.insert('Orders', ['mail@mail.com', '{"total":"11.99","time":"2020-10-30T14:50:27Z","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"1 Main St","admin_area_2":"San Jose","admin_area_1":"CA","postal_code":"95131","country_code":"US"}}}', 'received']);
  } catch (e) {
    throw e;
  }
};

initialize()
  .then((res) => {
    //console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(Logger.now() + ` Listening on port ${port}...`)
);
