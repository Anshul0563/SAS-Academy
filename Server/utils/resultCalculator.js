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

function removeSymbols(text = "") {
    return String(text).replace(/[^\w\s]|_/g, "");
}

function getMistakeType(expected = "", typed = "") {
    if (
        expected &&
        typed &&
        expected !== typed &&
        removeSymbols(expected) === removeSymbols(typed)
    ) {
        return "symbol";
    }

    return "spelling";
}

function buildAlignment(originalWords, typedWords) {
    const rows = originalWords.length;
    const cols = typedWords.length;
    const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            if (originalWords[i - 1] === typedWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const anchors = [];
    let i = rows;
    let j = cols;

    while (i > 0 && j > 0) {
        if (originalWords[i - 1] === typedWords[j - 1]) {
            anchors.unshift({ originalIndex: i - 1, typedIndex: j - 1 });
            i--;
            j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    const comparison = [];

    const appendGap = (originalStart, originalEnd, typedStart, typedEnd) => {
        const originalGap = originalWords.slice(originalStart, originalEnd);
        const typedGap = typedWords.slice(typedStart, typedEnd);
        const pairedLength = Math.min(originalGap.length, typedGap.length);

        for (let index = 0; index < pairedLength; index++) {
            comparison.push({
                expected: originalGap[index],
                typed: typedGap[index],
                word: typedGap[index],
                type: getMistakeType(originalGap[index], typedGap[index])
            });
        }

        for (let index = pairedLength; index < originalGap.length; index++) {
            comparison.push({
                expected: originalGap[index],
                typed: "",
                word: originalGap[index],
                type: "omission"
            });
        }

        for (let index = pairedLength; index < typedGap.length; index++) {
            comparison.push({
                expected: "",
                typed: typedGap[index],
                word: typedGap[index],
                type: "addition"
            });
        }
    };

    let originalCursor = 0;
    let typedCursor = 0;

    anchors.forEach((anchor) => {
        appendGap(
            originalCursor,
            anchor.originalIndex,
            typedCursor,
            anchor.typedIndex
        );

        comparison.push({
            expected: originalWords[anchor.originalIndex],
            typed: typedWords[anchor.typedIndex],
            word: typedWords[anchor.typedIndex],
            type: "correct"
        });

        originalCursor = anchor.originalIndex + 1;
        typedCursor = anchor.typedIndex + 1;
    });

    appendGap(originalCursor, rows, typedCursor, cols);

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
    const symbols = comparison.filter((item) => item.type === "symbol").length;
    const errors = omissions + additions + spelling + symbols;
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
        spelling * 5 + symbols * 5 + omissions * 5 + additions * 5
    );

    const grossWPM = (typedCharacters / 5) / minutes;
    const netWPM = (correctCharacters / 5) / minutes;
    const accuracyBase = correctWords + errors || originalWordCount;
    const accuracy = Math.max(0, Math.min(100, (correctWords / accuracyBase) * 100));

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
        symbols,
        capitalization: 0,
        comparison
    };
}

module.exports = calculateResult;
