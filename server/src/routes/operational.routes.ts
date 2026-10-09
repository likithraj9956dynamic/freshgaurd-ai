import { Router } from 'express';
import { OperationalController } from '../controllers/operational.controller';

const router = Router();

// Store List
router.get('/stores', OperationalController.getStores);

// Store Operational Endpoints
router.get('/stores/:storeId/sales', OperationalController.getSales);
router.get('/stores/:storeId/inventory', OperationalController.getInventory);
router.get('/stores/:storeId/wastage', OperationalController.getWastage);
router.get('/stores/:storeId/purchase-orders', OperationalController.getPurchaseOrders);

export default router;
