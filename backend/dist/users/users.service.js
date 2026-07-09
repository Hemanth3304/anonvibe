"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = require("crypto");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { username: dto.username },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email or username is already taken');
        }
        const passwordHash = this.hashPassword(dto.password);
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
    async onboard(dto) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId: dto.userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('User profile not found');
        }
        const updateData = {
            onboardingStep: dto.onboardingStep,
        };
        if (dto.purpose !== undefined)
            updateData.purpose = dto.purpose;
        if (dto.interests !== undefined)
            updateData.interests = dto.interests;
        if (dto.languages !== undefined)
            updateData.languages = dto.languages;
        if (dto.locationLatitude !== undefined)
            updateData.locationLatitude = dto.locationLatitude;
        if (dto.locationLongitude !== undefined)
            updateData.locationLongitude = dto.locationLongitude;
        if (dto.locationGeohash !== undefined)
            updateData.locationGeohash = dto.locationGeohash;
        if (dto.avatarUrl !== undefined)
            updateData.avatarUrl = dto.avatarUrl;
        return this.prisma.profile.update({
            where: { userId: dto.userId },
            data: updateData,
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map