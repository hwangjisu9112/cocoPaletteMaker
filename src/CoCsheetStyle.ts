import { get } from 'svelte/store';

interface Stats {
    str: number; con: number; siz: number; dex: number; app: number;
    edu: number; int: number; pow: number; luc: number;
}

interface Skill {
    name: string;
    base: number;
    point: number;
}

export function createGooglesheetData(
    stats: Stats,
    derivedStats: { hp: number; mp: number; sanity: number; damage: string },
    skillPoint: number,
    skills: Skill[],
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = "";
    const EOL = "\n"; //줄 바꾸기 end of line
    const SEP = "\t"; // 탭하기 tap

    // --- 기본 정보 ---
    data += "◆크툴루의 부름 7판 탐사자 생성" + EOL;
    data += ["이름", "", "플레이어"].join(SEP) + EOL;
    data += "직업" + EOL;
    data += ["신장", "", "체중"].join(SEP) + EOL;
    data += ["출생지", "", "국적", "", "시대"].join(SEP) + EOL;
    data += "나이" + EOL;
    data += "외형" + EOL;
    data += "성격" + EOL + EOL;

    // 특성치
    data += "◆특성치" + EOL;
    data += ["근력", "건강", "크기"].join(SEP) + EOL;
    data += [stats.str, stats.con, stats.siz].join(SEP) + EOL;

    data += ["민첩성", "외모", "교육"].join(SEP) + EOL;
    data += [stats.dex, stats.app, stats.edu].join(SEP) + EOL;

    data += ["지능", "정신력", "행운"].join(SEP) + EOL;
    data += [stats.int, stats.pow, stats.luc].join(SEP) + EOL;

    // 부수적 수치 
    data += "◆부수적 수치" + EOL;
    data += ["체력", "마력", "이성", "근접전 피해 보너스"].join(SEP) + EOL;
    data += [derivedStats.hp, derivedStats.mp, derivedStats.sanity, derivedStats.damage].join(SEP) + EOL;

    // 기능치
    data += "◆기능치(남은 기능 점수  : " + skillPoint + ")" + EOL;
    data += ["명칭", "기본값", "투입 점수", "총점", "어려움(1/2)", "극단적(1/5)"].join(SEP) + EOL;

    // 스킬 목록 상세
    skills.forEach(skill => {
        const total = skill.point + skill.base;
        data += [
            skill.name,
            skill.base,
            skill.point,
            total,
            Math.floor(total / 2),
            Math.floor(total / 5)
        ].join(SEP) + EOL;
    });
    data += [T("skill_cthulhu_mythos"), "0", "0", "0", "0", "0"].join(SEP) + EOL;

    // 코코포리아 채팅 팔레트 
    data += EOL + "◆소지품" + EOL + EOL + EOL + EOL;
    data += "◆코코포리아 채팅 팔레트(아래의 수식을 복사하여 코코포리아 채팅 팔레트에 붙여넣기)" + EOL;

    const statMap: { [key in keyof Stats]: string } = {
        str: "str", con: "con", siz: "siz", dex: "dex", app: "app",
        edu: "edu", int: "int", pow: "pow", luc: "luc"
    };

    (Object.keys(statMap) as (keyof typeof statMap)[]).forEach(key => {
        const statValue = stats[key];
        const statLabel = statMap[key];
        data += `CC<=${statValue}${SEP}[${statLabel} 판정]` + EOL;
    });


    skills.forEach(skill => {
        const totalSkills = skill.point + skill.base;
        data += `CC<=${totalSkills}${SEP}[${T(skill.name)}]`
    });

    data += `CC<=0 [${T("skill_cthulhu_mythos")}]` + EOL;
    data += `CC<=${derivedStats.sanity}${SEP}[SAN]` + EOL;
    data += `${derivedStats.damage} + 1d3 ${SEP}[타격 - 비무장]` + EOL;

    return data;
}


export function createCocoPalette(stats: Stats,
    derivedStats: { hp: number; mp: number; sanity: number; damage: string },
    skillPoint: number,
    skills: Skill[],
    getTranslation: (key: string) => string
): string {
    if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = ""
    const EOL = "\n"; //줄 바꾸기 end of line
    const SEP = "\t"; // 탭하기 tap

    const statMap: { [key in keyof Stats]: string } = {
        str: "str", con: "con", siz: "siz", dex: "dex", app: "app",
        edu: "edu", int: "int", pow: "pow", luc: "luc"
    };

    (Object.keys(statMap) as (keyof typeof statMap)[]).forEach(key => {
        const statValue = stats[key];
        const statLabel = statMap[key];
        data += `CC<=${statValue}${SEP}[${statLabel} 판정]` + EOL;
    });

    skills.forEach(skill => {
        const total = skill.point + skill.base;
        data += `CC<=${total}${SEP}[${skill.name}]` + EOL;
    });

    data += `CC<=0 [${T("skill_cthulhu_mythos")}]` + EOL;
    data += `CC<=${derivedStats.sanity}${SEP}[SAN]` + EOL;
    data += `${derivedStats.damage} + 1d3 ${SEP}[타격 - 비무장]` + EOL;

    return data;
}