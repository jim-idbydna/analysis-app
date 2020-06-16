import mongoose from "mongoose";

export type AnalysisDocument = mongoose.Document & {
    sraId: string;
    startTime: Date;
    completeTime: Date;
};

const analysisSchema = new mongoose.Schema({
    sraId: String,
    startTime: Date,
    completeTime: Date,
}, { timestamps: true });

export const Analysis = mongoose.model<AnalysisDocument>("Analysis", analysisSchema);
