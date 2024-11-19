import prisma from '../../prisma/client.js';

export const updateReview = async (reviewId, updatedData) => {
  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return null; // Return null if the review doesn't exist
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updatedData,
    });

    return updatedReview;
  } catch (error) {
    console.error("Error updating review:", error.message || error);
    throw error;
  }
};
