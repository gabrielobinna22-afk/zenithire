import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types/auth.types';

@Controller('companies')
@Roles(Role.EMPLOYER)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  register(@CurrentUser() user: RequestUser, @Body() dto: RegisterCompanyDto) {
    return this.companiesService.register(user.id, dto);
  }

  @Get('me')
  myCompany(@CurrentUser() user: RequestUser) {
    return this.companiesService.myCompany(user.id);
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.update(user.id, id, dto);
  }

  @Get(':id/members')
  listMembers(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.companiesService.listMembers(user.id, id);
  }

  @Post(':id/members')
  inviteMember(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: InviteMemberDto) {
    return this.companiesService.inviteMember(user.id, id, dto);
  }

  @Delete(':id/members/:memberUserId')
  removeMember(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('memberUserId') memberUserId: string,
  ) {
    return this.companiesService.removeMember(user.id, id, memberUserId);
  }
}
