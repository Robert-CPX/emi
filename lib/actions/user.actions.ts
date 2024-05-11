'use server'

import UserDocument from '@/database/models/user.model';
import { connectToDatabase } from '@/database/mongoose';
import { handleError } from '../utils';
import { CreateUserParams, DeleteUserParams, GetUserByIdParams, UpdateUserParams } from './shared';
import { revalidatePath } from 'next/cache';

// CREATE
export const createUser = async (params: CreateUserParams) => {
  try {
    await connectToDatabase();
    const newUser = await UserDocument.create(params);
    return newUser;
  } catch (error) {
    handleError(error);
  }
};

// UPDATE
export const updateUser = async (params: UpdateUserParams) => {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = params;
    const updatedUser = await UserDocument.findOneAndUpdate(
      { clerkId },
      updateData,
      { new: true }
    );
    revalidatePath(path);
    return updatedUser;
  } catch (error) {
    handleError(error);
  }
};

// DELETE
export const deleteUser = async (params: DeleteUserParams) => {
  try {
    await connectToDatabase();
    const { clerkId } = params;
    const deletedUser = await UserDocument.findOneAndDelete({ clerkId });
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (error) {
    handleError(error);
  }
};

// Get mongo user info by clerk Id
export const getMongoUserByClerkId = async (params: GetUserByIdParams) => {
  try {
    await connectToDatabase()
    const user = await UserDocument.findOne({ clerkId: params.userId })
    return user
  } catch (error) {
    handleError(error);
  }
}