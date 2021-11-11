const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Location {
    _id: ID
    name: String
  }

  type Shifts {
    _id: ID
    name: String
    description: String
    image: String
    quantity: Int
    rate: Float
    location: Location
  }

  type Shift {
    _id: ID
    purchaseDate: String       find a new name for Order other then shift
    Shiftss: [Shifts]
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    shift: [Shift]
  }

  type Add {
    session: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    categories: [Location]
    shifts(category: ID, name: String): [Shifts]
    shifts(_id: ID!): Shifts
    user: User
    shift(_id: ID!): Shift
    add(shifts: [ID]!): Add
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    addShift(shifts: [ID]!): Shift
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateShifts(_id: ID!, quantity: Int!): Shifts
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
