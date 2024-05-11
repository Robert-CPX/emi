import { Schema, model, models, Document } from 'mongoose'

export type Interaction = {
  clerkUserId: string;
  action: string;
  question: string;
  time: string;
  mode: string;
  createdAt: Date;
} | Document

const InteractionSchema = new Schema({
  clerkUserId: { type: String, required: true },
  action: { type: String, required: true },
  question: { type: String },
  time: { type: String },
  mode: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const InteractionModel = models.Interaction || model('Interaction', InteractionSchema)

export default InteractionModel
