import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createStoredProcedure() {
  console.log(__dirname)
  const filePath = path.join(__dirname, 'create-sp-insert-superadmin.sql');
  const createStoredProcedureSQL = readFileSync(filePath, 'utf8');
  await prisma.$executeRawUnsafe(createStoredProcedureSQL);
  console.log('Stored procedure created successfully');
}

createStoredProcedure().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
