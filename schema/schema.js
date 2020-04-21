const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

/*
// All IDs set automatically by mLab
// Don't forget to update after creation
const directorsJson = [
  { "name": "Quentin Tarantino", "age": 55 }, //5e9ec2181c9d440000b54753
  { "name": "Michael Radford", "age": 72 }, // 5e9ec26f1c9d440000b54754
  { "name": "James McTeigue", "age": 51 }, // 5e9ec29e1c9d440000b54755
  { "name": "Guy Ritchie", "age": 50 }, // 5e9ec2ba1c9d440000b54756
];
// directorId - it is ID from the directors collection
const moviesJson = [
  { "name": "Pulp Fiction", "genre": "Crime", "directorId": "5e9ec2181c9d440000b54753" },
  { "name": "1984", "genre": "Sci-Fi", "directorId": "5e9ec26f1c9d440000b54754" },
  { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5e9ec29e1c9d440000b54755" },
  { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5e9ec2ba1c9d440000b54756" },
  { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "5e9ec2181c9d440000b54753" },
  { "name": "The Hateful Eight", "genre": "Crime", "directorId": "5e9ec2181c9d440000b54753" },
  { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "5e9ec2181c9d440000b54753" },
  { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "5e9ec2ba1c9d440000b54756" },
];
const movies = [
  { id: '1', name: "Pulp Fiction", genre: "Crime", directorId: "1" },
  { id: '2', name: "1984", genre: "Sci-Fi", directorId: "2" },
  { id: '3', name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
  { id: '4', name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
  { id: '5', name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
  { id: '6', name: "The Hateful Eight", genre: "Crime", directorId: "1" },
  { id: '7', name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
  { id: '8', name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "4" },
];
const directors = [
	{ id: '1', name: "Quentin Tarantino", age: 55 },
  { id: '2', name: "Michael Radford", age: 72 },
  { id: '3', name: "James McTeigue", age: 51 },
  { id: '4', name: "Guy Ritchie", age: 50 },
];
*/

const movies = [
  { id: 1, name: "Irish man", genre: "action", directorId: 11 },
  { id: "2", name: "Gentelmen", genre: "fiction", directorId: 13 },
  { id: "4", name: "Garry Potter", genre: "fantasy", directorId: 12 },
  { id: "5", name: "Agents", genre: "fantasy", directorId: 11 },
  { id: "6", name: "Guys", genre: "fantasy", directorId: 11 },
  { id: 7, name: "Avengers", genre: "fantasy", directorId: 13 },
];

const directors = [
  { id: 11, name: "Guy Richy", age: 51 },
  { id: 12, name: "Stewen Spilberg", age: 43 },
  { id: 13, name: "Silvester Stallone", age: 72 },
];

//Схема
const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve: (parent, args) => {
        return directors.find((director) => parent.directorId == director.id);
      },
    },
  }),
});

const DirectorType = new GraphQLObjectType({
  name: "Director",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (parent, args) => {
        return movies.filter((movie) => movie.directorId == parent.id);
      },
    },
  }),
});

//Корневой запрос
const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    //movie - один из подзапросов
    movie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return movies.find((movie) => movie.id == args.id);
      },
    },
    director: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return directors.find((director) => director.id == args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (parent, args) => {
        return movies;
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve: (parent, args) => {
        return directors;
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: Query,
});

// const graphql = require("graphql");

// const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

// const MovieType = new GraphQLObjectType({
//   name: "movie",
//   fields: () => ({
//     id: { type: GraphQLString },
//     name: { type: GraphQLString },
//     genre: { type: GraphQLString },
//   }),
// });

// const Query = new GraphQLObjectType({
//   name: "Query",
//   fields: () => ({
//     movie: {
//       type: MovieType,
//       args: {
//         id: { type: GraphQLString },
//       },
//       resolve: (parent, args) => {},
//     },
//   }),
// });

// module.exports = new GraphQLSchema({
//   query: Query,
// });
