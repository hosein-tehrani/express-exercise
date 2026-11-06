///////////////////////////////////////////////////////////////////////////////////////
////// connectig this way to refuse multiconnecting and observing singleton rule //////
///////////////////////////////////////////////////////////////////////////////////////

const { MongoClient } = require("mongodb");

module.exports = class connectToMongoDB {
  #DB_URL = "mongodb://localhost:27017/mongodb-tutorial";
  #db = null;
  async #connect() {
    try {
      let client = new MongoClient(this.#DB_URL);
      this.#db = await client.db();
      return this.#db;
    } catch (error) {
      console.log(error.message);
    }
  }
  async Get() {
    try {
      if (this.#db) {
        console.log("db connection already exists!");
        return this.#db;
      } else {
        this.#db = await this.#connect();
        return this.#db;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};
