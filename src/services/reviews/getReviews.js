import prisma from '../../prisma/client.js';

export const getReviews = async (filters) => {
  try {
    const whereClause = {};

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.propertyId) {
      whereClause.propertyId = filters.propertyId;
    }

    // Fetch reviews with filters applied
    const reviews = await prisma.review.findMany({
      where: whereClause,
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
