function normalize(text = "", options = {}) {
    let value = String(text)
        .replace(/\r\n/g, "\n")
        .replace(/\s+/g, " ")
        .trim();

    if (options.ignoreCase) {
        value = value.toLowerCase();
    }

    if (options.ignorePunctuation) {
        value = value.replace(/[^\w\s]|_/g, "");
    }

    return value;
}

function tokenize(text = "", options = {}) {
    const normalized = normalize(text, options);
    return normalized ? normalized.split(" ") : [];
}

function buildAlignment(originalWords, typedWords) {
    const rows = originalWords.length;
    const cols = typedWords.length;
    const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));

    for (let i = 0; i <= rows; i++) dp[i][0] = i;
    for (let j = 0; j <= cols; j++) dp[0][j] = j;

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            const substitutionCost = originalWords[i - 1] === typedWords[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + substitutionCost
            );
        }
    }

    const comparison = [];
    let i = rows;
    let j = cols;

    while (i > 0 || j > 0) {
        if (
            i > 0 &&
            j > 0 &&
            dp[i][j] === dp[i - 1][j - 1] + (originalWords[i - 1] === typedWords[j - 1] ? 0 : 1)
        ) {
            comparison.unshift({
                expected: originalWords[i - 1],
                typed: typedWords[j - 1],
                word: typedWords[j - 1],
                type: originalWords[i - 1] === typedWords[j - 1] ? "correct" : "spelling"
            });
            i--;
            j--;
        } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            comparison.unshift({
                expected: originalWords[i - 1],
                typed: "",
                word: originalWords[i - 1],
                type: "omission"
            });
            i--;
        } else {
            comparison.unshift({
                expected: "",
                typed: typedWords[j - 1],
                word: typedWords[j - 1],
                type: "addition"
            });
            j--;
        }
    }

    return comparison;
}

function round(value, decimals = 2) {
    return Number(Number(value || 0).toFixed(decimals));
}

function countWordStrokes(words = []) {
    if (!words.length) return 0;
    return words.reduce((total, word) => total + String(word || "").length, 0) + words.length - 1;
}

function calculateResult(originalText, typedText, timeTaken = 1, options = {}) {
    const seconds = Math.max(1, Number(timeTaken) || 1);
    const minutes = seconds / 60;
    const originalWords = tokenize(originalText, options);
    const typedWords = tokenize(typedText, options);
    const comparison = buildAlignment(originalWords, typedWords);

    const correctWords = comparison.filter((item) => item.type === "correct").length;
    const omissions = comparison.filter((item) => item.type === "omission").length;
    const additions = comparison.filter((item) => item.type === "addition").length;
    const spelling = comparison.filter((item) => item.type === "spelling").length;
    const errors = omissions + additions + spelling;
    const originalWordCount = originalWords.length || 1;
    const typedCharacters = normalize(typedText, options).length;
    const expectedCharacters = normalize(originalText, options).length;
    const correctCharacters = countWordStrokes(
        comparison
            .filter((item) => item.type === "correct")
            .map((item) => item.typed || item.word)
    );
    const errorPenaltyCharacters = Math.min(
        typedCharacters,
        spelling * 5 + omissions * 5 + additions * 5
    );

    const grossWPM = (typedCharacters / 5) / minutes;
    const netWPM = (correctCharacters / 5) / minutes;
    const accuracy = Math.max(0, ((originalWordCount - errors) / originalWordCount) * 100);

    return {
        grossWPM: round(grossWPM),
        netWPM: round(netWPM),
        wpm: Math.round(netWPM),
        accuracy: round(accuracy),
        totalWords: originalWords.length,
        typedWords: typedWords.length,
        correctWords,
        errors,
        errorsDetails: errors,
        typedCharacters,
        expectedCharacters,
        correctCharacters,
        errorPenaltyCharacters,
        omissions,
        additions,
        spelling,
        capitalization: 0,
        comparison
    };
}

module.exports = calculateResult;
