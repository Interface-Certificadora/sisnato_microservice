import { Global, Module } from '@nestjs/common';
import { SequelizeService } from './sequelize.service';
import { Fcweb } from './models/fcweb.model';

@Global()
@Module({
  providers: [SequelizeService],
  exports: [SequelizeService, Fcweb],
})
export class SequelizeModule {}
