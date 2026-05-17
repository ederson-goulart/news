import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLConfig(),
  });

  try {
    await client.connect();
    return await client.query(queryObject);
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

function getSSLConfig() {
  // Com SSL no desenvolvimento
  if (process.env.NODE_ENV === "production") {
    return true;
  }

  // SSL em produção

  return false;
}
// return {
//   rejectUnauthorized: false,
// };

export default { query };
