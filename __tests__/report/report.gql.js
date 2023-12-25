module.exports = {
    REPORT_CREATE_MUTATION: (input) => ({
        query: `mutation reportCreate($input: CreateReportInput!) {
            reportCreate(input: $input) {
                _id
                email
            }
        }`,
        variables: {
            input,
        }
    }),
    REPORT_QUERY: (id) => ({
        query: `query report($_id: ID!) {
            report(_id: $_id) {
                _id
            }
        }`,
        variables: {
            _id: id
        }
    }),
    REPORTS_QUERY: (offset, limit) => ({
        query: `query reports($offset: Int!, $limit: Int!) {
            reports(offset: $offset, limit: $limit) {
                _id
            }
        }`,
        variables: {
            offset, limit,
        }
    }),
    REPORT_CLOSE_MUTATION: (id) => ({
        query: `mutation reportClose($_id: ID!) {
            reportClose(_id: $_id) {
                _id
                isClosed
            }
        }`,
        variables: {
            _id: id,
        }
    })
}