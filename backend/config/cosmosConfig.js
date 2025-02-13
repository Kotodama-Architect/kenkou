const { CosmosClient } = require('@azure/cosmos');

const client = new CosmosClient({ endpoint: process.env.COSMOSDB_ENDPOINT, key: process.env.COSMOSDB_KEY });

module.exports = {
    tweetsContainer: client.database("brain").container("tweets"),
    usersContainer: client.database("brain").container("users")
};