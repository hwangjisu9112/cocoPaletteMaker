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
  skills: Skill[], // 전체 66개 특기 리스트 (폭력1~6, 정서1~6... 순서)
  abilities: Ability[],
  getTranslation: (key: string) => string
): string {
  if (!stats) return getTranslation("error_no_stats");

    const T = getTranslation;
    let data = ""
    const EOL = "\n";
    const SEP = "\t";
 // 1. 기본 정보 (이미지 상단 A1~D3 영역)
  data += "◆" + EOL;
  data += [T("label_name"), "", T("label_player"), ""].join(SEP) + EOL;
  data += [T("label_job"), ""].join(SEP) + EOL;
  data += [T("label_age"), ""].join(SEP) + EOL + EOL;

  // 2. 상태 및 아이템 정보 (이미지 주황색 셀 영역 A5~D10)
  // 템플릿 구조: [항목명] [값] [항목명] [값]
  data += [T("hp"), derivedStats.hp, T("curiosity"), derivedStats.curiosity].join(SEP) + EOL;
  data += [T("san"), derivedStats.san, T("fear"), derivedStats.fear].join(SEP) + EOL;
  data += [T("weapon"), derivedStats.weapon].join(SEP) + EOL;
  data += [T("painkillers"), derivedStats.painkillers].join(SEP) + EOL;
  data += [T("omamori"), derivedStats.omamori].join(SEP) + EOL + EOL;

  // 3. 특기 판정표 (이미지 중간 A15~L26 영역)
  // 6개 카테고리 제목
  const categories = ["폭력", "정서", "지각", "기술", "지식", "괴이"];
  data += "◆" + EOL;
  data += categories.map(cat => T(cat)).join(SEP + SEP) + EOL;

  // 11행 동안 각 카테고리의 해당 행 특기를 가로로 나열
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

  // 4. 어빌리티 정보 (이미지 하단 A30 영역 이후)
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

  // 5. 코코포리아 채팅 팔레트 (선택 사항)
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
