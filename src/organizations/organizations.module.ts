import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrganizationsAbilityFactory } from './organizations-ability.factory';

@Module({
	imports: [UsersModule, PrismaModule, NotificationsModule],
	providers: [OrganizationsService, OrganizationsAbilityFactory],
	controllers: [OrganizationsController],
})
export class OrganizationsModule {}
