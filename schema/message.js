const { gql } = require('apollo-server-express');
module.exports = gql`
type Message {
    id: Int
    text: String!
    command: String!
    error: String
  }
type Mutation {
    createMessage(text: String!): Message!
}
type Subscription {
  messages: Message!
}
type Query {
  messages: [Message!]
}
`;