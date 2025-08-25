import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres", // promeni po potrebi
  host: "localhost",
  database: "postgres", // ime baze koju si kreirao
  password: "postgres",
  port: 5432,
});

export default pool;
