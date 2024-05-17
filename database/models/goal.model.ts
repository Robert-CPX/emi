import { Schema, model, models, Document } from 'mongoose'

export enum GoalStatus {
  ToDo = 'TO_DO',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
  Archived = 'ARCHIVED',
}

export type Goal = {
  title: string;
  description: string;
  icing: string;
  duration: number;
  activities: Schema.Types.ObjectId[];
  isLongTerm: boolean;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
  creator: Schema.Types.ObjectId;
} | Document;

const GoalSchema = new Schema<Goal>({
  title: { type: String, required: true },
  description: { type: String },
  icing: { type: String },
  duration: { type: Number, required: true, default: 0 },
  activities: [{ type: Schema.Types.ObjectId, ref: 'Activity', default: [] }],
  isLongTerm: { type: Boolean, required: true, default: false },
  status: { type: String, required: true, default: GoalStatus.ToDo },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const GoalModel = models.Goal || model<Goal>('Goal', GoalSchema);

export default GoalModel;