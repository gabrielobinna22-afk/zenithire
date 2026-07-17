import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CompanyAccessService } from '../common/company-access.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, CompanyAccessService],
  exports: [JobsService],
})
export class JobsModule {}
