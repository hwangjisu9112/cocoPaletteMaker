import { get } from 'svelte/store'; // 💡 get 함수를 사용하여 store의 값을 가져옵니다.


/**
 * 탐사자의 기본 특성치 값을 정의합니다.
 */
interface Stats {
    str: number;
    con: number;
    siz: number;
    dex: number;
    app: number;
    edu: number;
    int: number;
    pow: number;
    luc: number;

}


/**
 * 개별 기능 항목의 값을 정의합니다.
 */
interface Skill {
    name: string;
    base: number;
    point: number;
}
/**
 * 크툴루의 부름 탐사자 정보를 구글시트에 붙여넣기 위한 데이터를 생성합니다.
 *
 * @param stats - 플레이어의 기본 능력치 값
 * @param derivedStats - 체력, 마력 등 파생 능력치 값
 * @param skillPoint - 잔여 기술 포인트
 * @param skills - 플레이어가 보유한 기술 목록
 * @param getTranslation - 다국어 문자열을 반환하는 함수
 * @returns 구글시트에 기록 가능한 탭 구분 문자열
 */
export function createGooglesheetData(
    stats: Stats,
    derivedStats: { hp: number; mp: number; sanity: number; damage: string },
    skillPoint: number,
    skills: Skill[],
    // 💡 번역된 문자열을 가져오는 함수를 인수로 추가
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation; // 번역 함수를 T로 짧게 별칭 지정
    let data = ""
    const EOL = "\n";
    const SEP = "\t";

    data += "◆" + EOL;
    data += [T("label_name"), "", T("label_player")].join(SEP) + EOL;
    data += T("label_job") + EOL;
    data += [T("label_height"), "", T("label_weight")].join(SEP) + EOL;
    data += [T("label_birthplace"), "", T("label_nationality"), "", T("label_era")].join(SEP) + EOL;
    data += T("label_age") + EOL;
    data += T("label_appearance") + EOL;
    data += T("label_personality") + EOL + EOL;

    data += [T("str"), T("con"), T("siz")].join(SEP) + EOL;
    data += [stats.str, stats.con, stats.siz].join(SEP) + EOL;

    data += [T("dex"), T("app"), T("edu")].join(SEP) + EOL;
    data += [stats.dex, stats.app, stats.edu].join(SEP) + EOL;

    data += [T("int"), T("pow"), T("luc")].join(SEP) + EOL;
    data += [stats.int, stats.pow, stats.luc].join(SEP) + EOL;

    data += [T("hp"), T("mp"), T("san"), T("db")].join(SEP) + EOL;
    data += [derivedStats.hp, derivedStats.mp, derivedStats.sanity, derivedStats.damage].join(SEP) + EOL;

    // 💡 동적으로 문자열 삽입
    data += "◆" + T("section_skills") + T("skill_points_remaining").replace('{point}', skillPoint.toString()) + EOL;
    data += [T("skill_name"), T("skill_base"), T("skill_invested"), T("skill_total"), T("skill_hard"), T("skill_extreme")].join(SEP) + EOL;

    // 스킬 목록 상세
    skills.forEach(skill => {
        const total = skill.point + skill.base;
        data += [
            T(skill.name),
            skill.base,
            skill.point,
            total,
            Math.floor(total / 2),
            Math.floor(total / 5)
        ].join(SEP) + EOL;
    });

    data += [T("skill_cthulhu_mythos"), "0", "0", "0", "0", "0"].join(SEP) + EOL;


    data += EOL + "◆" + T("section_inventory") + EOL + EOL + EOL + EOL;
    data += "◆" + T("section_cocorp_palette_title") + EOL;

    const statMap: { [key in keyof Stats]: string } = {
        str: "str", con: "con", siz: "siz", dex: "dex", app: "app",
        edu: "edu", int: "int", pow: "pow", luc: "luc"
    };

    (Object.keys(statMap) as (keyof Stats)[]).forEach(key => {
        const statValue = stats[key];
        const statLabel = T(statMap[key]);
        data += `CC<=${statValue}${SEP}[${statLabel} ${T("check_suffix")}]` + EOL;
    });


    skills.forEach(skill => {
        const totalSkills = skill.point + skill.base;
        data += `CC<=${totalSkills}${SEP}[${T(skill.name)}]` + EOL;
    });

    data += `CC<=0 [${T("skill_cthulhu_mythos")}]` + EOL;
    data += `CC<=${derivedStats.sanity}${SEP}[${T("check_san")}]` + EOL;
    data += `${derivedStats.damage} + 1d3 ${SEP}[${T("attack_unarmed")}]` + EOL;

    return data;
}


