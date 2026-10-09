import app from './app';
import { env } from './config/env';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`≡ƒÜÇ FreshGuard AI Backend server running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`≡ƒôí Health endpoint available at: http://localhost:${PORT}/api/v1/health`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
  console.log(`\n≡ƒ¢æ Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('≡ƒÆñ HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
