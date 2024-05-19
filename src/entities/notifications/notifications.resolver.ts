import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";

@Resolver('Notification') 
export class NotificationsResolver {
    constructor(private notificationsService: NotificationsService) {}

    @Query()
    @UseGuards(GqlAuthGuard)
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
