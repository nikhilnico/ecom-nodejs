import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional } from 'class-validator';

export class ProductFilterDto {
  @ApiProperty({ example: 'ASC', description: 'Sort order (ASC or DESC)' })
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sort: string;

  @ApiProperty({ example: '0', description: 'Minimum price filter' })
  @IsNumberString()
  minPrice: string;

  @ApiProperty({ example: '1000', description: 'Maximum price filter' })
  @IsNumberString()
  maxPrice: string;

  @ApiProperty({ example: '1', description: 'Category ID filter' })
  @IsNumberString()
  categoryId: string;
}