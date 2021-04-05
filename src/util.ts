export function clazz(...xs: (string | boolean | undefined | null | 0)[]) {
    return xs.filter(x => typeof x === "string").join(" ");
}