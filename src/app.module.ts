import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FormModule } from './forms/form.module';
import { QuestionModule } from './question/question.module';
import { SectionModule } from './section/section.module';
import { OptionModule } from './options/option.module';
import { ResponseModule } from './response/response.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FormModule,
    QuestionModule,
    SectionModule,  
    OptionModule,
    ResponseModule,
  ],
})
export class AppModule {}