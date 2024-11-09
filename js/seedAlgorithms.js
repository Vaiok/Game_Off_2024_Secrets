class XorShift {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        this.seed ^= this.seed << 13;
        this.seed ^= this.seed >> 17;
        this.seed ^= this.seed << 5;
        return this.seed >>> 0;
    }
}
class LCG {
    constructor(seed) {
        this.seed = seed;
    }
    next() {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 32;
        this.seed = (a * this.seed + c) % m;
        return this.seed;
    }
}
export { XorShift, LCG };
