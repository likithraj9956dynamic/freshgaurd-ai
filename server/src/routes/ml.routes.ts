import { Router } from 'express';
import { MlController } from '../controllers/ml.controller';

const router = Router();

// Demand Forecasting Model Endpoints
router.get('/forecast/status', MlController.getForecastStatus);
router.get('/forecast/all', MlController.getAllForecasts);
router.get('/forecast/:storeId', MlController.getStoreForecasts);
router.get('/forecast/:storeId/:sku', MlController.getProductForecast);

// Wastage Risk Model Endpoints
router.get('/wastage/status', MlController.getWastageStatus);
router.get('/wastage/summaries', MlController.getAllWastageSummaries);
router.get('/wastage/critical', MlController.getCriticalWastageRisks);
router.get('/wastage/store/:storeId', MlController.getStoreWastageSummary);
router.get('/wastage/sku/:sku', MlController.getSkuWastageRisk);

export default router;
