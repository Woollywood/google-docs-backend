import { Module } from '@nestjs/common';
import { LiveblocksService } from './liveblocks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LiveblocksController } from './liveblocks.controller';
import { LiveblocksAbilityFactory } from './liveblocks-ability.factory';

@Module({
	imports: [PrismaModule],
	controllers: [LiveblocksController],
	providers: [LiveblocksService, LiveblocksAbilityFactory],
	exports: [LiveblocksService],
})
export class LiveblocksModule {}
