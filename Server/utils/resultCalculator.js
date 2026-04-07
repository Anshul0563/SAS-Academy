function normalize(text) {
    return text
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[.,!?]/g, "");
}

function calculateResult(originalText, typedText, timeTaken) {
    const original = normalize(originalText).split(" ");
    const typed = normalize(typedText).split(" ");

    let errors = 0;
    let omissions = 0;
    let additions = 0;
    let spelling = 0;

    const maxLength = Math.max(original.length, typed.length);

    for (let i = 0; i < maxLength; i++) {
        const o = original[i];
        const t = typed[i];

        if (!o && t) {
            additions++;
            errors++;
        } else if (o && !t) {
            omissions++;
            errors++;
        } else if (o !== t) {
            spelling++;
            errors++;
        }
    }

    const wordsTyped = typed.length;
    const minutes = timeTaken / 60;
    const wpm = wordsTyped / minutes;

    const accuracy = ((original.length - errors) / original.length) * 100;

    return {
        wpm: Math.round(wpm),
        accuracy: Math.max(0, accuracy.toFixed(2)),
        errors,
        omissions,
        additions,
        spelling
    };
}

module.exports = calculateResult;