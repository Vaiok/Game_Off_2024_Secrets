import { XorShift, LCG } from "./seedAlgorithms.js";

class PerlinNoise {
    private permutation: number[];
    constructor(seed: number) { this.permutation = this.generateRandomPermutation(seed); }

    private generateRandomPermutation(seed: number): number[] {
        const xorShift = new XorShift(seed);
        const p = new Uint8Array(1024);
        for (let i = 0; i < 1024; i++) { p[i] = xorShift.next(); }
        return [...p, ...p];
    }

    private fade(t: number): number { return t * t * t * (t * (t * 6 - 15) + 10); }
    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    private lerp(a: number, b: number, t: number): number { return a + t * (b - a); }
    private noiseLayer(x: number, y: number, z: number): number {
        const p = this.permutation;
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z;
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z;
        const gradAA1 = this.grad(p[AA], x, y, z);
        const gradBA1 = this.grad(p[BA], x - 1, y, z);
        const gradAB1 = this.grad(p[AB], x, y - 1, z);
        const gradBB1 = this.grad(p[BB], x - 1, y - 1, z);
        const gradAA2 = this.grad(p[AA + 1], x, y, z - 1);
        const gradBA2 = this.grad(p[BA + 1], x - 1, y, z - 1);
        const gradAB2 = this.grad(p[AB + 1], x, y - 1, z - 1);
        const gradBB2 = this.grad(p[BB + 1], x - 1, y - 1, z - 1);
        const lerp1 = this.lerp(gradAA1, gradBA1, u);
        const lerp2 = this.lerp(gradAB1, gradBB1, u);
        const lerp3 = this.lerp(gradAA2, gradBA2, u);
        const lerp4 = this.lerp(gradAB2, gradBB2, u);
        const lerp5 = this.lerp(lerp1, lerp2, v);
        const lerp6 = this.lerp(lerp3, lerp4, v);
        return this.lerp(lerp5, lerp6, w);
    }

    public generateNoise(
        x: number, y: number,
        scale: number, octaves: number,
        persistence: number, lacunarity: number,
        unsigned: boolean
    ): number {
        let total = 0;
        let amplitude = 1;
        let frequency = 1;
        let maxValue = 0;
        for (let i = 0; i < octaves; i++) {
            total += this.noiseLayer(
                x / scale * frequency,
                y / scale * frequency,
                i * 10
            ) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        const finalValue = total / maxValue;
        if (unsigned) { return (finalValue + 1) / 2; }
        else { return finalValue; }
    }
}

export { PerlinNoise };