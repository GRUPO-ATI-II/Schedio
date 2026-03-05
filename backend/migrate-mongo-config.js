const dotenv = require("dotenv");
const path = require("path");

// Determinamos qué entorno estamos usando
const env = process.env.NODE_ENV || "dev";

// Cargamos el archivo .env correspondiente (ej: .env.dev)
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

const config = {
  mongodb: {
    // Usamos las variables cargadas desde tu .env.xxxx
    url: process.env.MONGO_URI || "mongodb://localhost:27017",
    databaseName: process.env.DB_NAME || "schedio_db",

    options: {
      // Configuraciones recomendadas para evitar timeouts en migraciones largas
      connectTimeoutMS: 3600000,
      socketTimeoutMS: 3600000,
    },
  },

  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
