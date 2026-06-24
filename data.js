/* =========================================================
 * 4학년 영어 · What time is it? · 데이터
 * - 핵심 표현: "What time is it?" / "It's ___ o'clock." / "It's time for ___."
 * - 영어 수준이 낮은 학생을 위해 문장을 두 조각으로 나눠 익혀요.
 *    ① 시간 말하기   : It's 8 o'clock.       (🕐 시간 탭)
 *    ② 할 일 말하기   : It's time for breakfast. (🍽️ 할 일 탭)
 *    ③ 조합하기       : ①+② = It's 8 o'clock. It's time for breakfast.
 * - 단어를 누르면 뜻·발음을 알 수 있어요.
 * ========================================================= */

/* ===== 묻는 말 (언제나 같아요) ===== */
const QUESTION = {
  en: "What time is it?",
  ko: "지금 몇 시예요?",
};

/* ===== ① 시간 말하기 (It's ___ o'clock.) ===== */
const TIMES = [
  { h: 8,  m: 0,  digital: "8:00",  clockEmoji: "🕗", timeKo: "8시",
    en: "It's 8 o'clock.",   ko: "8시예요." },
  { h: 8,  m: 30, digital: "8:30",  clockEmoji: "🕣", timeKo: "8시 30분",
    en: "It's eight thirty.", ko: "8시 30분이에요." },
  { h: 9,  m: 0,  digital: "9:00",  clockEmoji: "🕘", timeKo: "9시",
    en: "It's 9 o'clock.",   ko: "9시예요." },
  { h: 12, m: 0,  digital: "12:00", clockEmoji: "🕛", timeKo: "12시",
    en: "It's 12 o'clock.",  ko: "12시예요." },
  { h: 6,  m: 0,  digital: "6:00",  clockEmoji: "🕕", timeKo: "6시",
    en: "It's 6 o'clock.",   ko: "6시예요." },
  { h: 10, m: 30, digital: "10:30", clockEmoji: "🕤", timeKo: "10시 30분",
    en: "It's ten thirty.",  ko: "10시 30분이에요." },
];

/* ===== ② 할 일 말하기 (It's time for ___.) ===== */
const ACTIVITIES = [
  { act: "breakfast", actKo: "아침 식사", actEmoji: "🍳",
    en: "It's time for breakfast.", ko: "아침 먹을 시간이에요." },
  { act: "school",    actKo: "학교",      actEmoji: "🏫",
    en: "It's time for school.",    ko: "학교 갈 시간이에요." },
  { act: "class",     actKo: "수업",      actEmoji: "📖",
    en: "It's time for class.",     ko: "수업할 시간이에요." },
  { act: "lunch",     actKo: "점심",      actEmoji: "🍱",
    en: "It's time for lunch.",     ko: "점심 먹을 시간이에요." },
  { act: "dinner",    actKo: "저녁",      actEmoji: "🍽️",
    en: "It's time for dinner.",    ko: "저녁 먹을 시간이에요." },
  { act: "bed",       actKo: "잠자기",    actEmoji: "🛏️",
    en: "It's time for bed.",       ko: "잘 시간이에요." },
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
