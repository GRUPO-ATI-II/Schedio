/**
 * Script de limpieza para eliminar datos de prueba generados por las pruebas de carga/estrés.
 * Uso: node tests/stress/cleanup-test-data.js
 */

const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el backend
dotenv.config({ path: path.join(__dirname, '../../backend/.env.dev') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/schedio_dev';

async function cleanup() {
  try {
    console.log('--- Iniciando limpieza de base de datos ---');
    console.log(`Conectando a: ${MONGO_URI}`);
    
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa.');

    // Definir modelos mínimos para la limpieza (para no depender de los modelos del backend si hay cambios)
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Subject = mongoose.models.Subject || mongoose.model('Subject', new mongoose.Schema({}, { strict: false }));
    const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', new mongoose.Schema({}, { strict: false }));

    // 1. Eliminar Usuarios de carga (username empieza por 'load_')
    const userResult = await User.deleteMany({ username: /^load_/ });
    console.log(`[Usuarios] Eliminados: ${userResult.deletedCount}`);

    // 2. Eliminar Materias de carga (name empieza por 'Subject_load_')
    const subjectResult = await Subject.deleteMany({ name: /^Subject_load_/ });
    console.log(`[Materias] Eliminadas: ${subjectResult.deletedCount}`);

    // 3. Eliminar Tareas de carga (title empieza por 'Task load_')
    const assignmentResult = await Assignment.deleteMany({ title: /^Task / });
    console.log(`[Tareas] Eliminadas: ${assignmentResult.deletedCount}`);

    console.log('--- Limpieza completada con éxito ---');
  } catch (error) {
    console.error('Error durante la limpieza:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

cleanup();
