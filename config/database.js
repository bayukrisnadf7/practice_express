const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;
const maxConnection = 10;

const pool = new Pool({ connectionString, maxConnection });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
