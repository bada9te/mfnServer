module.exports = {
    NOTIFICATIONS_QUERY: (receiverId, checked) => ({
        query: `query notifications($receiverId: ID!, $checked: Boolean!) {
            notifications(receiverId: $receiverId, checked: $checked) {
                _id
            }
        }`,
        variables: {
            checked, receiverId
        }
    }),
    NOTIFICATIONS_BY_IDS_QUERY: (ids) => ({
        query: `query notificationsByIds($ids: [ID!]!) {
            notificationsByIds(ids: $ids) {
                _id
            }
        }`,
        variables: {
            ids
        }
    }),

    NOTIFICATION_CREATE_MUTATION: (input) => ({
        query: `mutation notificationCreate($input: CreateNotificationInput!) {
            notificationCreate(input: $input) {
                _id
                sender {
                    _id
                }
                receiver {
                    _id
                }
                text
            }
        }`,
        variables: {
            input
        }
    }),
    NOTIFICATION_DELETE_BY_ID: (id) => ({
        query: `mutation notificationDeleteById($_id: ID!) {
            notificationDeleteById(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id
        }
    }),
    NOTIFICATIONS_DELETE_BY_IDS: (ids) => ({
        query: `mutation notificationsDeleteByIds($ids: [ID!]!) {
            notificationsDeleteByIds(ids: $ids) {
                count
            }
        }`,
        variables: {
            ids
        }
    }),
    NOTIFICATION_MARK_AS_READ_BY_ID: (id) => ({
        query: `mutation notificationMarkAsReadById($_id: ID!) {
            notificationMarkAsReadById(_id: $_id) {
                _id
                checked
            }
        }`,
        variables: {
            _id: id
        }
    }),
    NOTIFICATIONS_MARK_AS_READ_BY_IDS: (ids) => ({
        query: `mutation notificationsMarkAsReadByIds($ids: [ID!]!) {
            notificationsMarkAsReadByIds(ids: $ids) {
                count
            }
        }`,
        variables: {
            ids
        }
    }),
}