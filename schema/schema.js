const graphql = require("graphql");
const Director = require("../models/director");
const Movie = require("../models/movie");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
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

//Схема
const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLString },
    director: {
      type: DirectorType,
      resolve: (parent, args) => {
        // return directors.find((director) => parent.directorId == director.id);
        return Director.findById(parent.directorId);
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
        // return movies.filter((movie) => movie.directorId == parent.id);
        return Movie.find({ directorId: parent.id });
      },
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addDirector: {
      type: DirectorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const director = new Director({
          name: args.name,
          age: args.age,
        });
        return director.save();
      },
    },
    addMovie: {
      type: MovieType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        const movie = new Movie({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId,
        });
        return movie.save();
      },
    },
    deleteDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Director.findByIdAndDelete(args.id);
      },
    },
    deleteMovie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Movie.findByIdAndDelete(args.id);
      },
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return Director.findByIdAndUpdate(
          args.id,
          {
            name: args.name,
            age: args.age,
          },
          { new: true }
        );
      },
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        directorId: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return Movie.findByIdAndUpdate(
          args.id,
          { name: args.name, genre: args.genre, directroId: args.directorId },
          { new: true }
        );
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
        // return movies.find((movie) => movie.id == args.id);
        return Movie.findById(args.id);
      },
    },
    director: {
      type: DirectorType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        // return directors.find((director) => director.id == args.id);
        return Director.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (parent, args) => {
        // return movies;
        return Movie.find({});
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve: (parent, args) => {
        // return directors;
        return Director.find({});
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
