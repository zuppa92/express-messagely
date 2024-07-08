const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql://emajem666@localhost/messagely"
});

client.connect();

module.exports = client;
