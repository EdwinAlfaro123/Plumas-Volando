import app from "./app.js";
import "./database.js";


// ============================================================
// PUERTO
// ============================================================

// Render proporciona PORT mediante variable de entorno.
// Cuando trabajamos localmente utilizamos 4000.

const PORT = process.env.PORT || 4000;


// ============================================================
// SERVIDOR
// ============================================================

async function main() {

  try {

    app.listen(PORT, "0.0.0.0", () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "Error starting server:",
      error
    );

    process.exit(1);

  }

}


main();