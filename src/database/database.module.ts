import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//import dotenv from 'dotenv';

//dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot( 'mongodb://localhost:27017/jkproject'),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
