import { BasePaginateDto } from '@core/dto';
import { UserStatus } from '@core/interfaces';
import { IsEmail, IsString, IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength, IsUrl, IsIn, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetListUserDto extends BasePaginateDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;
}

export class UserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(50, { message: 'Username must not exceed 50 characters' })
  username?: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be one of: enabled, disabled' })
  status: UserStatus = UserStatus.enabled;

  @IsOptional()
  @IsNumber({}, { message: 'isActive must be a number' })
  @IsIn([0, 1], { message: 'isActive must be 0 or 1' })
  @Type(() => Number)
  isActive: number = 1;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @MaxLength(500, { message: 'Avatar URL must not exceed 500 characters' })
  avatar?: string;
}

export class CreateUserDto extends UserDto {}

export class UpdateUserDto extends UserDto {}
