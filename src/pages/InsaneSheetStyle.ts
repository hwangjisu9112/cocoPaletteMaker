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

/**
 * 봉마인 캐릭터 데이터를 구글 시트에 붙여넣기 위한 탭 구분 문자열을 생성합니다.
 * 
 * @param stats - 플레이어의 기본 능력치 (HP, SAN, 소지품 등)
 * @param derivedStats - 상태 정보가 포함된 파생 능력치 객체
 * @param skills - 현재 선택된 특기 목록
 * @param abilities - 캐릭터가 보유한 어빌리티 목록
 * @param getTranslation - 다국어 문자열 변환 함수
 * @returns 구글 시트 형식의 데이터 문자열
 */
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
    data += categories.join(SEP) + EOL;

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
        const judgeAb = ab.specified ? T(ab.specified) : "";
        if (abilityMatch) {
            const val = abilityMatch.current || abilityMatch.base;
            data += `2d6>=${val} [${ab.name}]｜${ab.type}｜ ${judgeAb}｜${ab.description}` + EOL;;
        } else {
            data += `[${ab.name}]｜${ab.type}｜ ${judgeAb}｜${ab.description}\n`;
        }
    });

    return data;
}


/**
 * 코코포리아 채팅 팔레트에서 사용할 수 있는 매크로 문자열을 생성합니다.
 * 
 * @param stats - 플레이어의 기본 능력치
 * @param derivedStats - 상태 정보가 포함된 파생 능력치 객체
 * @param skills - 현재 선택된 특기 목록
 * @param abilities - 캐릭터가 보유한 어빌리티 목록
 * @param getTranslation - 다국어 문자열 변환 함수
 * @returns 코코포리아 팔레트 형식의 탭 구분 문자열
 */
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
        const judgeAb = ab.specified ? T(ab.specified) : "";

        if (abilityMatch) {
            const val = abilityMatch.current || abilityMatch.base;
            data += `2d6>=${val} [${ab.name}]｜${ab.type}｜ ${judgeAb} ｜${ab.description}` + EOL;;
        } else {
            data += `[${ab.name}]｜${ab.type}｜ ${judgeAb} ｜${ab.description}\n`;
        }
    });


    return data;
}


/**
 * 코코포리아 캐릭터 생성 API용 JSON 데이터를 생성합니다.
 * 
 * @param stats - 플레이어의 기본 능력치
 * @param derivedStats - 상태 정보가 포함된 파생 능력치 객체
 * @param skills - 현재 선택된 특기 목록
 * @param abilities - 캐릭터가 보유한 어빌리티 목록
 * @param getTranslation - 다국어 문자열 변환 함수
 * @returns 코코포리아 API 규격에 맞는 JSON 문자열
 */
export function createCocoporiaJson(
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

    // 1. 커맨드 문자열 생성 (기존 createCocoPalette 방식 활용)
    let commands = ` ✦${T("curiosity")}: ${T(derivedStats.curiosity)}  ✦${T("fear")}: ${T(derivedStats.fear)}\n\n────────Ability\n`;

    // 어빌리티 부분 커맨드
    abilities.forEach(ab => {
        if (ab.name) {
            commands += `[${ab.name}] ${ab.type}   「${ab.description}」 #ABILITY\n`;
        }
    });

    commands += `\n2D6──────Roll\n`;

    // 특기 판정 커맨드
    skills.forEach(s => {
        const val = s.current || s.base;
        commands += `2D6>=${val}  ROLL  [${T(s.name)}]\n`;
    });

    // 2. JSON 객체 구성
    const data = {
        kind: "character",
        data: {
            name: "New Affected",
            status: [
                { label: T("hp"), value: derivedStats.hp, max: derivedStats.hp },
                { label: T("san"), value: derivedStats.san },
                { label: T("weapon"), value: derivedStats.weapon },
                { label: T("painkillers"), value: derivedStats.painkillers },
                { label: T("omamori"), value: derivedStats.omamori },
            ],
            // params에 전체 특기 리스트 입력
            params: skills.map(sk => ({
                label: T(sk.name),
                value: (sk.current || sk.base).toString()
            })),
            color: "",
            commands: commands.trim()
        }
    };

    return JSON.stringify(data, null, 2);
}