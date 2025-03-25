import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@Schema()
export class User {

 _id?: string; 

 @Prop({ required: true, unique: true }) // Ensure email is required and unique
 email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole,  }) // Default role is 'viewer'
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
