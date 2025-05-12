const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;
const moviesCollection = process.env.MONGODB_COLLECTION_NAME;
const commentsCollection = process.env.MONGODB_COMMENTS_COLLECTION;

exports.handler = async (event) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const movieId = event.queryStringParameters?.id;
    if (!movieId) return { statusCode: 400, body: 'Missing movie ID' };

    const movie = await db.collection(moviesCollection).findOne({ _id: new ObjectId(movieId) });
    const comments = await db.collection(commentsCollection)
      .find({ movie_id: new ObjectId(movieId) })
      .sort({ date: -1 }).limit(10).toArray();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ movie, comments })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
};
