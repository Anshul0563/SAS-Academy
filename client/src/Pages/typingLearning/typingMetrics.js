export const formatTime = (seconds = 0) => {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const remaining = String(Math.floor(value % 60)).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

export const calculateTypingStats = ({
  source = "",
  typed = "",
  elapsedSeconds = 1,
}) => {
  const elapsedMinutes = Math.max(1, Number(elapsedSeconds) || 1) / 60;
  const sourceChars = Array.from(source);
  const typedChars = Array.from(typed);
  let correctCharacters = 0;
  const mistakeSamples = [];
  const weakKeyMap = new Map();

  typedChars.forEach((char, index) => {
    const expected = sourceChars[index] || "";

    if (expected === char) {
      correctCharacters += 1;
      return;
    }

    if (mistakeSamples.length < 20) {
      mistakeSamples.push({ expected, typed: char, index });
    }

    const key = expected || char;
    if (key && key !== " ") {
      weakKeyMap.set(key, (weakKeyMap.get(key) || 0) + 1);
    }
  });

  const omissions = Math.max(0, sourceChars.length - typedChars.length);
  const errors = mistakeSamples.length + omissions;
  const typedCharacters = typedChars.length;
  const rawWPM = typedCharacters / 5 / elapsedMinutes;
  const wpm = correctCharacters / 5 / elapsedMinutes;
  const accuracyBase = Math.max(1, typedCharacters, sourceChars.length);
  const accuracy = Math.max(
    0,
    Math.min(100, (correctCharacters / accuracyBase) * 100),
  );

  return {
    typedCharacters,
    totalCharacters: sourceChars.length,
    correctCharacters,
    errors,
    accuracy,
    wpm,
    rawWPM,
    mistakeSamples,
    weakKeys: Array.from(weakKeyMap.entries())
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
  };
};

export const getCharacterState = (expected, typed) => {
  if (typed === undefined) return "pending";
  if (expected === typed) return "correct";
  return "wrong";
};
