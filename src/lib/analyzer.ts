import { Category } from '../store/ideaStore';

export interface AnalysisResult {
    aligned: boolean;
    feedback: string;
    suggestedCategory: Category;
    challengeQuestion?: string;
    type: 'idea' | 'question';
}

const UVP_KEYWORDS = [
    'flat fee', '1200', 'transparent', 'subscription',
    'cfa', 'cfp', 'fiduciary', 'credential',
    'institutional', 'process', 'asset allocation', 'risk management',
    'ai', 'efficiency', 'workflow', 'automation',
    'interactive', 'planning', 'scenario', 'dashboard'
];

const GAP_ANALYSIS_CHALLENGES = [
    {
        keywords: ['portal', 'app', 'mobile', 'login', 'digital'],
        question: "Does this integrate seamlessly with the client portal or mobile app to meet digital expectations?"
    },
    {
        keywords: ['compliance', 'adv', 'regulation', 'contract', 'agreement'],
        question: "Has this been reviewed for compliance (ADV, advertising rules) to avoid regulatory issues?"
    },
    {
        keywords: ['marketing', 'mail', 'postcard', 'campaign', 'lead'],
        question: "Is there a multi-touch follow-up strategy (e.g., calls, emails) to convert these leads?"
    },
    {
        keywords: ['service', 'meeting', 'communication', 'email', 'touch'],
        question: "Does this add a personal touch or proactive communication to differentiate from robo-advisors?"
    },
    {
        keywords: ['scale', 'growth', 'capacity', 'hiring', 'volume'],
        question: "How does this handle capacity if the client count doubles? Is it scalable?"
    }
];

export function analyzeIdea(text: string): AnalysisResult {
    const lowerText = text.toLowerCase();

    // Detect Type
    const isQuestion = text.trim().endsWith('?') ||
        lowerText.startsWith('how') ||
        lowerText.startsWith('what') ||
        lowerText.startsWith('why') ||
        lowerText.includes('?');

    const type = isQuestion ? 'question' : 'idea';

    // 1. Check UVP Alignment
    const isAligned = UVP_KEYWORDS.some(keyword => lowerText.includes(keyword));
    let feedback = isAligned
        ? "This aligns well with your 'Flat Fee/High Tech' UVP."
        : "This might need refinement to fit the 'Flat Fee/High Tech' model.";

    // 2. Generate Challenge (Gap Analysis)
    let challengeQuestion = "How does this specifically automate the workflow or reduce overhead?"; // Default challenge

    for (const challenge of GAP_ANALYSIS_CHALLENGES) {
        if (challenge.keywords.some(k => lowerText.includes(k))) {
            challengeQuestion = challenge.question;
            break;
        }
    }

    // 3. Categorize
    let suggestedCategory: Category = 'D'; // Default to Misc

    if (lowerText.includes('client') || lowerText.includes('experience') || lowerText.includes('service') || lowerText.includes('portal') || lowerText.includes('onboarding')) {
        suggestedCategory = 'A';
    } else if (lowerText.includes('fee') || lowerText.includes('price') || lowerText.includes('value') || lowerText.includes('credential')) {
        suggestedCategory = 'B';
    } else if (lowerText.includes('market') || lowerText.includes('lead') || lowerText.includes('campaign') || lowerText.includes('growth')) {
        suggestedCategory = 'C';
    }

    return {
        aligned: isAligned,
        feedback,
        suggestedCategory,
        challengeQuestion,
        type
    };
}
