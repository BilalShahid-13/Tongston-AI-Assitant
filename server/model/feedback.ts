import mongoose, { Schema } from "mongoose";
import { IFeedbackDocument, IFileMeta } from "../types";

const FileMetaSchema = new Schema<IFileMeta>(
  {
    filename: { type: String, required: true },
    url: { type: String },
    mimetype: { type: String },
    size: { type: Number },
  },
  { _id: false }
);

const FeedbackSchema = new Schema<IFeedbackDocument>(
  {
    // Step 1
    subject: { type: String, required: true, trim: true },
    yearClassLevel: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    followUp: { type: Boolean, default: false },
    email: { type: String, trim: true, lowercase: true, sparse: true, index: true },

    // Step 2
    sectionReferringTo: { type: String, required: true },
    otherSectionDetail: { type: String },

    // Step 3
    feedbackCategory: {
      type: String,
      enum: ["positive", "issue", "suggestion"],
      required: true,
    },
    positiveMessage: { type: String },

    // Issue specific
    issueDescription: { type: String },
    issueScreenshot: { type: [FileMetaSchema], default: [] },
    problemOccurredAt: { type: String },
    otherProblemOccurredAtDetail: { type: String },
    issueCheckboxes: { type: [String], default: [] },
    issueDetails: { type: String },

    // Suggestion specific
    suggestionType: { type: String },
    otherSuggestionTypeDetail: { type: String },
    suggestionMessage: { type: String },
    suggestionAppearance: { type: String },
    suggestionScreenshot: { type: [FileMetaSchema], default: [] },

    inspirationUrl: { type: String, trim: true },


    // optional metadata
    meta: {
      ip: { type: String },
      userAgent: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
FeedbackSchema.index({ email: 1 });
FeedbackSchema.index({ feedbackCategory: 1, createdAt: -1 });

const FeedbackModel = mongoose.model<IFeedbackDocument>("Feedback", FeedbackSchema);

export default FeedbackModel;
