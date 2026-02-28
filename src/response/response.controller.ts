import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ResponseService } from "./response.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("responses")
export class ResponseController {
  constructor(private service: ResponseService) {}

  // Submit (butuh login)
  @UseGuards(JwtAuthGuard)
  @Post(":formId")
  submit(
    @Param("formId") formId: string,
    @Req() req,
    @Body() body: { answers: any[] }
  ) {
    return this.service.submit(
      formId,
      req.user.id, 
      body.answers
    );
  }

  @Get(":formId")
  getResponses(@Param("formId") formId: string) {
    return this.service.getResponses(formId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":formId/check")
  checkIfSubmitted(@Param("formId") formId: string,@Req() req) {
    return this.service.checkSubmitted(
      formId,
      req.user.id
  );
}

  @Get(":formId/summary")
  getSummary(@Param("formId") formId: string) {
    return this.service.getSummary(formId);
  }
}