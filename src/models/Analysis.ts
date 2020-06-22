import mongoose from "mongoose";
import logger from "../util/logger";

export type AnalysisDocument = mongoose.Document & {
    sraId: string;
    startTime: Date;
    completeTime: Date;
    results: {
        total_reads: number;
        total_bases: number;
        q20_bases: number;
        q30_bases: number;
        q20_rate: number;
        q30_rate: number;
        read1_mean_length: number;
        gc_content: number;
    };
    dataLocation: string;
    status: "PENDING" | "DONE" | "ERROR";
};

const analysisSchema = new mongoose.Schema({
    sraId: String,
    startTime: Date,
    completeTime: Date,
    dataLocation: String,
    results: Object,
    status: {
        type: String,
        enum: ["PENDING", "DONE", "ERROR"]
    },
}, { timestamps: true });

export const Analysis = mongoose.model<AnalysisDocument>("Analysis", analysisSchema);

export function setErrorStatus(analysis: AnalysisDocument) {
    analysis.status = "ERROR";
    analysis.save((err) => {
        if(err) {
            logger.error(err);
        }
    });
}
