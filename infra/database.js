import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLValues(),
  });
  console.log(getSSLValues());

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    const cert = process.env.POSTGRES_CA.replace(/\\n/g, "\n") // converte \n literais
      .trim();

    console.log("SSL preview:");
    console.log(cert.substring(0, 60));

    return {
      rejectUnauthorized: true,
      ca: cert,
    };
  }

  return process.env.NODE_ENV === "development"
    ? false
    : { rejectUnauthorized: false };
}

console.log("RAW:");
console.log(JSON.stringify(process.env.POSTGRES_CA));
console.log(process.env.POSTGRES_CA?.substring(0, 100));
