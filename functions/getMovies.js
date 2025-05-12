const { MongoClient } = require('mongodb');
require('dotenv').config();

// Connection parameters [cite: 81, 82, 83]
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'sample_mflix';
const collectionName = process.env.MONGODB_COLLECTION_NAME || 'movies';

// Headers [cite: 84]
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=60'
};

exports.handler = async (event) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);

    // Search query [cite: 87, 88, 89, 90]
    const search = event.queryStringParameters?.search || '';
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { cast: { $regex: search, $options: 'i' } },
          { directors: { $regex: search, $options: 'i' } },
          { genres: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Query MongoDB [cite: 91, 92, 93, 94, 95]
    const movies = await db.collection(collectionName)
      .find(query)
      .project({ title: 1, year: 1, poster: 1, imdb: 1 })
      .sort({ year: -1 })
      .limit(32)
      .toArray();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(movies)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.close();
  }
};