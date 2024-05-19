import { Schema, model, models, Document } from 'mongoose'

export enum ActivityStatus {
  Pending = 'PENDING',
  Completed = "COMPLETED",
  Cancelled = "CANCELLED"
}

export type Activity = {
  type: string;
  value: number;
  createdAt: Date;
  status: ActivityStatus;
  creator: Schema.Types.ObjectId;
  goalId: Schema.Types.ObjectId;
} | Document;

const ActivitySchema = new Schema<Activity>({
  type: { type: String, required: true },
  value: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: ActivityStatus.Pending },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal', required: true }
});

const ActivityModel = models.Activity || model<Activity>('Activity', ActivitySchema);

export default ActivityModel;