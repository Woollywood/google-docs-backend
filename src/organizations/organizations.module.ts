import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organizations.entity';
import { OrganizationsController } from './organizations.controller';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Organization]), CaslModule, UsersModule],
	providers: [OrganizationsService],
	controllers: [OrganizationsController],
})
export class OrganizationsModule {}
