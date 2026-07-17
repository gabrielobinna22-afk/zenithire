import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class AdminBlogService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(authorId: string, dto: CreateBlogPostDto) {
    try {
      return await this.prisma.blogPost.create({ data: { ...dto, authorId } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('A post with this slug already exists');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const { publish, ...rest } = dto;
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(publish === true && !post.publishedAt && { publishedAt: new Date() }),
        ...(publish === false && { publishedAt: null }),
      },
    });
  }

  async remove(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return this.prisma.blogPost.delete({ where: { id } });
  }
}
