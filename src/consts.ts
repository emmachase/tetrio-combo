export const ScoringValues = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    QUAD: 800,
    TSPIN_MINI: 100,
    TSPIN: 400,
    TSPIN_MINI_SINGLE: 200,
    TSPIN_SINGLE: 800,
    TSPIN_MINI_DOUBLE: 400,
    TSPIN_DOUBLE: 1200,
    TSPIN_TRIPLE: 1600,
    TSPIN_QUAD: 2600,
    BACKTOBACK_MULTIPLIER: 1.5,
    COMBO: 50,
    ALL_CLEAR: 3500,
    SOFTDROP: 1,
    HARDDROP: 2
}

export const GarbageValues = {
    SINGLE: 0,
    DOUBLE: 1,
    TRIPLE: 2,
    QUAD: 4,
    TSPIN_MINI: 0,
    TSPIN: 0,
    TSPIN_MINI_SINGLE: 0,
    TSPIN_SINGLE: 2,
    TSPIN_MINI_DOUBLE: 1,
    TSPIN_DOUBLE: 4,
    TSPIN_TRIPLE: 6,
    TSPIN_QUAD: 10,
    BACKTOBACK_BONUS: 1,
    BACKTOBACK_BONUS_LOG: .8,
    COMBO_MINIFIER: 1,
    COMBO_MINIFIER_LOG: 1.25,
    COMBO_BONUS: .25,
    ALL_CLEAR: 10,
    combotable: {
        none: [0],
        "classic guideline": [0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5],
        "modern guideline": [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4]
    }
}

export const ClearTypes: [keyof typeof Labels, number, "normal" | "mini" | null][] = [
    ["SINGLE",            1, null],
    ["DOUBLE",            2, null],
    ["TRIPLE",            3, null],
    ["QUAD",              4, null],
    ["TSPIN_SINGLE",      1, "normal"],
    ["TSPIN_DOUBLE",      2, "normal"],
    ["TSPIN_TRIPLE",      3, "normal"],
    ["TSPIN_QUAD",        4, "normal"],
    ["TSPIN_MINI_SINGLE", 1, "mini"],
    ["TSPIN_MINI_DOUBLE", 2, "mini"],
    ["TSPIN",             0, "normal"],
    ["TSPIN_MINI",        0, "mini"],
    ["NONE",              0, null],
]

export const Labels = {
    SINGLE:             "SINGLE",
    DOUBLE:             "DOUBLE",
    TRIPLE:             "TRIPLE",
    QUAD:               "QUAD",
    TSPIN_DOUBLE:       "T-spin DOUBLE",
    TSPIN_SINGLE:       "T-spin SINGLE",
    TSPIN_TRIPLE:       "T-spin TRIPLE",
    TSPIN_MINI_SINGLE:  "T-spin MINI SINGLE",
    TSPIN_MINI_DOUBLE:  "T-spin MINI DOUBLE",
    TSPIN_QUAD:         "I-spin QUAD",
    TSPIN:              "T-spin",
    TSPIN_MINI:         "T-spin MINI",
    NONE:               "break combo",
}
