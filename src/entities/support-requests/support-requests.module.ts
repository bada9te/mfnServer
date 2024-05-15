import { Module } from '@nestjs/common';
import { SupportRequestsService } from './support-requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestSchema } from './support-requests.schema';
import { SupportRequestsResolver } from './support-requests.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SupportRequest.name, schema: SupportRequestSchema }])
  ],
  providers: [SupportRequestsService, SupportRequestsResolver]
})
export class SupportRequestsModule {}
