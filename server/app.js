const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("../schema/schema");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://nikita_dvortsov:AA1286AE@graphqlmoviescluster-oeqi4.mongodb.net/GraphQLLearning?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

const app = express();
const PORT = process.env.PORT || 3005;

const dbConnection = mongoose.connection;

dbConnection.on("error", (err) => console.log(err));
dbConnection.once("open", () => console.log("Connected to database!"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log(`Server is started on port ${PORT}...`);
});
