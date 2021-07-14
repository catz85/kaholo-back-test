const express = require('express');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { ApolloServer, PubSub } = require('apollo-server-express');
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeSchemas } = require("graphql-tools");
const config = require('./config')
//loading schemas
const types = loadFilesSync(path.join(__dirname, './schema'));
//loading resolvers
const resolversArray = loadFilesSync(path.join(__dirname, './resolvers'))
//merging schemas
const typeDefs = mergeTypeDefs(types);
//merging resolvers
const resolvers = mergeResolvers(resolversArray);
const sequelize = require('./dbmodels');


const app = express();

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return {
            sequelize
        }
    }
});
apolloServer.applyMiddleware({ app });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

sequelize.sync({ force: config.db.remove }).then(() => {
    console.log('WE HERE!!');
    httpServer.listen(config.app.port, () => {
        console.log(`🚀 Server ready at http://localhost:${config.app.port}${apolloServer.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${config.app.port}${apolloServer.subscriptionsPath}`)
    });
})

module.exports = app;
