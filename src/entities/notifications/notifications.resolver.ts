import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto";
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";

@Resolver('Notification') 
export class NotificationsResolver {
    constructor(private notificationsService: NotificationsService) {}

    @Query()
    
    async notifications(
        @Args('receiverId') receiverId: string,
        @Args('checked') checked: boolean,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number
    ) {
        if (checked) {
            return {
                notifications: await this.notificationsService.getAllReadNotifications(receiverId, offset, limit),
                count: await this.notificationsService.getDocsCount({receiverId, checked})
            }
        } else {
            return {
                notifications: await this.notificationsService.getAllUnreadNotifications(receiverId, offset, limit),
                count: await this.notificationsService.getDocsCount({receiverId, checked: false})
            }
        }
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async notificationsByIds(@Args('ids') ids: string[]) {
        return await this.notificationsService.getAllNotificationsByIds(ids);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async notificationCreate(@Args('input') dto: CreateNotificationDto) {
        return await this.notificationsService.createNotification(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async notificationDeleteById(@Args('_id') _id: string) {
        return await this.notificationsService.deleteNotificationById(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async notificationsDeleteByIds(@Args('ids') ids: string[]) {
        const data = await this.notificationsService.deleteNotificationsByIds(ids);
        return { count: data.deletedCount };
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async notificationMarkAsReadById(@Args('_id') _id: string) {
        return await this.notificationsService.markNotificationAsRead(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async notificationsMarkAsReadByIds(@Args('ids') ids: string[]) {
        const data = await this.notificationsService.markNotificationsAsRead(ids);
        return { count: data.modifiedCount }
    }
}
