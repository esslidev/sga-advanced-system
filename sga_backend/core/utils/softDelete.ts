import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Performs soft delete on the specified Prisma model.
 * 
 * @param modelName - The name of the Prisma model to perform soft deletes on.
 */
export const performSoftDeletes = async (modelName: keyof typeof prisma) => {
  try {
    const currentDate = new Date();

    // Use the model name to dynamically access the Prisma model with type assertion
    const model = prisma[modelName] as any; // Type assertion to any to access deleteMany
    const deletedRecords = await model.deleteMany({
      where: {
        deletedAt: {
          lte: currentDate,
        },
      },
    });

    console.log(`Soft deleted ${deletedRecords.count} records from ${modelName.toString()}.`);
  } catch (error) {
    console.error('Error during soft delete operation:', error);
  }
};
