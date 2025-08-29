import { IsOptional, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class BasePaginateDto {
  @IsOptional()
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be greater than 0' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be greater than 0' })
  @Max(100, { message: 'Limit must not exceed 100' })
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsString({ message: 'OrderBy must be a string' })
  orderBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'OrderType must be ASC or DESC' })
  orderType?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString({ message: 'Key must be a string' })
  key?: string;

  get hasKeyword() {
    return this.key && this.key.length > 0;
  }

  get keyword() {
    return `%${this.key}%`;
  }
}
