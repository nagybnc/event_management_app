import { gql } from "@apollo/client";

export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      status
      location
      startDate
      endDate
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
    updateEvent(id: $id, input: $input) {
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

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id)
  }
`;

export const ADD_PARTICIPANT = gql`
  mutation AddParticipant($input: AddParticipantInput!) {
    addParticipant(input: $input) {
      id
      email
    }
  }
`;

export const REMOVE_PARTICIPANT = gql`
  mutation RemoveParticipant($id: ID!) {
    removeParticipant(id: $id)
  }
`;
