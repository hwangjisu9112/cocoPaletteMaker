import { get } from 'svelte/store'; // 💡 get 함수를 사용하여 store의 값을 가져옵니다.


/**
 * 봉마인의 기본 특성치 값을 정의합니다.
 */
interface Stats {
    hp: number;
    san: number;
    weapon: number;
    painkillers: number;
    omamori: number;
    curiosity?: string;
    fear?: string;
}

/**
 * 개별 기능 항목의 값을 정의합니다.
 */
interface Skill {
    name: string;
    base: number;
}

interface Ability {
    name: string;
    type: string;
    designated: string;
    describe: string;
}



export function createGooglesheetData(
    stats: Stats,
    derivedStats: { hp: number; san: number; weapon: number; painkillers: number; omamori: number; curiosity: string; fear: string; },
    skills: Skill[],
    ability: Ability[],
    // 💡 번역된 문자열을 가져오는 함수를 인수로 추가
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = ""
    const EOL = "\n";
    const SEP = "\t";



    data += "◆" + EOL;

    return data;
}
