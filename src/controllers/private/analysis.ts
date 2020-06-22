import axios from "axios";
import { Request, Response } from "express";
import { Analysis, setErrorStatus } from "../../models/Analysis";
import { FASTQ_ANALYSIS_ENDPOINT } from "../../util/env";
import logger from "../../util/logger";

/**
 * POST /analysis
 * Send a contact form via Nodemailer.
 */
export const postAnalysis = async (req: Request, res: Response) => {
    if (!req.body.id || !req.body.message) {
        res.sendStatus(400);
        return;
    }
    Analysis.findOne({_id: req.body.id}, (err, analysis) => {
        if (err) {
            res.sendStatus(404);
            return;
        }
        
        if (req.body.message == "fastq") {
            if (! req.body.dataLocation) {
                res.sendStatus(400);
                setErrorStatus(analysis);
                return;
            }
            analysis.dataLocation = req.body.dataLocation;
            analysis.save((err) => {
                if (err) {
                    logger.error(err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(201);

                const data = {
                    id: analysis.id,
                    dataLocation: analysis.dataLocation,
                };
                axios.post(FASTQ_ANALYSIS_ENDPOINT, data).catch((err) => {
                    logger.error(err);
                    analysis.status = "ERROR";
                    analysis.save((err) => {
                        logger.error(err);
                    });
                });
            });

        } else if (req.body.message == "results") {
            if (! req.body.results) {
                res.sendStatus(400);
                setErrorStatus(analysis);
                return;
            }
            analysis.results = req.body.results;
            analysis.completeTime = new Date();
            analysis.status = "DONE";
            analysis.save((err) => {
                if (err) {
                    logger.error(err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(201);
            });
        } else if (req.body.message == "error") {
            setErrorStatus(analysis);
            res.sendStatus(201);
        } else {
            res.sendStatus(400);
        }
    });
};
