import { Request, Response } from 'express';

export const healthController = {
  async check(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: 'ok' });
  },
};
