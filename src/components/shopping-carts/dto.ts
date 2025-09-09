import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsUUID, IsPositive } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BasePaginateDto } from '@core/dto';

export class GetCartDto extends BasePaginateDto {
  @IsOptional()
  @IsUUID(4, { message: 'Cart UUID must be a valid UUID' })
  uuid?: string;

  @IsOptional()
  @IsNumber({}, { message: 'User ID must be a number' })
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  status?: string;
}


export class CartItemDto {
  @IsString({ message: 'Product SKU must be a string' })
  productSku: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be greater than 0' })
  @Type(() => Number)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with up to 2 decimal places' })
  @IsPositive({ message: 'Price must be greater than 0' })
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Discount amount must be a number with up to 2 decimal places' })
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  discount?: number;

  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  productName?: string;

  @IsOptional()
  @IsString({ message: 'Product image must be a string' })
  productImage?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}

export class PreviewCartDto {
  @IsArray({ message: 'Cart items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsOptional()
  @IsString({ message: 'Currency must be a string' })
  currency?: string;

  @IsOptional()
  @IsArray({ message: 'Promotions must be an array' })
  @IsString({ each: true, message: 'Promotions must be an array of strings' })
  promotionCodes?: string[];
}

export class CheckoutCartDto {
  @IsOptional()
  @IsString({ message: 'Cart UUID must be a string' })
  cartUuid: string;

  @IsArray({ message: 'Cart items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsOptional()
  @IsString({ message: 'Currency must be a string' })
  currency?: string;

  @IsOptional()
  @IsArray({ message: 'Promotions must be an array' })
  @IsString({ each: true, message: 'Promotions must be an array of strings' })
  promotionCodes?: string[];
}