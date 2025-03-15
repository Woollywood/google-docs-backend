import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [CaslModule, UsersModule, PrismaModule],
	providers: [OrganizationsService],
	controllers: [OrganizationsController],
})
export class OrganizationsModule {}
