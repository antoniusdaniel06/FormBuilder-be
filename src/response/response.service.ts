import {
  Injectable,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ResponseService {
  constructor(private prisma: PrismaService) {}

  //Submit response
  async submit(
    formId: string,
    userId: string,
    answers: any[]
  ) {
    // Ambil form
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      throw new ForbiddenException("Form not found");
    }

    // Cek apakah form masih menerima response
    if (!form.published || !form.accResponse) {
      throw new ForbiddenException(
        "This form is not accepting responses"
      );
    }

    // Cek onlyOnce
    if (form.onlyOnce) {
      const existing = await this.prisma.response.findFirst({
        where: {
          formId,
          userId,
        },
      });

      if (existing) {
        throw new ForbiddenException(
          "You can only submit this form once"
        );
      }
    }

    // 4️⃣ Create response
    return this.prisma.response.create({
      data: {
        form: { connect: { id: formId } },
        user: { connect: { id: userId } },
        answers: {
          create: answers.map((a) => ({
            questionId: a.questionId,
            textValue: a.textValue || null,
            selectedOptionId: a.selectedOptionId || null,
            selectedOptions: a.selectedOptionIds
              ? {
                  connect: a.selectedOptionIds.map(
                    (id: string) => ({ id })
                  ),
                }
              : undefined,
          })),
        },
      },
    });
  }

  // Get all responses (for summary tab)
  async getResponses(formId: string) {
    return this.prisma.response.findMany({
      where: { formId },
      include: {
        user: true, 
        answers: {
          include: {
            selectedOption: true,
            selectedOptions: true,
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get summary per question
  async getSummary(formId: string) {
    return this.prisma.question.findMany({
      where: {
        section: {
          formId,
        },
      },
      include: {
        answers: true,
        options: {
          include: {
            answers: true,
            checkboxAnswers: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
  }
  async checkSubmitted(formId: string , userId: string){
    const exist = await this.prisma.response.findFirst({
      where: {
        formId,userId
      }
    });
    return {submitted: !!exist};
  }
}