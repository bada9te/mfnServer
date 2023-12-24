const data = require("../testData");

module.exports = {
    SUPPORT_REQUEST_QUERY: (id) => ({
        query: `query supportRequest($_id: ID!) {
            supportRequest(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),

    SUPPORT_REQUESTS_QUERY: (offset, limit) => ({
        query: `query supportRequests($offset: Int!, $limit: Int!) {
            supportRequests(offset: $offset, limit: $limit) {
                _id
            }
        }`,
        variables: {
            offset,
            limit,
        }
    }),

    SUPPORT_REQUEST_CREATE_MUTATION: (input) => ({
        query: `mutation supportRequestCreate($input: CreateSupportRequestInput!) {
            supportRequestCreate(input: $input) {
                _id
            }
        }`,
        variables: {
            input,
        }
    }),

    SUPPORT_REQUEST_CLOSE_MUTATION: (id) => ({
        query: `mutation supportRequestClose($_id: ID!) {
            supportRequestClose(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id,
        }
    }),
};