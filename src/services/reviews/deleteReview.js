import prisma from '../../prisma/client.js';

export const deleteReview = async (reviewId) => {
  try {
    const existingReview = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!existingReview) {
      return false; // Return false if review doesn't exist
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return true;
  } catch (error) {
    console.error("Error deleting review:", error.message || error);
    throw error;
  }
};
