// Survey questions. Each question drives one QuestionPage screen.
// TOTAL_QUESTIONS is shown in the progress bar ("N Total"); more questions
// will be added here as their Figma screens are provided.

export const TOTAL_QUESTIONS = 10

// A celebration interstitial ("Halfway there!") is shown after this entry.
export const HALFWAY_STEP = Math.floor(TOTAL_QUESTIONS / 2)

export const questions = [
  {
    id: 1,
    type: 'single',
    question: 'Which method do you use most often to access your MoMo account?',
    options: [
      { key: 'A', label: 'USSD (*170#)' },
      { key: 'B', label: 'MoMo App' },
      { key: 'C', label: 'Both equally' },
      { key: 'D', label: "I use someone else's phone or app when needed" },
    ],
  },
  {
    id: 2,
    type: 'single',
    question: 'Have you ever downloaded the MoMo App?',
    options: [
      { key: 'A', label: 'Yes, and I use it regularly' },
      { key: 'B', label: 'Yes, but I rarely use it' },
      { key: 'C', label: 'Yes, but I deleted it' },
      { key: 'D', label: 'No' },
    ],
  },
  {
    id: 3,
    type: 'single',
    question: 'If the MoMo App could improve ONE thing, what should it be?',
    options: [
      { key: 'A', label: 'Speed' },
      { key: 'B', label: 'Security' },
      { key: 'C', label: 'Easier login' },
      { key: 'D', label: 'Better reliability' },
      { key: 'E', label: 'More useful features' },
      { key: 'F', label: 'Better customer support' },
      { key: 'G', label: 'Better explanations/tutorials' },
      { key: 'H', label: 'Other' },
    ],
  },
  {
    id: 4,
    type: 'single',
    question: 'What type of phone do you actively use?',
    options: [
      { key: 'A', label: 'I only use a Smartphone' },
      { key: 'B', label: 'I only use a Feature phone' },
      { key: 'C', label: 'I use a Smartphone daily and a Feature phone just for MoMo.' },
      { key: 'D', label: 'I have two smartphones but the lesser one is my MoMo phone' },
    ],
  },
  {
    id: 5,
    type: 'single',
    question: 'What smartphone brand/type do you use?',
    options: [
      { key: 'A', label: 'Iphone (IOS)' },
      { key: 'B', label: 'Samsung (Android)' },
      { key: 'C', label: 'Pixel (Android)' },
      { key: 'D', label: 'Other (Android)' },
    ],
  },
  {
    id: 6,
    type: 'single',
    eyebrow: 'Did you know?',
    question:
      'You can log into the MoMo App using your fingerprint or biometric authentication after enabling it with your MoMo PIN.',
    options: [
      { key: 'A', label: 'Yes' },
      { key: 'B', label: 'No' },
    ],
  },
  {
    id: 7,
    type: 'single',
    eyebrow: 'Did you know?',
    question:
      'The MoMo App generates transaction statements for the last 30, 60, or 90 days, or a custom range within 90 days, sent as a PDF to your email.',
    options: [
      { key: 'A', label: 'Yes' },
      { key: 'B', label: 'No' },
    ],
  },
  {
    id: 8,
    type: 'single',
    eyebrow: 'Did you know?',
    question:
      'You can use QR code payments with participating merchants through the MoMo App, making checkout quicker where supported.',
    options: [
      { key: 'A', label: 'Yes' },
      { key: 'B', label: 'No' },
    ],
  },
  {
    id: 9,
    type: 'single',
    eyebrow: 'Did you know?',
    question:
      'You can buy airtime and data bundles for yourself or someone else directly from the MoMo App.',
    options: [
      { key: 'A', label: 'Yes' },
      { key: 'B', label: 'No' },
    ],
  },
  {
    id: 10,
    type: 'single',
    eyebrow: 'Did you know?',
    question:
      'The MoMo App allows eligible users to move money between their MoMo wallet and supported bank accounts.',
    options: [
      { key: 'A', label: 'Yes' },
      { key: 'B', label: 'No' },
    ],
  },
]
