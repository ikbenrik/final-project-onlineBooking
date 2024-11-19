import prisma from '../../prisma/client.js';

export const updateUser = async (userId, updatedData) => {
  try {
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return null; // Return null if the user does not exist
    }

    // Update the user if it exists
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Re-throw to be caught in the route
  }
};
