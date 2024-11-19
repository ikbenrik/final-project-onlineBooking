import prisma from '../../prisma/client.js';

export const deleteUser = async (userId) => {
  try {
    console.log(`Attempting to delete user with ID: ${userId}`);
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    console.log("User deleted successfully:", deletedUser);
    return deletedUser;
  } catch (error) {
    if (error.code === 'P2025') {
      console.error("No user found with the given ID:", userId);
      return null; // Return null if the user doesn't exist
    }
    console.error("Error during user deletion:", error);
    throw error;
  }
};
