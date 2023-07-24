import { GarbageValues, ScoringValues } from "./consts";

export interface AttackState {
    totalScore: number
    totalGarbageSent: number

    b2b: number
    combo: number
    currentcombopower: number
    currentbtbchainpower: number
    options: {
        b2bchaining: boolean
        garbagemultiplier: number
    }
}

export function processPlacement(state: AttackState, linesCleared: number, spinType: "mini" | "normal" | null, pc: boolean | null): [number, number] {
    let maintainsB2B = false;
    if (linesCleared) { 
        state.combo++;
        if (4 === linesCleared || spinType) {
            maintainsB2B = true;
        }

        if (maintainsB2B) {
            state.b2b++;
        } else {
            state.b2b = 0;
        }
    } else {
        state.combo = 0;
        state.currentcombopower = 0;
    }
    
    let score = 0,
        garbage = 0;

    switch (linesCleared) {
        case 0:
            if ("mini" === spinType) {
                score = ScoringValues.TSPIN_MINI;
                garbage = GarbageValues.TSPIN_MINI;
            } else if ("normal" === spinType) {
                score = ScoringValues.TSPIN;
                garbage = GarbageValues.TSPIN;
            }
            break;
        case 1:
            if ("mini" === spinType) {
                score = ScoringValues.TSPIN_MINI_SINGLE;
                garbage = GarbageValues.TSPIN_MINI_SINGLE;
            } else if ("normal" === spinType) {
                score = ScoringValues.TSPIN_SINGLE;
                garbage = GarbageValues.TSPIN_SINGLE;
            } else {
                score = ScoringValues.SINGLE;
                garbage = GarbageValues.SINGLE;
            }
            break;

        case 2:
            if ("mini" === spinType) {
                score = ScoringValues.TSPIN_MINI_DOUBLE;
                garbage = GarbageValues.TSPIN_MINI_DOUBLE;
            } else if ("normal" === spinType) {
                score = ScoringValues.TSPIN_DOUBLE;
                garbage = GarbageValues.TSPIN_DOUBLE;
            } else {
                score = ScoringValues.DOUBLE;
                garbage = GarbageValues.DOUBLE;
            }
            break;

        case 3:
            if (spinType) {
                score = ScoringValues.TSPIN_TRIPLE;
                garbage = GarbageValues.TSPIN_TRIPLE;
            } else {
                score = ScoringValues.TRIPLE;
                garbage = GarbageValues.TRIPLE;
            }
            break;

        case 4:
            if (spinType) {
                score = ScoringValues.TSPIN_QUAD;
                garbage = GarbageValues.TSPIN_QUAD
            } else {
                score = ScoringValues.QUAD;
                garbage = GarbageValues.QUAD;
            }
            break;
    }

    if (linesCleared) {
        if (state.b2b > 1) {
            score *= ScoringValues.BACKTOBACK_MULTIPLIER;

            if (state.options.b2bchaining) {
                const b2bGarbage = GarbageValues.BACKTOBACK_BONUS * 
                    (
                        Math.floor(1 + Math.log1p((state.b2b - 1) * GarbageValues.BACKTOBACK_BONUS_LOG))
                        +  (state.b2b - 1 <= 1 
                            ? 0 
                            : (1 + Math.log1p((state.b2b - 1) * GarbageValues.BACKTOBACK_BONUS_LOG) % 1) / 3
                        )
                    );

                garbage += b2bGarbage;
    
                if (Math.floor(b2bGarbage) > state.currentbtbchainpower) {
                    state.currentbtbchainpower = Math.floor(b2bGarbage);
                }
            } else {
                garbage += GarbageValues.BACKTOBACK_BONUS;
            }
        } else {
            state.currentbtbchainpower = 0;
        }
    }

    if (state.combo > 1) {
        score += ScoringValues.COMBO * (state.combo - 1);
        garbage *= 1 + GarbageValues.COMBO_BONUS * (state.combo - 1) // Fucking broken ass multiplier :)
    }

    if (state.combo > 2) {
        garbage = Math.max(Math.log1p(GarbageValues.COMBO_MINIFIER * (state.combo - 1) * GarbageValues.COMBO_MINIFIER_LOG), garbage)
    }

    const finalGarbage = Math.floor(garbage * state.options.garbagemultiplier);
    if (state.combo > 2) {
        state.currentcombopower = Math.max(state.currentcombopower, finalGarbage);
    }
    
    const combinedScore = score + (pc ? ScoringValues.ALL_CLEAR : 0);
    const combinedGarbage = finalGarbage + (pc ? GarbageValues.ALL_CLEAR : 0);

    state.totalScore += combinedScore;
    state.totalGarbageSent += combinedGarbage;
    return [score, combinedGarbage];
}
