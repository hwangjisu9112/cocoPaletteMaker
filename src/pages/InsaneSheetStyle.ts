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
    let data = ""
    const EOL = "\n";
    const SEP = "\t";
    data += "◆" + EOL;
    data += [T("label_name"), "", T("label_player"), ""].join(SEP) + EOL;
    data += [T("label_job"), ""].join(SEP) + EOL;
    data += [T("label_age"), ""].join(SEP) + EOL + EOL;


    data += [T("hp"), derivedStats.hp, T("curiosity"), T(derivedStats.curiosity)].join(SEP) + EOL;
    data += [T("san"), derivedStats.san, T("fear"), T(derivedStats.fear)].join(SEP) + EOL;
    data += [T("weapon"), derivedStats.weapon].join(SEP) + EOL;
    data += [T("painkillers"), derivedStats.painkillers].join(SEP) + EOL;
    data += [T("omamori"), derivedStats.omamori].join(SEP) + EOL + EOL;

    const categories = [T("ins_Violence"), T("ins_Emotion"), T("ins_Sense"), T("ins_Technique"), T("ins_Knowledge"), T("ins_Strange")];
    data += "◆" + EOL;
    data += categories.map(cat => T(cat)).join(SEP + SEP) + EOL;

    for (let row = 0; row < 11; row++) {
        let rowData: string[] = [];
        for (let col = 0; col < 6; col++) {
            const skillIdx = col * 11 + row;
            const skill = skills[skillIdx];
            if (skill) {
                // [특기명] [판정치] 형식으로 탭 구분
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

    data += [T("ability_name"), T("ability_type"), T("ability_specified"), T("ability_description")].join(SEP) + EOL;

    abilities.forEach(abi => {
        if (abi.name) {
            data += [
                abi.name,
                abi.type,
                abi.specified || "-",
                abi.description || ""
            ].join(SEP) + EOL;
        }
    });

    data += EOL + "◆" + T("section_cocorp_palette_title") + EOL;
    // 특기들에 대해 수식 생성
    skills.forEach(skill => {
        const val = skill.current || skill.base;
        if (val < 12) {
            data += `2d6>=${val} ${SEP} [${T(skill.name)} 판정]` + EOL;
        }

        if (skill.name === derivedStats.fear) {
            data += `2d6-2>=${val} ${SEP} [공포심 판정 : ${T(skill.name)}]` + EOL;
        }

    });

      data += [T("ability_name"), T("ability_type"), T("ability_specified"), T("ability_description")].join(SEP) + EOL;

  abilities.forEach(abi => {
    if (abi.name) {
      // 4-1. 기본 정보 출력
      data += [
        abi.name,
        abi.type,
        abi.specified ? T(abi.specified) : "-",
        abi.description || ""
      ].join(SEP) + EOL;

      // 4-2. 어빌리티 판정 수식 (채팅 팔레트용)
      if (abi.specified) {
        // skills 배열에서 지정 특기의 현재 판정값을 찾음
        const targetSkill = skills.find(s => s.name === abi.specified);
        const val = targetSkill ? (targetSkill.current || targetSkill.base) : 12;
        
        // 형식: 2d6>=[값] [어빌리티명](타입): [지정특기명]
        data += `2d6>=${val} ${SEP} [${abi.name}(${abi.type}): ${T(abi.specified)}]` + EOL;
      }
    }



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
    data += "◆" + EOL;
    data += [T("label_name"), "", T("label_player"), ""].join(SEP) + EOL;
    data += [T("label_job"), ""].join(SEP) + EOL;
    data += [T("label_age"), ""].join(SEP) + EOL + EOL;


    data += [T("hp"), derivedStats.hp, T("curiosity"), T(derivedStats.curiosity)].join(SEP) + EOL;
    data += [T("san"), derivedStats.san, T("fear"), T(derivedStats.fear)].join(SEP) + EOL;
    data += [T("weapon"), derivedStats.weapon].join(SEP) + EOL;
    data += [T("painkillers"), derivedStats.painkillers].join(SEP) + EOL;
    data += [T("omamori"), derivedStats.omamori].join(SEP) + EOL + EOL;

    const categories = [T("ins_Violence"), T("ins_Emotion"), T("ins_Sense"), T("ins_Technique"), T("ins_Knowledge"), T("ins_Strange")];
    data += "◆" + EOL;
    data += categories.map(cat => T(cat)).join(SEP + SEP) + EOL;

    for (let row = 0; row < 11; row++) {
        let rowData: string[] = [];
        for (let col = 0; col < 6; col++) {
            const skillIdx = col * 11 + row;
            const skill = skills[skillIdx];
            if (skill) {
                // [특기명] [판정치] 형식으로 탭 구분
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

    data += [T("ability_name"), T("ability_type"), T("ability_specified"), T("ability_description")].join(SEP) + EOL;

    abilities.forEach(abi => {
        if (abi.name) {
            data += [
                abi.name,
                abi.type,
                abi.specified || "-",
                abi.description || ""
            ].join(SEP) + EOL;
        }
    });

    data += EOL + "◆" + T("section_cocorp_palette_title") + EOL;
    // 판정치 12 미만인 특기들에 대해 수식 생성
    skills.forEach(skill => {
        const val = skill.current || skill.base;
        if (val < 12) {
            data += `2d6>=${val} ${SEP} [${T(skill.name)} 판정]` + EOL;
        }
    });

    return data;
}