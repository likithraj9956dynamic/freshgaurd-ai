import { SeedService } from '../services/seed.service';

async function runSeed() {
  console.log('🌱 Starting FreshGuard AI Operational Demo Data Seeder...');
  try {
    const result = await SeedService.seedDemoData();
    console.log('✅ Demo Seed Complete:');
    console.log(`   - Stores: ${result.storesCount}`);
    console.log(`   - Products: ${result.productsCount}`);
    console.log(`   - Daily Sales Records: ${result.salesCount}`);
    console.log(`   - Inventory Items: ${result.inventoryCount}`);
    console.log(`   - Purchase Orders: ${result.purchaseOrdersCount}`);
    console.log(`   - Wastage Records: ${result.wastageCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder encountered an error:', error);
    process.exit(1);
  }
}

runSeed();
