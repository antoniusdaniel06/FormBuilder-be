import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FormService {
  constructor(private prisma: PrismaService) {}

  //function untuk membuat form
  async create(userId: string) {
  return this.prisma.form.create({
    data: {
      title: "Untitled Form", //default title
      onlyOnce : false,
      user: {
        connect: { id: userId }, //form connect dengan user yang sedang login pada saat create
      },
      // default section
      sections: {
        create: {
          order: 1,
          questions: {
            create: {
              order: 1,
              title: "Untitled Question",
              type: "MULTIPLE_CHOICE",
              options: {
                create: {
                  label: "Option 1",
                },
              },
            },
          },
        },
      },
    },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
}
async publish(formId: string, userId: string) {
  const form = await this.prisma.form.findFirst({
    where: {
      id: formId,
      userId: userId,
    },
  });

  if (!form) {
    throw new ForbiddenException("Form not found or not yours");
  }

  return this.prisma.form.update({
    where: { id: formId },
    data: {
      published: true,
      accResponse: true, // kalau kamu pakai flag ini
    },
  });
}
  // function untuk mengambil semua form yang sudah di publish
  async getAllPublished() {
  return this.prisma.form.findMany({
    where: {
      published: true,
      accResponse: true,
    },
    include: {
      user: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
  // function untuk mengambil semua form yang masih draft
 async getAllDraftForm(userId: string){
  return this.prisma.form.findMany({
    where: {
      userId,
      published: false
    },
    select: {
      id: true,
      title: true,
      description: true,
      updatedAt: true,
      createdAt: true
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
}
  // function untuk mengambil semua form yang dimiliki oleh user tertentu
  async findAll(userId: string) {
  return this.prisma.form.findMany({
    where: { userId },
    include: {
      user: true, 
      sections: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: { options: true }
          }
        }
      }
    }
  });
}
  //function untuk mencari form berdasarkan id form
  async findOne(id: string, userId: string) {
  const form = await this.prisma.form.findFirst({
    where: {
  AND: [
    { id },
    { userId },
    {
      OR: [
        { published: false },
        {
          AND: [
            { published: true },
            { accResponse: true },
          ],
        },
      ],
    },
  ],
},
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            include: { options: true },
          },
        },
      },
    },
  });

  if (!form) {
    throw new ForbiddenException(
      "Form cannot be edited (already closed or not found)"
    );
  }

  return form;
}
  // function untuk update form
  async update(id: string, userId: string, data: any) {
  const form = await this.prisma.form.findFirst({
    where: { id, userId },
  });
  if (!form) {
    throw new ForbiddenException("Form not found or not yours");
  }
  return this.prisma.form.update({
    where: { id },
    data,
  });
}
  // function delete form
  async deleteForm(id: string, userId: string) {
  const form = await this.prisma.form.findUnique({
    where: { id },
  });
  if (!form) {
    throw new ForbiddenException("Form tidak ditemukan");
  }
  if (form.userId !== userId) {
    throw new ForbiddenException("Anda tidak memiliki akses ");
  }
  return this.prisma.form.delete({
    where: { id },
  });
}

async updateImage(formId: string, userId: string, imageUrl: string) {
  return this.prisma.form.update({
    where: {
      id: formId,
      userId: userId,
    },
    data: {
      imageUrl,
    },
  });
}
 async findPublicForm(id: string) {
  const form = await this.prisma.form.findFirst({
    where: {
      id,
      published: true,
      accResponse: true,
    },
    include: {
      user: true,
      sections: {
        orderBy: { order: 'asc' }, 
        include: {
          questions: {
            orderBy: { order: 'asc' }, 
            include: {
              options: {
                orderBy: { id: 'asc' }, 
              },
            },
          },
        },
      },
    },
  });

  if (!form) throw new ForbiddenException("Form not available");

  return form;
}
}