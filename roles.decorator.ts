import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types/auth.types';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // --- Public (candidate-facing) -----------------------------------------

  @Public()
  @Get()
  search(@Query() query: SearchJobsDto) {
    return this.jobsService.search(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  // --- Employer-facing -----------------------------------------------------

  @Roles(Role.EMPLOYER)
  @Get('company/:companyId')
  findForCompany(@CurrentUser() user: RequestUser, @Param('companyId') companyId: string) {
    return this.jobsService.findForCompany(user.id, companyId);
  }

  @Roles(Role.EMPLOYER)
  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateJobDto) {
    return this.jobsService.create(user.id, dto);
  }

  @Roles(Role.EMPLOYER)
  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(user.id, id, dto);
  }

  @Roles(Role.EMPLOYER)
  @Post(':id/publish')
  publish(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.jobsService.publish(user.id, id);
  }

  @Roles(Role.EMPLOYER)
  @Post(':id/close')
  close(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.jobsService.close(user.id, id);
  }

  @Roles(Role.EMPLOYER)
  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.jobsService.remove(user.id, id);
  }
}
