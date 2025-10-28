export interface Skill {
  name: string;
  point: number;
  base: number;
  evade?: 'HALF_DEX';
  motherTongue?: 'EDUCATION';
}

// 크툴루의 부름 탐사자 기능들의 초기 목록
export const INITIAL_SKILLS: Skill[] = [
  { name: "skill_Appraise", point: 0, base: 5 },
  { name: "skill_Archaeology", point: 0, base: 1 },
  { name: "skill_Science()", point: 0, base: 1 },
  { name: "skill_SpotHidden", point: 0, base: 25 },
  { name: "skill_Fighting(Brawl)", point: 0, base: 25 },
  { name: "skill_MechRepair", point: 0, base: 10 },
  { name: "skill_Jump", point: 0, base: 20 },
  { name: "skill_Listen", point: 0, base: 20 },
  { name: "skill_FastTalk", point: 0, base: 5 },
  { name: "skill_Charm", point: 0, base: 15 },
  { name: "skill_Law", point: 0, base: 5 },
  { name: "skill_Disguise", point: 0, base: 5 },
  { name: "skill_Firearms(hg)", point: 0, base: 20 },
  { name: "skill_Firearms(r/s)", point: 0, base: 25 },
  { name: "skill_Survival()", point: 0, base: 10 },
  { name: "skill_Persuade", point: 0, base: 10 },
  { name: "skill_SleightofHand", point: 0, base: 10 },
  { name: "skill_Swim", point: 0, base: 20 },
  { name: "skill_Ride", point: 0, base: 5 },
  { name: "skill_Psychology", point: 0, base: 10 },
  { name: "skill_lang()", point: 0, base: 1 },
  { name: "skill_lang(mother)", point: 0, base: 0, motherTongue: 'EDUCATION' },
  { name: "skill_History", point: 0, base: 5 },
  { name: "skill_Locksmith", point: 0, base: 1 },
  { name: "skill_Art/Craft()", point: 0, base: 5 },
  { name: "skill_Climb", point: 0, base: 20 },
  { name: "skill_Occult", point: 0, base: 5 },
  { name: "skill_Intimidate", point: 0, base: 15 },
  { name: "skill_Stealth", point: 0, base: 10 },
  { name: "skill_FirstAid", point: 0, base: 30 },
  { name: "skill_Medicine", point: 0, base: 1 },
  { name: "skill_Anthropology", point: 0, base: 1 },
  { name: "skill_Drive", point: 0, base: 20 },
  { name: "skill_LibraryUse", point: 0, base: 20 },
  { name: "skill_NaturalWorld", point: 0, base: 10 },
  { name: "skill_Credit", point: 0, base: 0 },
  { name: "skill_ElecRepair", point: 0, base: 10 },
  { name: "skill_Electronics", point: 0, base: 1 },
  { name: "skill_Psychoanalysis", point: 0, base: 1 },
  { name: "skill_Pilot()", point: 0, base: 1 },
  { name: "skill_Heavyequipment", point: 0, base: 1 },
  { name: "skill_Track", point: 0, base: 10 },
  { name: "skill_ComUse", point: 0, base: 5 },
  { name: "skill_Throw", point: 0, base: 20 },
  { name: "skill_Navigate", point: 0, base: 10 },
  { name: "skill_Accounting", point: 0, base: 5 },
  { name: "skill_Dodge", point: 0, base: 0, evade: 'HALF_DEX' },
  { name: "skill_Extra1", point: 0, base: 1 },
];
