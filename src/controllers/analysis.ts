import axios from "axios";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Analysis, setErrorStatus } from "../models/Analysis";
import logger from "../util/logger";
import { SRA_DOWNLOAD_ENDPOINT } from "../util/env";

/**
 * GET /analysis
 * Contact form page.
 */
export const getanalysis = (req: Request, res: Response) => {
    Analysis.find().sort({startTime: "desc"}).exec((err, analyses) => {
        if(err) {
            logger.error(err);
            res.sendStatus(500);
            return;
        }
        res.render("analysis", {
            title: "Analyses",
            analyses,
        });
    });
};

/**
 * POST /analysis
 * Send a contact form via Nodemailer.
 */
export const postAnalysis = async (req: Request, res: Response) => {
    await check("sra", "SRA Run ID cannot be blank").not().isEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.sendStatus(400);
    }

    const sraId = req.body.sra;
    const analysis = new Analysis({
        sraId,
        startTime: new Date(),
        status: "PENDING",
    });
    analysis.save((err, doc) => {
        if (err) {
            logger.error(err);
            return res.sendStatus(500);
        }
        const data = {
            id: doc._id,
            sraId,
        };
        axios.post(SRA_DOWNLOAD_ENDPOINT, data).catch(err => {
            logger.error(err);
            setErrorStatus(analysis);
        }).finally(() => {
            res.redirect("/analysis");
        });
    });
};
