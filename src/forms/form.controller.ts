import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { FormService } from "./form.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("forms")
export class FormController {
  constructor(private service: FormService) {}

  @Get(":id/public")
  findPublic(@Param("id") id: string) {
    return this.service.findPublicForm(id);
  }

  // PROTECTED ENDPOINTS
  @UseGuards(JwtAuthGuard)
  @Get("draft")
  getDraft(@Req() req) {
    return this.service.getAllDraftForm(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("published")
  getPublished() {
    return this.service.getAllPublished();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req) {
    return this.service.create(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: string, @Req() req) {
    return this.service.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Req() req, @Body() body: any) {
    return this.service.update(id, req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/publish")
  publish(@Param("id") id: string, @Req() req) {
    return this.service.publish(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  deleteForm(@Param("id") id: string, @Req() req) {
    return this.service.deleteForm(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/upload-image")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    })
  )

  async uploadImage(
    @Param("id") formId: string,
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    const form = await this.service.findOne(formId, req.user.id);
    if (!form) {
      throw new ForbiddenException("Form not found or not yours");
    }
    const imageUrl = `/uploads/${file.filename}`;
    await this.service.updateImage(formId, req.user.id, imageUrl);

    return { imageUrl };
  }
}