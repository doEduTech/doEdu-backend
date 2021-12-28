import { Global, Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [AuthModule, UsersModule],
  exports: [AuthModule, UsersModule]
})
export class CoreModule {}
