import { Module } from '@nestjs/common';
import { AdminDashboardModule } from './dashboard/admin-dashboard.module';
import { AdminCompaniesModule } from './companies/admin-companies.module';
import { AdminUsersModule } from './users/admin-users.module';
import { AdminJobsModule } from './jobs/admin-jobs.module';
import { AdminReportsModule } from './reports/admin-reports.module';
import { AdminCategoriesModule } from './categories/admin-categories.module';
import { AdminBlogModule } from './blog/admin-blog.module';
import { AdminAdsModule } from './ads/admin-ads.module';
import { AdminSettingsModule } from './settings/admin-settings.module';

// One import in AppModule pulls in the entire admin surface. Video
// moderation (GET /videos/admin/pending, approve/reject) already lives in
// the videos module from that earlier piece — not duplicated here.
@Module({
  imports: [
    AdminDashboardModule,
    AdminCompaniesModule,
    AdminUsersModule,
    AdminJobsModule,
    AdminReportsModule,
    AdminCategoriesModule,
    AdminBlogModule,
    AdminAdsModule,
    AdminSettingsModule,
  ],
})
export class AdminModule {}
