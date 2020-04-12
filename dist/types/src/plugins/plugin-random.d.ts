import { Plugin } from '../types';
export interface RandomAPI {
    D4(): number;
    D4(diceCount: number): number[];
    D6(): number;
    D6(diceCount: number): number[];
    D10(): number;
    D10(diceCount: number): number[];
    D12(): number;
    D12(diceCount: number): number[];
    D20(): number;
    D20(diceCount: number): number[];
    Die(spotvalue?: number): number;
    Die(spotvalue: number, diceCount: number): number[];
    Number(): number;
    Shuffle<T>(deck: T[]): T[];
}
interface PrivateRandomAPI {
    _obj: {
        isUsed(): boolean;
        getState(): any;
    };
}
declare const RandomPlugin: Plugin<RandomAPI & PrivateRandomAPI>;
export default RandomPlugin;
