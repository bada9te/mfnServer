import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{ 
      name: User.name, 
      useFactory: () => {
        const schema = UserSchema;
        schema.plugin(require('mongoose-autopopulate'));
        return schema;
      }
    }])
  ],
  providers: [UsersService]
})
export class UsersModule {}
