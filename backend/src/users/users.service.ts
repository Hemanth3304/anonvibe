import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardProfileDto } from './dto/onboard-profile.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async register(dto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { username: dto.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username is already taken');
    }

    const passwordHash = this.hashPassword(dto.password);

    // Create user and profile in a transaction
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash,
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          purpose: '',
          interests: [],
          languages: [],
        },
      });

      return {
        userId: user.id,
        email: user.email,
        username: user.username,
        profileId: profile.id,
      };
    });
  }

  async onboard(dto: OnboardProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: dto.userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const updateData: any = {
      onboardingStep: dto.onboardingStep,
    };

    if (dto.purpose !== undefined) updateData.purpose = dto.purpose;
    if (dto.interests !== undefined) updateData.interests = dto.interests;
    if (dto.languages !== undefined) updateData.languages = dto.languages;
    if (dto.locationLatitude !== undefined) updateData.locationLatitude = dto.locationLatitude;
    if (dto.locationLongitude !== undefined) updateData.locationLongitude = dto.locationLongitude;
    if (dto.locationGeohash !== undefined) updateData.locationGeohash = dto.locationGeohash;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;

    return this.prisma.profile.update({
      where: { userId: dto.userId },
      data: updateData,
    });
  }
}
