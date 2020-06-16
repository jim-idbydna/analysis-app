import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Analysis } from "../models/Analysis";

/**
 * GET /analyses
 * Contact form page.
 */
export const getAnalyses = (req: Request, res: Response) => {
    Analysis.find((err, docs) => {
        if(err) {
            res.send(500);
            return;
        }
        const analyses = docs.map(({sraId, startTime, completeTime}) => ({sraId, startTime, completeTime}));
        res.render("analyses", {
            title: "Analyses",
            analyses,
        });
    });
};

/**
 * POST /analyses
 * Send a contact form via Nodemailer.
 */
export const postAnalysis = async (req: Request, res: Response) => {
    await check("sra", "SRA Run ID cannot be blank").not().isEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("errors", errors.array());
        return res.send(400);
    }

    const sraId = req.body.sra;
    const analysis = new Analysis({
        sraId,
        startTime: new Date(),
    });
    analysis.save((err) => {
        if (err) {
            res.send(500);
        }
        res.redirect("/analyses");
    });
};
