const Test = require("../models/test");
const Result = require("../models/result");
const calculateResult = require("../utils/resultCalculator");

exports.submitTest = async (req, res) => {
    try {
        const { testId, typedText, timeTaken } = req.body;

        // original text fetch
        const test = await Test.findById(testId);

        const resultData = calculateResult(
            test.passage,
            typedText,
            timeTaken
        );

        // save result
        const result = await Result.create({
            userId: req.user.id,
            testId,
            typedText,
            originalText: test.passage,
            ...resultData,
            timeTaken
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ error });
    }
};