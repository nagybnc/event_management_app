import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      status
      location
      startDate
      endDate
      participants {
        id
        email
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      title
      status
      location
      startDate
      endDate
      participants {
        id
        email
      }
      createdAt
      updatedAt
    }
  }
`;
