import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AdminBlogService } from './admin-blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequestUser } from '../../auth/types/auth.types';

@Controller('admin/blog')
@Roles(Role.ADMIN)
export class AdminBlogController {
  constructor(private readonly adminBlogService: AdminBlogService) {}

  @Get()
  list() {
    return this.adminBlogService.list();
  }

  @Post()
  create(@CurrentUser() admin: RequestUser, @Body() dto: CreateBlogPostDto) {
    return this.adminBlogService.create(admin.id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.adminBlogService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminBlogService.remove(id);
  }
}
