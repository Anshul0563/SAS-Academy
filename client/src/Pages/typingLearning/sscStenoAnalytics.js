export const formatSeconds = (seconds = 0) => {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const remaining = String(Math.floor(value % 60)).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

const tokenize = (text = "") => text.trim().split(/\s+/).filter(Boolean);

export const calculateStenoStats = ({ source = "", typed = "", elapsedSeconds = 1 }) => {
  const sourceChars = Array.from(source);
  const typedChars = Array.from(typed);
  const sourceWords = tokenize(source);
  const typedWords = tokenize(typed);
  const minutes = Math.max(1, Number(elapsedSeconds) || 1) / 60;

  let correctCharacters = 0;
  const keyMap = new Map();
  const mistakeSamples = [];

  typedChars.forEach((char, index) => {
    const expected = sourceChars[index] || "";
    if (char === expected) {
      correctCharacters += 1;
      return;
    }

    if (mistakeSamples.length < 24) {
      mistakeSamples.push({ expected, typed: char, index });
    }

    const key = expected || char;
    if (key && key !== " ") {
      keyMap.set(key.toUpperCase(), (keyMap.get(key.toUpperCase()) || 0) + 1);
    }
  });

  const wrongWords = [];
  sourceWords.forEach((word, index) => {
    if (typedWords[index] !== undefined && typedWords[index] !== word) {
      wrongWords.push({
        expected: word,
        typed: typedWords[index],
        index,
      });
    }
  });

  const omissionErrors = Math.max(0, sourceChars.length - typedChars.length);
  const mistakes = mistakeSamples.length + omissionErrors;
  const grossWPM = typedChars.length / 5 / minutes;
  const netWPM = Math.max(0, (typedChars.length / 5 - mistakes) / minutes);
  const accuracyBase = Math.max(1, typedChars.length, sourceChars.length);
  const accuracy = Math.max(0, Math.min(100, (correctCharacters / accuracyBase) * 100));
  const progress = Math.min(100, (typedChars.length / Math.max(1, sourceChars.length)) * 100);

  const chunks = [];
  const chunkSize = Math.max(80, Math.floor(sourceChars.length / 8));
  for (let start = 0; start < sourceChars.length; start += chunkSize) {
    const end = Math.min(sourceChars.length, start + chunkSize);
    const typedSlice = typedChars.slice(start, end);
    let correct = 0;
    typedSlice.forEach((char, offset) => {
      if (char === sourceChars[start + offset]) correct += 1;
    });
    chunks.push({
      label: `${Math.floor(start / chunkSize) + 1}`,
      accuracy: typedSlice.length ? (correct / typedSlice.length) * 100 : 0,
      typed: typedSlice.length,
    });
  }

  const weakKeys = Array.from(keyMap.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    grossWPM,
    netWPM,
    accuracy,
    mistakes,
    wrongWords: wrongWords.slice(0, 18),
    weakKeys,
    mistakeSamples,
    progress,
    consistency: chunks,
    typedCharacters: typedChars.length,
    totalCharacters: sourceChars.length,
  };
};

export const buildStenoSuggestions = ({ stats, elapsedSeconds, paragraph }) => {
  const suggestions = [];
  const minutes = Math.floor((elapsedSeconds || 0) / 60);
  const lastChunks = stats.consistency.slice(-3).filter((chunk) => chunk.typed > 0);
  const earlyChunks = stats.consistency.slice(0, 3).filter((chunk) => chunk.typed > 0);
  const lateAverage = lastChunks.length
    ? lastChunks.reduce((sum, chunk) => sum + chunk.accuracy, 0) / lastChunks.length
    : 0;
  const earlyAverage = earlyChunks.length
    ? earlyChunks.reduce((sum, chunk) => sum + chunk.accuracy, 0) / earlyChunks.length
    : 0;

  if (minutes >= 5 && lateAverage + 4 < earlyAverage) {
    suggestions.push("Your accuracy drops after five minutes. Practice one longer paragraph at a controlled pace before increasing speed.");
  }

  if (stats.weakKeys.length) {
    suggestions.push(
      `Weak keys detected: ${stats.weakKeys
        .slice(0, 4)
        .map((item) => item.key)
        .join(", ")}. Practice top-row and home-row correction drills.`,
    );
  }

  if (stats.accuracy < paragraph.accuracyGoal) {
    suggestions.push(`Target accuracy is ${paragraph.accuracyGoal}%. Repeat this passage once with backspace disabled and reduce correction dependency.`);
  }

  if (stats.netWPM >= paragraph.targetWPM && stats.accuracy >= paragraph.accuracyGoal) {
    suggestions.push("You are ready for the next difficulty level. Choose an advanced parliamentary or court proceeding passage.");
  } else if (stats.netWPM < paragraph.targetWPM) {
    suggestions.push(`Net speed is below the ${paragraph.targetWPM} WPM target. Build rhythm with two 3-minute speed intervals.`);
  }

  if (!suggestions.length) {
    suggestions.push("Performance is balanced. Continue with weekly SSC simulation to build stamina.");
  }

  return suggestions;
};
