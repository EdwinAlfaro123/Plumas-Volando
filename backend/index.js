import app from "./app.js";
import connectDB from "./database.js";

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting server:", error);
    process.exit(1);
  }
}

main();