import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardProfileDto } from './dto/onboard-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(dto: RegisterUserDto): Promise<{
        userId: string;
        email: string;
        username: string;
        profileId: string;
    }>;
    onboard(dto: OnboardProfileDto): Promise<{
        userId: string;
        onboardingStep: number;
        purpose: string;
        interests: string[];
        languages: string[];
        locationLatitude: number | null;
        locationLongitude: number | null;
        locationGeohash: string | null;
        avatarUrl: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
