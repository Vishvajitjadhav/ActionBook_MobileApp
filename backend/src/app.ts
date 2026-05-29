import { Resolver } from 'dns/promises';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import notesRouter from './routes/notes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

// Bypasses the Windows OS DNS client entirely.
// Resolves MongoDB SRV + TXT records via Google's public DNS (8.8.8.8)
// and builds a direct mongodb:// URL so the OS DNS is never involved.
async function buildDirectUri(srvUri: string): Promise<string> {
  const url = new URL(srvUri);
  const hostname = url.hostname;

  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

  console.log(`Resolving _mongodb._tcp.${hostname} via Google DNS...`);

  const [srvResult, txtResult] = await Promise.allSettled([
    resolver.resolveSrv(`_mongodb._tcp.${hostname}`),
    resolver.resolveTxt(hostname),
  ]);

  if (srvResult.status === 'rejected') {
    throw new Error(`SRV lookup failed: ${(srvResult.reason as Error).message}`);
  }

  const hosts = srvResult.value.map((r) => `${r.name}:${r.port}`).join(',');
  console.log(`Resolved hosts: ${hosts}`);

  const txtOptions =
    txtResult.status === 'fulfilled' && txtResult.value.length > 0
      ? txtResult.value.flat().join('&')
      : 'authSource=admin';

  const db = url.pathname.slice(1) || 'actionbook';
  return `mongodb://${url.username}:${url.password}@${hosts}/${db}?ssl=true&${txtOptions}`;
}

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/notes', notesRouter);
app.use(errorHandler);

async function start() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  let uri = MONGODB_URI;
  if (uri.startsWith('mongodb+srv://')) {
    uri = await buildDirectUri(uri);
  }

  await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 });
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch((err: Error) => {
  console.error('Startup error:', err.message);
  process.exit(1);
});
