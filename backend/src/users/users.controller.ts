import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardProfileDto } from './dto/onboard-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    return this.usersService.register(dto);
  }

  @Post('onboarding')
  @HttpCode(HttpStatus.OK)
  async onboard(@Body() dto: OnboardProfileDto) {
    return this.usersService.onboard(dto);
  }
}
