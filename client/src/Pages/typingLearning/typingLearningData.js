export const passages = {
  english: [
    {
      title: "SSC office note",
      level: "SSC",
      text: "The candidate should type with steady rhythm and complete the passage within the given time. Accuracy is more important than raw speed in official typing tests.",
    },
    {
      title: "Accuracy drill",
      level: "Accuracy",
      text: "Public service requires careful records, clear notices, correct dates, and exact punctuation. A small typing mistake can change the meaning of a sentence.",
    },
    {
      title: "Speed builder",
      level: "Speed",
      text: "Practice daily with a calm mind. Keep your fingers close to the home row and build speed through consistency, not force.",
    },
  ],
  hindi: [
    {
      title: "Hindi practice",
      level: "Hindi",
      text: "सरकारी परीक्षा में गति और शुद्धता दोनों महत्वपूर्ण हैं। नियमित अभ्यास से टाइपिंग में आत्मविश्वास और नियंत्रण बढ़ता है।",
    },
    {
      title: "Hindi accuracy",
      level: "Hindi",
      text: "कृपया प्रत्येक शब्द ध्यान से टाइप करें। मात्रा, विराम चिन्ह और रिक्त स्थान की गलती परिणाम को प्रभावित कर सकती है।",
    },
  ],
};

export const modeConfig = {
  practice: {
    label: "Typing Practice",
    duration: 120,
    backspaceDisabled: false,
  },
  ssc: {
    label: "SSC Simulation",
    duration: 600,
    backspaceDisabled: true,
  },
  accuracy: {
    label: "Accuracy Training",
    duration: 180,
    backspaceDisabled: true,
  },
  speed: {
    label: "Speed Training",
    duration: 60,
    backspaceDisabled: false,
  },
  challenge: {
    label: "Daily Challenge",
    duration: 90,
    backspaceDisabled: true,
  },
};

export const fingerLessons = [
  {
    zone: "Left little",
    keys: "Q A Z",
    note: "Keep the wrist relaxed and return to A.",
  },
  {
    zone: "Left ring",
    keys: "W S X",
    note: "Press with a short, vertical motion.",
  },
  {
    zone: "Left middle",
    keys: "E D C",
    note: "Use D as the home anchor.",
  },
  {
    zone: "Index fingers",
    keys: "R T F G V B Y U H J N M",
    note: "Index fingers carry the center keys.",
  },
  {
    zone: "Right middle",
    keys: "I K ,",
    note: "Return to K after punctuation.",
  },
  {
    zone: "Right ring/little",
    keys: "O P L ; . /",
    note: "Control symbols without lifting the palm.",
  },
];

export const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
];
