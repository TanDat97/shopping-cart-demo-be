import { CoreService } from '@core';
import { ShoppingCartRepository } from './repository';
import { PreviewCartDto, CartItemDto, CheckoutCartDto } from './dto';
import { PromotionType, IPromotionResult } from '@core/interfaces';
import { Num } from '@utils';

export class ShoppingCartService extends CoreService {
  protected repository: ShoppingCartRepository;

  constructor() {
    super(new ShoppingCartRepository());
  }

  getDetailByUser() {
    return null;
  }

  async previewCart(dto: PreviewCartDto) {
    const currency = dto.currency || 'USD';
    let subTotalAmount = 0;
    let totalItems = 0;

    // Calculate items subTotalAmount first
    const processedItems = dto.items.map((item: CartItemDto) => {
      const itemDiscountAmount = item.discount || 0;
      const itemTotalPrice = item.price * item.quantity - itemDiscountAmount;

      subTotalAmount += itemTotalPrice;
      totalItems += item.quantity;

      return {
        productSku: item.productSku,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discount: itemDiscountAmount,
        totalPrice: itemTotalPrice,
      };
    });

    // Apply promotions if any
    const promotions: IPromotionResult[] = [];
    let totalDiscount = 0;

    if (dto.promotionCodes?.length) {
      for (const promoCode of dto.promotionCodes) {
        const promotionResult = this.calculatePromotion(promoCode, processedItems);
        if (promotionResult) {
          promotions.push(promotionResult);
          totalDiscount += promotionResult.discountAmount;
        }
      }
    }

    const finalTotalAmount = Math.max(0, subTotalAmount - totalDiscount);

    return {
      totalDiscount: Num.round(totalDiscount, 2),
      subTotalAmount: Num.round(subTotalAmount, 2),
      totalAmount: Num.round(finalTotalAmount, 2),
      totalItems,
      currency,
      items: processedItems,
      promotions: promotions.map(promo => ({
        code: promo.code,
        type: promo.type,
        discountAmount: Num.round(promo.discountAmount, 2),
        description: promo.description,
        appliedToItems: promo.appliedToItems,
      })),
    };
  }

  async checkoutCart(dto: CheckoutCartDto) {
    // check if cart is exist and valid to checkout
    // check if cart items is valid
    // create order
    // update cart status to completed
    // return order

    // current just process like preview cart
    return this.previewCart(dto);
  }

  private calculatePromotion(code: string, items: any[]): IPromotionResult | null {
    const upperCode = code.toUpperCase();

    switch (upperCode) {
      case 'HAPPYHOURS':
        return this.applyPercentageDiscount(code, items, 18);

      case 'BUYGETONE':
        return this.applyFreeLowestPricedItem(code, items);

      default:
        return null;
    }
  }

  private applyPercentageDiscount(code: string, items: any[], percentage: number): IPromotionResult {
    const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = totalValue * (percentage / 100);

    return {
      code: code.toUpperCase(),
      type: PromotionType.PERCENTAGE,
      discountAmount: Num.round(discountAmount, 2),
      description: `Discount code ${code.toUpperCase()} applies ${percentage}% discount to the order total`,
      appliedToItems: items.map(item => item.productSku),
    };
  }

  private applyFreeLowestPricedItem(code: string, items: any[]): IPromotionResult {
    if (items.length === 0) {
      return {
        code: code.toUpperCase(),
        type: PromotionType.FREE_ITEM,
        discountAmount: 0,
        description: `Discount code ${code.toUpperCase()} gives the lowest priced item for free`,
        appliedToItems: [],
      };
    }

    // Find the item with the lowest unit price
    const lowestPricedItem = items.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });

    // The discount is the price of one unit of the lowest priced item
    const discountAmount = Number(lowestPricedItem.price);

    return {
      code: code.toUpperCase(),
      type: PromotionType.FREE_ITEM,
      discountAmount: Num.round(discountAmount, 2),
      description: `Discount code ${code.toUpperCase()} gives the lowest priced item for free`,
      appliedToItems: [lowestPricedItem.productSku],
    };
  }
}
