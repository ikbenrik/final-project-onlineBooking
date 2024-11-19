import prisma from '../../prisma/client.js';

export const createReview = async (reviewData) => {
  try {
    // Validate required fields
    const { userId, propertyId, rating, comment } = reviewData;
    if (!userId || !propertyId || typeof rating !== 'number' || !comment) {
      throw new Error('Missing or invalid required fields: userId, propertyId, rating, or comment');
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating,
        comment,
      },
    });

    return newReview;
  } catch (error) {
    console.error("Error creating review:", error.message || error);
    if (error.message.includes('Missing or invalid required fields')) {
      throw { statusCode: 400, message: error.message }; // Throw error with status code 400 for missing fields
    }
    throw error;
  }
};
