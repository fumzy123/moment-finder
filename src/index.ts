import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(import.meta.env.DATABASE_URL!);
