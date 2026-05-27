import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect("", {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("La Base está conectada");
  })
  .catch((error) => {
    console.log("Error al conectar MongoDB:", error.message);
  });

mongoose.connection.on("disconnected", () => {
  console.log("La Base está desconectada");
});

mongoose.connection.on("error", (error) => {
  console.log("Error found:", error.message);
});