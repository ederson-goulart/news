import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("\n Erro dentro do catch do database.js");
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client?.end();
  }
}

function getSSLConfig() {
  if (process.env.NODE_ENV === "production") {
    // SSL em produção
    return {
      rejectUnauthorized: false,
    };
  }
  // Sem SSL no desenvolvimento
  return false;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLConfig(),
  });

  await client.connect();
  return client;
}

const database = { query, getNewClient };

export default database;
