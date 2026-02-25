/**
 * 특기 정보를 표현하는 데이터 모델입니다.
 */
export interface Skill {
    name: string;
    base: number;
    index: number;
}


export interface Category {
    type: string;
    skill: Skill[];
}


/**
 * 인세인 봉마인이 사용 가능한 특기의 목록입니다.
 */
export const INITIAL_CATEGORY: Category[] = [
    {
        type: "ins_Violence",
        skill: [
            { name: "ins_skill_Incineration", base: 12, index: 1 },
            { name: "ins_skill_Torture", base: 12, index: 2 },
            { name: "ins_skill_Capture", base: 12, index: 3 },
            { name: "ins_skill_Threatening", base: 12, index: 4 },
            { name: "ins_skill_Destruction", base: 12, index: 5 },
            { name: "ins_skill_Beat", base: 12, index: 6 },
            { name: "ins_skill_Cut", base: 12, index: 7 },
            { name: "ins_skill_Stab", base: 12, index: 8 },
            { name: "ins_skill_Shooting", base: 12, index: 9 },
            { name: "ins_skill_War", base: 12, index: 10 },
            { name: "ins_skill_Burial", base: 12, index: 11 },
        ]
    }, {
        type: "ins_Emotion",
        skill: [
            { name: "ins_skill_Affection", base: 12, index: 1 },
            { name: "ins_skill_Joy", base: 12, index: 2 },
            { name: "ins_skill_Worry", base: 12, index: 3 },
            { name: "ins_skill_Shame", base: 12, index: 4 },
            { name: "ins_skill_Laughter", base: 12, index: 5 },
            { name: "ins_skill_Patience", base: 12, index: 6 },
            { name: "ins_skill_Surprised", base: 12, index: 7 },
            { name: "ins_skill_Anger", base: 12, index: 8 },
            { name: "ins_skill_Resentment", base: 12, index: 9 },
            { name: "ins_skill_Sadness", base: 12, index: 10 },
            { name: "ins_skill_Dear", base: 12, index: 11 },
        ]
    }, {
        type: "ins_Sense",
        skill: [
            { name: "ins_skill_Pain", base: 12, index: 1 },
            { name: "ins_skill_Sensuality", base: 12, index: 2 },
            { name: "ins_skill_Touch", base: 12, index: 3 },
            { name: "ins_skill_Smell", base: 12, index: 4 },
            { name: "ins_skill_Taste", base: 12, index: 5 },
            { name: "ins_skill_Sound", base: 12, index: 6 },
            { name: "ins_skill_Scenery", base: 12, index: 7 },
            { name: "ins_skill_Tracking", base: 12, index: 8 },
            { name: "ins_skill_Art", base: 12, index: 9 },
            { name: "ins_skill_SixthSense", base: 12, index: 10 },
            { name: "ins_skill_Shade", base: 12, index: 11 },
        ]
    }, {
        type: "ins_Technique",
        skill: [
            { name: "ins_skill_Decomposition", base: 12, index: 1 },
            { name: "ins_skill_ElectroDevices", base: 12, index: 2 },
            { name: "ins_skill_Arrangement", base: 12, index: 3 },
            { name: "ins_skill_Medicines", base: 12, index: 4 },
            { name: "ins_skill_Efficiency", base: 12, index: 5 },
            { name: "ins_skill_Media", base: 12, index: 6 },
            { name: "ins_skill_Camera", base: 12, index: 7 },
            { name: "ins_skill_Vehicle", base: 12, index: 8 },
            { name: "ins_skill_Machine", base: 12, index: 9 },
            { name: "ins_skill_Trap", base: 12, index: 10 },
            { name: "ins_skill_Weapon", base: 12, index: 11 },
        ]
    }
    , {
        type: "ins_Knowledge",
        skill: [
            { name: "ins_skill_Physics", base: 12, index: 1 },
            { name: "ins_skill_Mathematics", base: 12, index: 2 },
            { name: "ins_skill_Chemistry", base: 12, index: 3 },
            { name: "ins_skill_Biology", base: 12, index: 4 },
            { name: "ins_skill_MedicalScience", base: 12, index: 5 },
            { name: "ins_skill_Refinement", base: 12, index: 6 },
            { name: "ins_skill_Anthropology", base: 12, index: 7 },
            { name: "ins_skill_History", base: 12, index: 8 },
            { name: "ins_skill_Folklore", base: 12, index: 9 },
            { name: "ins_skill_Archaeology", base: 12, index: 10 },
            { name: "ins_skill_Astronomy", base: 12, index: 11 },
        ]
    }, {
        type: "ins_Strange",
        skill: [
            { name: "ins_skill_Time", base: 12, index: 1 },
            { name: "ins_skill_Chaos", base: 12, index: 2 },
            { name: "ins_skill_Deepsea", base: 12, index: 3 },
            { name: "ins_skill_Death", base: 12, index: 4 },
            { name: "ins_skill_Soul", base: 12, index: 5 },
            { name: "ins_skill_Magic", base: 12, index: 6 },
            { name: "ins_skill_Darkness", base: 12, index: 7 },
            { name: "ins_skill_TheEnd", base: 12, index: 8 },
            { name: "ins_skill_Dream", base: 12, index: 9 },
            { name: "ins_skill_Underground", base: 12, index: 10 },
            { name: "ins_skill_Cosmic", base: 12, index: 11 },
        ]
    }
]