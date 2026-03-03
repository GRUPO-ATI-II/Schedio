const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const { database, up } = require("migrate-mongo");
// IMPORTANTE: Importamos la configuración para el migrador
const migrateConfig = require("./migrate-mongo-config.js");

// 1. Configuración de Entorno Dinámica
const env = process.env.NODE_ENV || "dev";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

// Importación de Módulos
const userModule = require("./src/users/user.module");
const agendaModule = require("./src/agenda/agenda.module");
const reminderModule = require("./src/reminders/reminders.module");
const eventModule = require("./src/event/event.module");
const subjectModule = require("./src/subject/subject.module");
const assignmentModule = require("./src/assignments/assignment.module");
const gradeModule = require("./src/grades/grade.module");

const app = express();
app.use(express.json());

// 2. Función para ejecutar Migraciones automáticas
const runMigrations = async () => {
  try {
    console.log(
      `🔄 [Migrator]: Verificando migraciones en entorno: ${env.toUpperCase()}`,
    );

    // CORRECCIÓN: Pasamos migrateConfig a la función connect
    const { db, client } = await database.connect(migrateConfig);
    const migrated = await up(db, client);

    migrated.forEach((file) =>
      console.log(`✅ [Migrator]: Ejecutada con éxito -> ${file}`),
    );

    if (migrated.length === 0) {
      console.log("ℹ️ [Migrator]: No hay migraciones pendientes.");
    }

    // Cerramos la conexión del cliente de migración (no la de mongoose)
    await client.close();
  } catch (err) {
    console.error(
      "❌ [Migrator Error]: No se pudieron ejecutar las migraciones:",
      err.message,
    );
    // En desarrollo, podrías quitar el process.exit para que la app no muera
    // process.exit(1);
  }
};

// 3. Configuración de MongoDB y Arranque de App
const startApp = async () => {
  try {
    // Conexión a DB via Mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `🔌 [DB]: MongoDB Conectado a ${process.env.DB_NAME || "Schedio"}`,
    );
    mongoose.set("autoIndex", true);

    // Ejecutar migraciones
    await runMigrations();

    // Inicialización de Módulos
    userModule(app);
    agendaModule(app);
    reminderModule(app);
    eventModule(app);
    subjectModule(app);
    assignmentModule(app);
    gradeModule(app);

    // 4. Escucha de Puerto Dinámica
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
