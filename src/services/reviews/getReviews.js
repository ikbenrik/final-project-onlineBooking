import prisma from '../../prisma/client.js';

export const getReviews = async () => {
  try {
    const reviews = await prisma.review.findMany();

    return reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error.message || error);
    throw error;
  }
};
