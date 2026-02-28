import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}
  //function untuk membuat question
  async create(sectionId: string, userId: string) {
  // cari section dulu, kalau sedang tidak ada section tidak bisa menambahkan question
  const section = await this.prisma.section.findFirst({
    where: {
      id: sectionId,
      form: { userId }
    }
  });
  if (!section) throw new ForbiddenException();
  // kalau ada section , ambil question terakhir pada section tersebut 
  const last = await this.prisma.question.findFirst({
    where: { sectionId },
    orderBy: { order: 'desc' }
  });
  // memabuat question dengan order ditambah 1 dari order question terakhir jika ada
  return this.prisma.question.create({
    data: {
      sectionId,
      order: last ? last.order + 1 : 1,
      options: {
        create: { label: "Option 1" }
      }
    }
  });
}
  // function untuk mengupdate form
  async update(id: string, userId: string, data: any) {
  const question = await this.prisma.question.findFirst({
    where: {
      id,
      section: {
        form: {
          userId
        }
      }
    }
  });
  if (!question) {
    throw new ForbiddenException("Anda tidak memiliki akses");
  }
  return this.prisma.question.update({
    where: { id },
    data
  });
}
  // function untuk delete form
  async delete(id: string, userId: string) {
  const question = await this.prisma.question.findFirst({
    where: {
      id,
      section: {
        form: {
          userId
        }
      }
    }
  });
  if (!question) {
    throw new ForbiddenException("Anda tidak memiliki akses");
  }
  return this.prisma.question.delete({
    where: { id }
  });
}
}