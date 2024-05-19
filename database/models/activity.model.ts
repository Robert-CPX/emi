import { Schema, model, models, Document } from 'mongoose'

export type Activity = {
  type: string;
  value: number;
  createdAt: Date;
  creator: Schema.Types.ObjectId;
  goalId: Schema.Types.ObjectId;
} | Document;

const ActivitySchema = new Schema<Activity>({
  type: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true }
});

const ActivityModel = models.Activity || model<Activity>('Activity', ActivitySchema);

export default ActivityModel;