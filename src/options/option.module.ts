import { Module } from "@nestjs/common";
import { OptionController } from "./option.controller";
import { OptionService } from "./option.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports:[
        PrismaModule,
        AuthModule
    ],
    controllers: [OptionController],
    providers: [OptionService],
    exports:[OptionService],
})
export class OptionModule {}