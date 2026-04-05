import { EdgeType } from './boardTheme';
import { Idea } from './IdeaCard';

/**
 * Keyword banks per relationship type.
 * Keep these simple, lower-case, partial-word friendly.
 */
const CONTRADICTION_WORDS = [
    'wrong', 'problem', 'issue', 'vs', 'versus', 'against', 'flaw',
    'disadvantage', 'drawback', 'weakness', 'fail', 'error', 'bug',
    'conflict', 'critic', 'debunk', 'myth', 'misconception',
];

const DEPENDENCY_WORDS = [
    'require', 'basic', 'foundation', 'prerequisite', 'fundamental',
    'before', 'need', 'depend', 'first', 'step', 'intro', 'beginner',
    'principle', 'base', 'syntax', 'setup', 'install', 'start',
];

const INSPIRATION_WORDS = [
    'idea', 'vision', 'dream', 'imagine', 'creative', 'invent', 'concept',
    'inspire', 'discover', 'spark', 'innovation', 'design', 'art',
    'story', 'analogy', 'metaphor', 'theory', 'hypothesis',
];

function tokenize(text: string): string[] {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreKeywords(tokens: string[], keywords: string[]): number {
    return tokens.reduce((score, tok) =>
        score + (keywords.some(kw => tok.includes(kw)) ? 1 : 0), 0);
}

/**
 * Quickly scores which relationship fits best using:
 *  - title & content keyword matching
 *  - node color category heuristics (e.g. "red = critical" → contradicts)
 *
 * Returns the best matching EdgeType and a human-readable `reason`
 * that can be shown in the confirmation prompt.
 */
export function suggestConnectionType(
    source: Idea,
    target: Idea
): { type: EdgeType; reason: string } {
    const srcText = `${source.title ?? ''} ${source.content ?? ''}`;
    const tgtText = `${target.title ?? ''} ${target.content ?? ''}`;
    const combined = `${srcText} ${tgtText}`;
    const tokens = tokenize(combined);

    // ── Color-pair shortcuts ──────────────────────────────────────────────────
    // red → critical, likely a contradicting idea
    if (source.color === 'red' || target.color === 'red') {
        return {
            type: 'contradicts',
            reason: `One card is marked Critical — they might be opposing ideas.`,
        };
    }

    // pink → future idea inspired from something
    if (source.color === 'pink' || target.color === 'pink') {
        return {
            type: 'inspired_by',
            reason: `One card sounds like a future idea sparked by the other.`,
        };
    }

    // yellow (in-progress) connected to green (completed) → likely depends_on
    const colorPair = new Set([source.color, target.color]);
    if (colorPair.has('yellow') && colorPair.has('green')) {
        return {
            type: 'depends_on',
            reason: `It looks like the completed idea is a foundation for the in-progress one.`,
        };
    }

    // ── Keyword scoring ───────────────────────────────────────────────────────
    const scores: Record<EdgeType, number> = {
        contradicts: scoreKeywords(tokens, CONTRADICTION_WORDS),
        depends_on: scoreKeywords(tokens, DEPENDENCY_WORDS),
        inspired_by: scoreKeywords(tokens, INSPIRATION_WORDS),
        relates_to: 0, // fallback, always 0 so others can win if they have any signal
    };

    const best = (Object.entries(scores) as [EdgeType, number][])
        .filter(([, s]) => s > 0)
        .sort(([, a], [, b]) => b - a)[0];

    if (best) {
        const [type] = best;
        const reasonMap: Record<EdgeType, string> = {
            contradicts: `Keywords suggest these ideas might be in tension.`,
            depends_on: `One idea appears to be a foundation for the other.`,
            inspired_by: `One idea looks like it sparked the other.`,
            relates_to: `They appear to share a common subject.`,
        };
        return { type, reason: reasonMap[type] };
    }

    // ── Default fallback ──────────────────────────────────────────────────────
    return {
        type: 'relates_to',
        reason: `They seem to share a common topic — you can always change this.`,
    };
}
