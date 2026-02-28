import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sections')
export class SectionController {
  constructor(private sectionService: SectionService) {}

  /*
   POST /sections/:formId
   */
  @Post(':formId')
  create(
    @Param('formId') formId: string,
    @Req() req,
  ) {
    return this.sectionService.create(
      formId,
      req.user.id,
    );
  }

  /*
   DELETE /sections/:sectionId
   */
  @Delete(':sectionId')
  delete(
    @Param('sectionId') sectionId: string,
    @Req() req,
  ) {
    return this.sectionService.delete(
      sectionId,
      req.user.id,
    );
  }
}