const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Connection parameters [cite: 96, 97, 98, 99, 100]
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'sample_mflix';
const moviesCollectionName = process.env.MONGODB_COLLECTION_NAME || 'movies';
const commentsCollectionName = process.env.MONGODB_COMMENTS_COLLECTION || 'comments';

// Headers [cite: 100]
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300'
};

exports.handler = async (event) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);

    // Get movie ID [cite: 103, 104, 105, 106, 107, 108, 109]
    const movieId = event.queryStringParameters?.id;
    if (!movieId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Movie ID required' })
      };
    }

    // Create ObjectId for querying
    const objectId = new ObjectId(movieId);

    // Query for the movie
    const movie = await db.collection(moviesCollectionName)
      .findOne({ _id: objectId });

    if (!movie) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Movie not found' })
      };
    }

    // Query for comments related to this movie [cite: 110, 111, 112, 113, 114]
    const comments = await db.collection(commentsCollectionName)
      .find({ movie_id: objectId })
      .sort({ date: -1 })
      .limit(10)
      .toArray();

    // Return both movie and its comments
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ movie, comments })
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