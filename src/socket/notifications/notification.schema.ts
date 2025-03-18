import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Notification {
    id: String!
    title: String
    content: String
    url: String
    isRead: Boolean!
    userId: String!
    createdAt: String!
    user: User
  }

  type Query {
    notifications: [Notification]
    notification(id: String!): Notification
  }

  type Mutation {
    createNotification(title: String, content: String, url: String, userId: String!): Notification
    updateNotification(id: String!, title: String, content: String, url: String, isRead: Boolean): Notification
    deleteNotification(id: String!): Notification
  }
`;