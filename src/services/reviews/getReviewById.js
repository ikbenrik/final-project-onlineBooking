import prisma from '../../prisma/client.js';

export const getReviewById = async (reviewId) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    return review || null; // Return null if review is not found
  } catch (error) {
    console.error("Error fetching review by ID:", error.message || error);
    throw error;
  }
};
