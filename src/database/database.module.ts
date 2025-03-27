import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/jkproject'),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
