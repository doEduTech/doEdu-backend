import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { TeacherModule } from './pages/teacher/teacher.module';
import { MarketModule } from './pages/market/market/market.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true // shouldn't be used in production - may lose data
    }),
    AuthModule,
    UsersModule,
    BlockchainModule,
    TeacherModule,
    MarketModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
