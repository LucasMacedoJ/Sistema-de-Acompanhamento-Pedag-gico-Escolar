const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; // Altere se necessário
const dbName = "sistema_acompanhamento";

let db;

module.exports = {
    connectToMongoDB: function(callback) {
        MongoClient.connect(url, { useUnifiedTopology: true })
            .then(client => {
                db = client.db(dbName);
                console.log("Conectado ao MongoDB!");
                callback();
            })
            .catch(err => {
                console.error("Erro ao conectar ao MongoDB:", err);
                callback(err);
            });
    },
    getDb: function() {
        return db;
    }
};