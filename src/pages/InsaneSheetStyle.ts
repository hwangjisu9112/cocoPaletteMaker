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
    current?: number;
}

interface Ability {
    name: string;
    type: string;
    specified?: string;
    description?: string;
}


export function createGooglesheetData(
    stats: Stats,
    derivedStats: {
        hp: number;
        san: number;
        weapon: number;
        painkillers: number;
        omamori: number;
        curiosity: string;
        fear: string;
    },
    skills: Skill[],
    abilities: Ability[],
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    const EOL = "\n";
    const SEP = "\t";
    let data = "";

    // 1. 기본 정보
    data += "◆" + EOL;
    data += [T("label_name"), "", T("label_player"), ""].join(SEP) + EOL;
    data += [T("label_job"), ""].join(SEP) + EOL;
    data += [T("label_age"), ""].join(SEP) + EOL + EOL;

    // 2. 상태 및 아이템 정보
    data += [T("hp"), derivedStats.hp, T("curiosity"), T(derivedStats.curiosity), "플레이어간 관계"].join(SEP) + EOL;
    data += [T("san"), derivedStats.san, T("fear"), T(derivedStats.fear), "인물_1", " ", "감정", "", "거처", " "].join(SEP) + EOL;
    data += [T("weapon"), derivedStats.weapon, " ", " ", "인물_2", " ", "감정", "", "거처", " "].join(SEP) + EOL;
    data += [T("painkillers"), derivedStats.painkillers, " ", " ", "인물_3", " ", "감정", "", "거처", " "].join(SEP) + EOL;
    data += [T("omamori"), derivedStats.omamori, " ", " ", "인물_4", " ", "감정", "", "거처", " "].join(SEP) + EOL + EOL;

    // 3. 특기 판정표
    const categories = [T("ins_Violence"), T("ins_Emotion"), T("ins_Sense"), T("ins_Technique"), T("ins_Knowledge"), T("ins_Strange")];
    data += "◆" + EOL;
    data += categories.join(SEP + SEP) + EOL;

    for (let row = 0; row < 11; row++) {
        let rowData: string[] = [];
        for (let col = 0; col < 6; col++) {
            const skillIdx = col * 11 + row;
            const skill = skills[skillIdx];
            if (skill) {
                rowData.push(T(skill.name));
                rowData.push(skill.current?.toString() || skill.base.toString());
            } else {
                rowData.push("");
                rowData.push("");
            }
        }
        data += rowData.join(SEP) + EOL;
    }
    data += EOL;

    // 4. 어빌리티 정보 및 판정 수식
    data += [T("ability_name"), T("ability_type"), T("ability_specified"), T("ability_description")].join(SEP) + EOL;

    abilities.forEach(ab => {
        if (ab.name) {
            // 4-1. 기본 정보 출력
            data += [
                ab.name,
                ab.type,
                ab.specified ? T(ab.specified) : "-",
                ab.description || ""
            ].join(SEP) + EOL;

        }
    });

    // 5. 채팅 팔레트 (전체 특기)
    data += EOL + "◆" + T("section_cocorp_palette_title") + EOL;
    skills.forEach(sk => {
        const val = sk.current || sk.base;
        data += `2d6>=${val} ${SEP} [${T(sk.name)}]` + EOL;
        if (sk.name === derivedStats.fear) {
            data += `2d6-2>=${val} ${SEP} [FEAR : ${T(sk.name)}]` + EOL;
        }
    });

    abilities.forEach(ab => {
        const abilityMatch = skills.find(s => s.name === ab.specified);
        if (abilityMatch) {
            const val = abilityMatch.current || abilityMatch.base;
            data += ` 2d6>=${val} 【${ab.name}】｜${ab.type}｜《 ${ab.specified} 》｜${ab.description}` + EOL;;
        } else {
            data += `【${ab.name}】｜${ab.type}｜《 ${ab.specified}》｜${ab.description}\n`;
        }
    });

    return data;
}



export function createCocoPalette(
    stats: Stats,
    derivedStats: {
        hp: number;
        san: number;
        weapon: number;
        painkillers: number;
        omamori: number;
        curiosity: string;
        fear: string;
    },
    skills: Skill[],
    abilities: Ability[],
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = ""
    const EOL = "\n";
    const SEP = "\t";

    data += [T("hp"), derivedStats.hp].join(SEP) + EOL;
    data += [T("san"), derivedStats.san].join(SEP) + EOL;
    data += [T("weapon"), derivedStats.weapon].join(SEP) + EOL;
    data += [T("painkillers"), derivedStats.painkillers].join(SEP) + EOL;
    data += [T("omamori"), derivedStats.omamori].join(SEP) + EOL;
    data += [T("fear"), T(derivedStats.fear)].join(SEP) + EOL;
    data += [T("curiosity"), T(derivedStats.curiosity)].join(SEP) + EOL;
    data += EOL;
    skills.forEach(sk => {
        const val = sk.current || sk.base;
        data += `2d6>=${val} ${SEP} [${T(sk.name)}]` + EOL;
        if (sk.name === derivedStats.fear) {
            data += `2d6-2>=${val} ${SEP} [FEAR : ${T(sk.name)}]` + EOL;
        }
    });

    abilities.forEach(ab => {
        const abilityMatch = skills.find(s => s.name === ab.specified);
        if (abilityMatch) {
            const val = abilityMatch.current || abilityMatch.base;
            data += ` 2d6>=${val} 【${ab.name}】｜${ab.type}｜《 ${ab.specified} 》｜${ab.description}` + EOL;;
        } else {
            data += `【${ab.name}】｜${ab.type}｜《 ${ab.specified} 》｜${ab.description}\n`;
        }
    });


    return data;
}