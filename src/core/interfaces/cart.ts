export enum CartStatus {
  ACTIVE = 'active',
  CHECKOUT = 'checkout', 
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

export enum CartItemStatus {
  ACTIVE = 'active',
  REMOVED = 'removed'
}

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FREE_ITEM = 'free_item'
}

export interface IPromotionResult {
  code: string;
  type: PromotionType;
  discountAmount: number;
  description: string;
  appliedToItems?: string[]; // SKUs that got the discount
}
