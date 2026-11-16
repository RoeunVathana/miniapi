import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsIn(['customer', 'admin'])
  role?: 'customer' | 'admin';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
