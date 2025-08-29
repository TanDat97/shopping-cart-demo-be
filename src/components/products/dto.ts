import { BasePaginateDto } from '@core/dto';
import { ProductStatus } from '@core/interfaces';
import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional, MaxLength, Matches, IsPositive, IsObject, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IProductImage } from './entity';

export class GetListProductDto extends BasePaginateDto {
  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU must not exceed 100 characters' })
  sku?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be one of: active, inactive, discontinued' })
  status?: ProductStatus;
}

export class ProductImageDto implements IProductImage {
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string' })
  thumbnail?: string;

  @IsOptional()
  @IsString({ message: 'Mobile must be a string' })
  mobile?: string;

  @IsOptional()
  @IsString({ message: 'Tablet must be a string' })
  tablet?: string;

  @IsOptional()
  @IsString({ message: 'Desktop must be a string' })
  desktop?: string;
}

export class ProductDto {
  @IsNotEmpty({ message: 'SKU is required' })
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(100, { message: 'SKU must not exceed 100 characters' })
  @Matches(/^[A-Z0-9-_]+$/, { message: 'SKU must contain only uppercase letters, numbers, hyphens, and underscores' })
  sku: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with up to 2 decimal places' })
  @IsPositive({ message: 'Price must be greater than 0' })
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be one of: active, inactive, discontinued' })
  status: ProductStatus = ProductStatus.active;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MaxLength(100, { message: 'Category must not exceed 100 characters' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsObject({ message: 'Images must be an object' })
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto;
}

export class CreateProductDto extends ProductDto {}

export class UpdateProductDto extends ProductDto {}
