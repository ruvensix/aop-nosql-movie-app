const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const collectionName = process.env.MONGODB_COLLECTION_NAME;

exports.handler = async (event) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const search = event.queryStringParameters?.search || '';
    const query = search ? {
      title: { $regex: search, $options: 'i' }
    } : {};

    const movies = await collection.find(query)
      .project({ title: 1, year: 1, poster: 1 })
      .limit(20)
      .toArray();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(movies)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
};
