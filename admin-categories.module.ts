import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminUsersService } from './admin-users.service';
import { ModerationReasonDto } from './dto/moderation-reason.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get('candidates')
  listCandidates(@Query('search') search?: string, @Query('page') page?: string) {
    return this.adminUsersService.list(Role.CANDIDATE, search, page ? +page : 1);
  }

  @Get('employers')
  listEmployers(@Query('search') search?: string, @Query('page') page?: string) {
    return this.adminUsersService.list(Role.EMPLOYER, search, page ? +page : 1);
  }

  @Patch('users/:id/suspend')
  suspend(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: ModerationReasonDto) {
    return this.adminUsersService.suspend(admin.id, id, dto.reason);
  }

  @Patch('users/:id/ban')
  ban(@CurrentUser() admin: RequestUser, @Param('id') id: string, @Body() dto: ModerationReasonDto) {
    return this.adminUsersService.ban(admin.id, id, dto.reason);
  }

  @Patch('users/:id/reinstate')
  reinstate(@CurrentUser() admin: RequestUser, @Param('id') id: string) {
    return this.adminUsersService.reinstate(admin.id, id);
  }
}
