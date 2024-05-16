import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto";

@Resolver('Notification') 
export class NotificationsResolver {
    constructor(private notificationsService: NotificationsService) {}

    @Query()
    async notifications(
        @Args('receiverId') receiverId: string,
        @Args('checked') checked: boolean
    ) {
        if (checked) {
            return await this.notificationsService.getAllReadNotifications(receiverId);
        } else {
            return await this.notificationsService.getAllUnreadNotifications(receiverId);
        }
    }

    @Query()
    async notificationsByIds(@Args('ids') ids: string[]) {
        return await this.notificationsService.getAllNotificationsByIds(ids);
    }

    @Mutation()
    async notificationCreate(@Args('input') dto: CreateNotificationDto) {
        return await this.notificationsService.createNotification(dto);
    }

    @Mutation()
    async notificationDeleteById(@Args('_id') _id: string) {
        return await this.notificationsService.deleteNotificationById(_id);
    }

    @Mutation()
    async notificationsDeleteByIds(@Args('ids') ids: string[]) {
        const data = await this.notificationsService.deleteNotificationsByIds(ids);
        return { count: data.deletedCount };
    }

    @Mutation()
    async notificationMarkAsReadById(@Args('_id') _id: string) {
        return await this.notificationsService.markNotificationAsRead(_id);
    }

    @Mutation()
    async notificationsMarkAsReadByIds(@Args('ids') ids: string[]) {
        const data = await this.notificationsService.markNotificationsAsRead(ids);
        return { count: data.modifiedCount }
    }
}
