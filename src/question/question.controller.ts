import {
  Controller,
  Post,
  Param,
  Patch,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post(':sectionId')
  create(
    @Param('sectionId') sectionId: string,
    @Req() req
  ) {
    return this.questionService.create(
      sectionId,
      req.user.id   
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() body: any
  ) {
    return this.questionService.update(
      id,
      req.user.id,
      body
    );
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Req() req
  ) {
    return this.questionService.delete(
      id,
      req.user.id
    );
  }
}