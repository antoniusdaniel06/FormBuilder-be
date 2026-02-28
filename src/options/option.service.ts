import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async add(questionId: string, data: any) {
    return this.prisma.option.create({
      data: {
        label: data.label || "Option",
        question: {
          connect: { id: questionId }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.option.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.option.delete({
      where: { id }
    });
  }
}