/**
 * 코코포리아의 채팅 팔레트 매크로용 캐릭터 데이터를 생성합니다.
 *
 * @param stats - 플레이어의 기본 능력치 값
 * @param derivedStats - 체력, 마력 등 파생 능력치 값
 * @param skills - 플레이어가 보유한 기술 목록
 * @param getTranslation - 다국어 문자열을 반환하는 함수
 * @returns 코코팔레트에 붙여넣기 위한 탭 구분 문자열
 */
export function createCocoPalette(
    stats: Stats,
    derivedStats: { hp: number; mp: number; sanity: number; damage: string },
    skills: Skill[],
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = ""
    const EOL = "\n";
    const SEP = "\t";

    const statMap: { [key in keyof Stats]: string } = {
        str: "str", con: "con", siz: "siz", dex: "dex", app: "app",
        edu: "edu", int: "int", pow: "pow", luc: "luc"
    };

    (Object.keys(statMap) as (keyof Stats)[]).forEach(key => {
        const statValue = stats[key];
        const statLabel = T(statMap[key]);
        data += `CC<=${statValue}${SEP}[${statLabel} ${T("check_suffix")}]` + EOL;
    });

    skills.forEach(skill => {
        const total = skill.point + skill.base;
        data += `CC<=${total}${SEP}[${T(skill.name)}]` + EOL;
    });

    data += `CC<=0 [${T("skill_cthulhu_mythos")}]` + EOL;
    data += `CC<=${derivedStats.sanity}${SEP}[${T("check_san")}]` + EOL;
    data += `${derivedStats.damage}+1d3 ${SEP}[${T("attack_unarmed")}]` + EOL;

    return data;
}


/**
 * 코코포리아 API용 JSON 데이터를 생성합니다.
 *
 * @param stats - 플레이어의 기본 능력치 값
 * @param derivedStats - 체력, 마력 등 파생 능력치 값
 * @param skills - 플레이어가 보유한 기술 목록
 * @param getTranslation - 다국어 문자열을 반환하는 함수
 * @returns 코코팔레트에 붙여넣기 위한 탭 구분 문자열
 *
 */
export function createCocoporiaJson(
    stats: Stats,
    derivedStats: { hp: number; mp: number; sanity: number; damage: string },
    skills: Skill[],
    wealthValue: number,
    getTranslation: (key: string) => string
): string {

    if (!stats) return getTranslation("error_no_stats");
    const T = getTranslation;

    // 특성치 판정 문자열 생성
    const statMap: { [key in keyof Stats]: string } = {
        str: "str", con: "con", siz: "siz", dex: "dex", app: "app",
        edu: "edu", int: "int", pow: "pow", luc: "luc"
    };

    const statCommands = (Object.keys(statMap) as (keyof Stats)[]).map(key => {
        const statValue = stats[key];
        const statLabel = T(statMap[key]);
        return `CC<=${statValue} [ ${statLabel} ]`; 
    });

    // 기능치 판정 문자열 생성
    const skillCommands = skills.map(s => `CC<=${s.point + s.base} [ ${T(s.name)} ]`);

    // 전체 합치기
    const allCommands = [...statCommands, ...skillCommands].join("\n");

    // 소비 수준 결정
    let consumptionLevel = T("penniless");
    if (wealthValue >= 50) consumptionLevel = "부유함";
    else if (wealthValue >= 5) consumptionLevel = "서민";
    else consumptionLevel = T("penniless");

    const data = {
        kind: "character",
        data: {
            name: "New Inv",
            initiative: stats.dex,
            memo: `소비 수준: ${consumptionLevel}`,
            status: [
                { label: T("hp"), value: derivedStats.hp, max: derivedStats.hp },
                { label: T("mp"), value: derivedStats.mp, max: derivedStats.mp },
                { label: T("san"), value: derivedStats.sanity, max: 99 },
                { label: T("luc"), value: stats.luc, max: 99 }
            ],
            params: [
                { label: "피해보너스", value: derivedStats.damage },
                { label: T("con"), value: stats.con.toString() },
                { label: T("edu"), value: stats.edu.toString() },
                { label: T("str"), value: stats.str.toString() },
                { label: T("dex"), value: stats.dex.toString() },
                { label: T("app"), value: stats.app.toString() },
                { label: T("pow"), value: stats.pow.toString() },
                { label: T("int"), value: stats.int.toString() },
                { label: T("siz"), value: stats.siz.toString() }
            ],
            commands: allCommands // 💡 합쳐진 커맨드 적용
        }
    };

    return JSON.stringify(data, null, 2);
}