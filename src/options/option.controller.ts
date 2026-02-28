import { Controller, Post, Patch, Delete, Param, Body } from "@nestjs/common";
import { OptionService } from "./option.service";

@Controller("options")
export class OptionController {
  constructor(private service: OptionService) {}

  @Post(":questionId")
  add(
    @Param("questionId") questionId: string,
    @Body() body: any
  ) {
    return this.service.add(questionId, body);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}