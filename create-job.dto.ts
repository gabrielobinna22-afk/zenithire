import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminSettingsService } from './admin-settings.service';
import { SetSettingDto } from './dto/set-setting.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin/settings')
@Roles(Role.ADMIN)
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  list() {
    return this.adminSettingsService.list();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.adminSettingsService.get(key);
  }

  @Put(':key')
  set(@CurrentUser() admin: RequestUser, @Param('key') key: string, @Body() dto: SetSettingDto) {
    return this.adminSettingsService.set(admin.id, key, dto.value);
  }

  @Delete(':key')
  remove(@CurrentUser() admin: RequestUser, @Param('key') key: string) {
    return this.adminSettingsService.remove(admin.id, key);
  }
}
