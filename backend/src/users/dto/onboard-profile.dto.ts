import { IsString, IsArray, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class OnboardProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  onboardingStep: number;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsNumber()
  @IsOptional()
  locationLatitude?: number;

  @IsNumber()
  @IsOptional()
  locationLongitude?: number;

  @IsString()
  @IsOptional()
  locationGeohash?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
