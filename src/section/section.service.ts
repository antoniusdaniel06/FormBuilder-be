  import {
    Injectable,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';

  @Injectable()
  export class SectionService {
    constructor(private prisma: PrismaService) {}
    
    // function membuat section
    async create(formId: string, userId: string) {
      //  Cek apakah form tersebut punya user itu atau tidak
      const form = await this.prisma.form.findFirst({
        where: {
          id: formId,
          userId,
        },
      });
      if (!form) {
        throw new ForbiddenException('Anda tidak memiliki akses');
      }

      // mengambil section terakhir
      const lastSection = await this.prisma.section.findFirst({
        where: { formId },
        orderBy: { order: 'desc' },
      });
      return this.prisma.section.create({
        data: {
          formId,
          order: lastSection ? lastSection.order + 1 : 1,
        },
      });
    }
    // delete section
    async delete(sectionId: string, userId: string) {
      const section = await this.prisma.section.findFirst({
        where: {
          id: sectionId,
          form: {
            userId,
          },
        },
      });
      if (!section) {
        throw new ForbiddenException('Anda tidak memiliki akses');
      }
      return this.prisma.section.delete({
        where: { id: sectionId },
      });
    }
  }