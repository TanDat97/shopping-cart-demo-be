import { NextFunction, Request, Response } from 'express';
import { BaseController } from '@core';
import { ShoppingCartService } from './services';
import { CheckoutCartDto, PreviewCartDto } from './dto';

export class ShoppingCartController extends BaseController {
  public service: ShoppingCartService;

  constructor() {
    super();
    this.service = new ShoppingCartService();
  }

  /**
   * GET /carts/user - Get detail of cart by user
   */
  getDetailByUser = async (req: Request, res: Response) => {
    const result = await this.service.getDetailByUser();

    res.status(200).json({
      code: 200,
      message: 'Get carts detail success',
      data: null,
    });
  };

  /**
   * POST /carts/preview - Preview cart calculation without saving
   * This API calculates total amount and returns preview data
   */
  previewCart = async (req: Request, res: Response) => {
    const dto = req.body as PreviewCartDto;
    const result = await this.service.previewCart(dto);

    res.status(200).json({
      code: 200,
      message: 'Cart preview calculated successfully',
      data: result,
    });
  };

  /**
   * POST /carts/checkout - Checkout cart
   */
  checkoutCart = async (req: Request, res: Response) => {
    const dto = req.body as CheckoutCartDto;
    const result = await this.service.checkoutCart(dto);

    res.status(200).json({
      code: 200,
      message: 'Cart checkout successfully',
      data: result,
    });
  };
}
