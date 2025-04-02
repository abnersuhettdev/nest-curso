import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsInt()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  offset: number;
}
