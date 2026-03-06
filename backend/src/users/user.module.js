const userRoutes = require("./routers/user.routes");

module.exports = (app) => {
  app.use("/api/users", userRoutes);
  console.log("📦 [Module]: Usuarios cargado y rutas registradas.");
};
