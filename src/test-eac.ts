import { Apify } from "./index";

async function testEaC() {
  console.log("🚀 Testing Everything as Code...");

  const app = new Apify();

  // O loadModules vai carregar o orders-eac.ts automaticamente
  await app.loadModules();

  app.listen(3355, () => {
    console.log("✅ Server running on http://localhost:3355");
    console.log("Try:");
    console.log("  GET http://localhost:3355/api/v1/orders");
    console.log("  POST http://localhost:3355/api/v1/orders with JSON body");

    // Auto-terminar após 2 segundos de teste (simulado)
    setTimeout(() => {
      console.log("Test finished.");
      process.exit(0);
    }, 2000);
  });
}

testEaC().catch(console.error);
