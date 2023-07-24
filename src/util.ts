export function clazz(...xs: (string | boolean | undefined | null | 0)[]) {
    return xs.flat().filter(x => typeof x === "string").join(" ");
}