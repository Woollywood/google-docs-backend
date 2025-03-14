import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [CaslAbilityFactory],
	exports: [CaslAbilityFactory],
})
export class CaslModule {}
