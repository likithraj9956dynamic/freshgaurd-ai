// ============================================================
// FreshGuard AI — Access Request Controller
// ============================================================

import type { Request, Response, NextFunction } from 'express';
import { accessRequestService } from '../services/access-request.service';

export class AccessRequestController {
  public async listRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const requests = await accessRequestService.listRequests(status);
      res.json({ data: requests, count: requests.length });
    } catch (err) {
      next(err);
    }
  }

  public async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = await accessRequestService.getRequestById(id);
      res.json({ data: request });
    } catch (err) {
      next(err);
    }
  }

  public async approveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deciderId = req.user!.id;
      const { notes } = req.body;
      const result = await accessRequestService.approveRequest(id, deciderId, notes);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async rejectRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deciderId = req.user!.id;
      const { reason } = req.body;
      const result = await accessRequestService.rejectRequest(id, deciderId, reason);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async requestMoreInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deciderId = req.user!.id;
      const { instructions } = req.body;
      const result = await accessRequestService.requestMoreInfo(id, deciderId, instructions);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async listApprovedUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await accessRequestService.listApprovedUsers();
      res.json({ data: users, count: users.length });
    } catch (err) {
      next(err);
    }
  }

  public async inviteManager(req: Request, res: Response, next: NextFunction) {
    try {
      const deciderId = req.user!.id;
      const { email } = req.body;
      const result = await accessRequestService.inviteMainManager(deciderId, email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const accessRequestController = new AccessRequestController();
