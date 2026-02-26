import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateProductDto {

  @ApiProperty({ example: 'iPhone 15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest Apple smartphone' })
  @IsString()
  description: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 10, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  // 🔥 We expose only categoryId (not full Category object)
  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}