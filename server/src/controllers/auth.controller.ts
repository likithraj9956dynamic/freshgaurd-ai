// ============================================================
// FreshGuard AI — Authentication Controller
// ============================================================

import type { Request, Response, NextFunction } from 'express';
import { serverAuthService } from '../services/auth.service';

export class AuthController {
  public async registerStoreManager(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serverAuthService.registerStoreManager(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async registerSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serverAuthService.registerSupplier(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async registerMainManager(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serverAuthService.registerMainManager(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getBootstrapStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serverAuthService.getBootstrapStatus();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await serverAuthService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async getCurrentUser(req: Request, res: Response, _next: NextFunction) {
    res.json({ user: req.user });
  }

  public async logout(_req: Request, res: Response, _next: NextFunction) {
    res.json({ success: true, message: 'Logged out successfully.' });
  }
}

export const authController = new AuthController();
