const express = require("express");
const schema = require("../schema/schema");
const graphqlHTTP = require("express-graphql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, (err) => {
  err ? console.log(err) : console.log("Server is started...");
});

// const express = require("express");
// const graphqlHTTP = require("express-graphql");
// const PORT = process.env.PORT || 3000;
// const schema = require("../schema/schema");

// const app = express();

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

// app.listen(PORT, (err) => {
//   err ? console.log(err) : console.log("Server started...");
// });
