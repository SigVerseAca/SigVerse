const app = require('./app');
const { ensureMySqlSchema } = require('./config/db.mysql');
const { connectMongo } = require('./config/db.mongo');
const BootstrapService = require('./services/BootstrapService');
const PORT = process.env.PORT || 3000;

function formatStartupError(err) {
  const nestedMessage = err?.cause?.message || err?.original?.message || err?.parent?.message;
  const primaryMessage = err?.message || nestedMessage;

  if (primaryMessage && err?.name && primaryMessage !== err.name) {
    return `${err.name}: ${primaryMessage}`;
  }

  return primaryMessage || err?.name || 'Unknown startup error';
}

Promise.all([ensureMySqlSchema(), connectMongo()])
  .then(() => BootstrapService.ensureDemoAccounts())
  .then(() => {
    console.log('✅ Demo local accounts ready');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Startup failed:', formatStartupError(err));

    if (process.env.NODE_ENV !== 'production' && err?.stack) {
      console.error(err.stack);
    }

    process.exit(1);
  });
