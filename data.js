/* =========================================================
 * 4학년 영어 · What time is it? · 데이터
 * - 핵심 표현: "What time is it?" / "It's ___ o'clock." / "It's time for ___."
 * - 하루 일과 문장 6개 (교과서 듣기 대본)
 *    🕗 8:00  아침 식사  It's 8 o'clock. It's time for breakfast.
 *    🕣 8:30  학교       It's eight thirty. It's time for school.
 *    🕘 9:00  수업       It's 9 o'clock. It's time for class.
 *    🕛 12:00 점심       It's 12 o'clock. It's time for lunch.
 *    🕕 6:00  저녁       It's 6 o'clock. It's time for dinner.
 *    🕤 10:30 잠자기     It's ten thirty. It's time for bed.
 * - 단어를 누르면 뜻·발음을 알 수 있어요.
 * ========================================================= */

/* ===== 묻는 말 (언제나 같아요) ===== */
const QUESTION = {
  en: "What time is it?",
  ko: "지금 몇 시예요?",
};

/* ===== 주제(시간 묶음) ===== */
const CATEGORIES = [
  { key: "all",    label: "🌈 하루 종일",        title: "하루 종일" },
  { key: "oclock", label: "🕐 정각 (o'clock)",   title: "정각" },
  { key: "half",   label: "🕧 30분 (thirty)",    title: "30분" },
];

/* ===== 시간 카드 =====
 * h, m    : 시계 바늘 위치 (시, 분)
 * digital : 시계 아래 디지털 표시
 * timeKo  : 시간 우리말
 * act     : 일과(영어)  /  actKo : 일과(우리말)  /  actEmoji : 일과 그림
 * en      : 따라 말할 답 문장 (정확도 측정 대상)
 * ko      : 우리말 뜻
 */
const SCENES = [
  { h: 8,  m: 0,  digital: "8:00",  timeKo: "8시",       act: "breakfast", actKo: "아침 식사", actEmoji: "🍳",
    en: "It's 8 o'clock. It's time for breakfast.", ko: "8시예요. 아침 먹을 시간이에요." },
  { h: 8,  m: 30, digital: "8:30",  timeKo: "8시 30분",  act: "school",    actKo: "학교",      actEmoji: "🏫",
    en: "It's eight thirty. It's time for school.", ko: "8시 30분이에요. 학교 갈 시간이에요." },
  { h: 9,  m: 0,  digital: "9:00",  timeKo: "9시",       act: "class",     actKo: "수업",      actEmoji: "📖",
    en: "It's 9 o'clock. It's time for class.",     ko: "9시예요. 수업할 시간이에요." },
  { h: 12, m: 0,  digital: "12:00", timeKo: "12시",      act: "lunch",     actKo: "점심",      actEmoji: "🍱",
    en: "It's 12 o'clock. It's time for lunch.",    ko: "12시예요. 점심 먹을 시간이에요." },
  { h: 6,  m: 0,  digital: "6:00",  timeKo: "6시",       act: "dinner",    actKo: "저녁",      actEmoji: "🍽️",
    en: "It's 6 o'clock. It's time for dinner.",    ko: "6시예요. 저녁 먹을 시간이에요." },
  { h: 10, m: 30, digital: "10:30", timeKo: "10시 30분", act: "bed",       actKo: "잠자기",    actEmoji: "🛏️",
    en: "It's ten thirty. It's time for bed.",      ko: "10시 30분이에요. 잘 시간이에요." },
];

/* ===== 단어 뜻 사전 ===== */
function wordKey(w) {
  return w.toLowerCase().replace(/^[^a-z0-9']+/, "").replace(/[^a-z0-9']+$/, "");
}

const WORD_MEANINGS = {
  // 핵심 표현
  "what": "무엇; (시간을 물을 때) 몇",
  "time": "시간, 시각",
  "is": "~이다, ~이에요",
  "it": "그것; (시간을 말할 때) 지금",
  "it's": "it is (지금 ~예요)",
  "o'clock": "정각, ~시",
  "for": "~을 위한, ~할 (시간)",
  // 숫자 (정각·시각)
  "8": "여덟 (8)",
  "eight": "여덟 (8)",
  "9": "아홉 (9)",
  "nine": "아홉 (9)",
  "10": "열 (10)",
  "ten": "열 (10)",
  "12": "열둘 (12시)",
  "twelve": "열둘 (12시)",
  "6": "여섯 (6)",
  "six": "여섯 (6)",
  "thirty": "삼십 (30분, 반)",
  "30": "삼십 (30분, 반)",
  // 하루 일과
  "breakfast": "아침 식사",
  "school": "학교",
  "class": "수업",
  "lunch": "점심 식사",
  "dinner": "저녁 식사",
  "bed": "침대; 잠자리 (time for bed: 잘 시간)",
};
