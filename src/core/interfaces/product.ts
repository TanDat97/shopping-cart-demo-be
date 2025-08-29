import { BaseInterface } from "./base";

export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
  discontinued = 'discontinued',
}

export interface ProductInterface extends BaseInterface {
  id: number;
  sku: string;
  name: string;
  price: number;
  status: ProductStatus;
}
