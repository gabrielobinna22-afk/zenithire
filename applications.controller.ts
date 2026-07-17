import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CandidatesService } from './candidates.service';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateWorkExperienceDto, UpdateWorkExperienceDto } from './dto/work-experience.dto';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';
import { SetIndustriesDto, SetSkillsDto } from './dto/taxonomy-selection.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RequestUser } from '../auth/types/auth.types';

@Controller('candidates/me')
@Roles(Role.CANDIDATE)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateCandidateProfileDto) {
    return this.candidatesService.createProfile(user.id, dto);
  }

  @Get()
  me(@CurrentUser() user: RequestUser) {
    return this.candidatesService.me(user.id);
  }

  @Patch()
  update(@CurrentUser() user: RequestUser, @Body() dto: UpdateCandidateProfileDto) {
    return this.candidatesService.update(user.id, dto);
  }

  // --- Education ---

  @Post('education')
  addEducation(@CurrentUser() user: RequestUser, @Body() dto: CreateEducationDto) {
    return this.candidatesService.addEducation(user.id, dto);
  }

  @Patch('education/:id')
  updateEducation(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateEducationDto) {
    return this.candidatesService.updateEducation(user.id, id, dto);
  }

  @Delete('education/:id')
  removeEducation(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.candidatesService.removeEducation(user.id, id);
  }

  // --- Work experience ---

  @Post('experience')
  addExperience(@CurrentUser() user: RequestUser, @Body() dto: CreateWorkExperienceDto) {
    return this.candidatesService.addExperience(user.id, dto);
  }

  @Patch('experience/:id')
  updateExperience(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateWorkExperienceDto) {
    return this.candidatesService.updateExperience(user.id, id, dto);
  }

  @Delete('experience/:id')
  removeExperience(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.candidatesService.removeExperience(user.id, id);
  }

  // --- Certifications ---

  @Post('certifications')
  addCertification(@CurrentUser() user: RequestUser, @Body() dto: CreateCertificationDto) {
    return this.candidatesService.addCertification(user.id, dto);
  }

  @Patch('certifications/:id')
  updateCertification(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.candidatesService.updateCertification(user.id, id, dto);
  }

  @Delete('certifications/:id')
  removeCertification(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.candidatesService.removeCertification(user.id, id);
  }

  // --- Skills / Industries (full replace) ---

  @Put('skills')
  setSkills(@CurrentUser() user: RequestUser, @Body() dto: SetSkillsDto) {
    return this.candidatesService.setSkills(user.id, dto);
  }

  @Put('industries')
  setIndustries(@CurrentUser() user: RequestUser, @Body() dto: SetIndustriesDto) {
    return this.candidatesService.setIndustries(user.id, dto);
  }
}
