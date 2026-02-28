import { Module } from "@nestjs/common";
import { ResponseService } from "./response.service";
import { ResponseController } from "./response.controller";
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports:[
        PrismaModule,
        AuthModule,
    ],
    controllers: [ResponseController],
    providers : [ ResponseService],
    exports: [ResponseService],
})
export class ResponseModule {}