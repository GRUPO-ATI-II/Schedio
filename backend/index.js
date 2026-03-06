const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
// Importamos la librería completa primero
const migrateMongo = require("migrate-mongo");

const env = process.env.NODE_ENV || "dev";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

// Módulos (Usuarios, Agenda, etc.)
const userModule = require("./src/users/user.module");
const agendaModule = require("./src/agenda/agenda.module");
const reminderModule = require("./src/reminders/reminders.module");
const eventModule = require("./src/event/event.module");
const subjectModule = require("./src/subject/subject.module");
const assignmentModule = require("./src/assignments/assignment.module");
const gradeModule = require("./src/grades/grade.module");

const app = express();
app.use(cors());
app.use(express.json());

const runMigrations = async () => {
  try {
    console.log(
      `🔄 [Migrator]: Verificando migraciones en entorno: ${env.toUpperCase()}`,
    );

    // migrate-mongo v14.x (CommonJS) returns promises via Proxy
    const up = await migrateMongo.up;
    const config = await migrateMongo.config;

    // Cargar la configuración desde migrate-mongo-config.js
    await config.read();

    // Mongoose ya está conectado, usamos su base de datos nativa
    const db = mongoose.connection.db;

    const migrated = await up(db);

    if (migrated && migrated.length > 0) {
      migrated.forEach((file) =>
        console.log(`✅ [Migrator]: Ejecutada -> ${file}`),
      );
    } else {
      console.log("ℹ️ [Migrator]: No hay migraciones pendientes.");
    }
  } catch (err) {
    console.error("❌ [Migrator Error]:", err.message);
  }
};

// 3. Configuración de MongoDB y Arranque
const startApp = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://mongo:27017/schedio_dev";

    await mongoose.connect(mongoUri);
    console.log(
      `🔌 [DB]: MongoDB Conectado a ${process.env.DB_NAME || "schedio_dev"}`,
    );

    // Ejecutar migraciones tras conectar la DB
    await runMigrations();

    // Cargar módulos
    userModule(app);
    agendaModule(app);
    reminderModule(app);
    eventModule(app);
    subjectModule(app);
    assignmentModule(app);
    gradeModule(app);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(
        `🚀 [Server]: Schedio API lista en modo ${env.toUpperCase()}`,
      );
      console.log(`🔗 [URL]: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ [Fatal Error]:", err.message);
    process.exit(1);
  }
};

startApp();
