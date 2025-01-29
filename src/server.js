
const app = require('./app');
const { initializeDatabase } = require('./models');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();
