/* =========================================================
 * 4학년 영어 · What time is it? · 듣고 따라 말하기 웹 앱
 * - 음성 출력 : Web Speech API (SpeechSynthesis)
 * - 단어 클릭 : 발음 + 뜻 풍선
 * - 시간 말하기 / 할 일 말하기 / 조합하기 / 정확도 연습
 * ========================================================= */

/* ---------- 음성 합성 (TTS) ---------- */
const synth = window.speechSynthesis;
let enVoice = null;
let speakRate = 0.85;

function pickVoice() {
  const voices = synth.getVoices();
  enVoice =
    voices.find(v => /en[-_]US/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null;
  const status = document.querySelector(".toolbar #voice-status");
  if (status) status.textContent = enVoice ? `음성: ${enVoice.name}` : "영어 음성을 찾는 중...";
}
pickVoice();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

function speak(text, rate, onStart, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate || speakRate;
  u.pitch = 1.08;
  if (enVoice) u.voice = enVoice;
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
}

/* ---------- 단어 뜻 풍선 ---------- */
const popup = document.createElement("div");
popup.className = "word-popup hidden";
popup.innerHTML = `
  <div class="wp-word"></div>
  <div class="wp-meaning"></div>
  <button class="wp-listen">단어 다시 듣기</button>`;
document.body.appendChild(popup);

popup.querySelector(".wp-listen").addEventListener("click", e => {
  e.stopPropagation();
  if (popup.dataset.word) speak(popup.dataset.word, 0.8);
});

function showWordPopup(wordEl, rawWord) {
  const key = wordKey(rawWord);
  const meaning = WORD_MEANINGS[key] || "(뜻 정보 없음)";
  popup.dataset.word = key || rawWord;
  popup.querySelector(".wp-word").textContent = rawWord.replace(/[.,!?]+$/, "");
  popup.querySelector(".wp-meaning").textContent = meaning;

  popup.classList.remove("hidden");
  const r = wordEl.getBoundingClientRect();
  const pw = popup.offsetWidth;
  let left = r.left + r.width / 2 - pw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  popup.style.left = left + "px";
  popup.style.top = r.bottom + 8 + window.scrollY + "px";

  speak(key || rawWord, 0.8);
}
function hidePopup() { popup.classList.add("hidden"); }
document.addEventListener("click", e => {
  if (!popup.contains(e.target) && !e.target.classList.contains("word")) hidePopup();
});

/* ---------- 클릭 가능한 단어로 문장 만들기 ---------- */
function buildWords(sentence) {
  const frag = document.createDocumentFragment();
  sentence.split(/\s+/).forEach((w, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    span.addEventListener("click", e => { e.stopPropagation(); showWordPopup(span, w); });
    frag.appendChild(span);
  });
  return frag;
}

/* ---------- 그림(시계) ---------- */
/* 아날로그 시계 그리기 : 시·분 바늘을 각도로 회전 */
function makeClock(h, m) {
  const wrap = document.createElement("div");
  wrap.className = "clock";

  const face = document.createElement("div");
  face.className = "clock-face";
  [["num12", "12"], ["num3", "3"], ["num6", "6"], ["num9", "9"]].forEach(([cls, n]) => {
    const num = document.createElement("span");
    num.className = "num " + cls;
    num.textContent = n;
    face.appendChild(num);
  });

  const hourDeg = ((h % 12) + m / 60) * 30;   // 한 시간당 30도
  const minDeg = m * 6;                        // 1분당 6도
  const hour = document.createElement("div");
  hour.className = "hand hour";
  hour.style.transform = `rotate(${hourDeg}deg)`;
  const min = document.createElement("div");
  min.className = "hand minute";
  min.style.transform = `rotate(${minDeg}deg)`;
  const center = document.createElement("div");
  center.className = "center";
  face.append(hour, min, center);

  const digital = document.createElement("div");
  digital.className = "clock-digital";
  digital.textContent = h + ":" + (m < 10 ? "0" + m : m);

  wrap.append(face, digital);
  return wrap;
}

/* 카드 그림 요소 : 시간 정보가 있으면 시계, 없으면 이모지 */
function makeVisual(item) {
  if (item.h != null && item.m != null) {
    const box = document.createElement("div");
    box.className = "visual";
    box.appendChild(makeClock(item.h, item.m));
    if (item.actEmoji) {
      const badge = document.createElement("div");
      badge.className = "act-emoji";
      badge.textContent = item.actEmoji;
      box.appendChild(badge);
    }
    return box;
  }
  const em = document.createElement("div");
  em.className = "emoji";
  em.textContent = item.emoji || item.actEmoji || "🕰️";
  return em;
}

/* =========================================================
 * 연습 목록 (⭐로 담은 문장)
 * ========================================================= */
let selected = new Map();
try { (JSON.parse(localStorage.getItem("wti_selected") || "[]") || []).forEach(it => selected.set(it.en, it)); } catch (e) {}
function persistSelected() { try { localStorage.setItem("wti_selected", JSON.stringify([...selected.values()])); } catch (e) {} }
function isSelected(en) { return selected.has(en); }
function toggleSelect(item) {
  if (selected.has(item.en)) selected.delete(item.en);
  else selected.set(item.en, item);
  persistSelected();
  updatePracticeBadge();
  refreshSources();
  if (document.getElementById("tab-practice").classList.contains("active")) renderPractice();
}
function updatePracticeBadge() {
  const c = document.getElementById("practice-count");
  if (c) c.textContent = selected.size;
}
/* ⭐ 버튼(연습 목록에 담기) 만들기 */
function makeSelectBtn(item) {
  const sel = document.createElement("button");
  sel.className = "select-btn";
  const on = isSelected(item.en);
  sel.classList.toggle("on", on);
  sel.textContent = on ? "✓ 담음 — 눌러서 빼기" : "⭐ 연습 목록에 추가";
  sel.addEventListener("click", e => { e.stopPropagation(); toggleSelect(item); });
  return sel;
}

/* =========================================================
 * 1) 시간 말하기  (It's ___ o'clock.)
 * ========================================================= */
function makeQuestionCard() {
  const div = document.createElement("div");
  div.className = "card qcard";

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = "묻는 말";
  top.append(tag);

  const icon = document.createElement("div");
  icon.className = "emoji";
  icon.textContent = "🕰️";

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(QUESTION.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = QUESTION.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "묻는 말 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(QUESTION.en, null, () => div.classList.add("speaking"), () => div.classList.remove("speaking"));
  });
  box.append(txt, speakBtn);

  div.append(top, icon, box, makeSelectBtn({ en: QUESTION.en, ko: QUESTION.ko, emoji: "🕰️", word: "묻는 말" }));
  return div;
}

function makeAnswerCard(item, tone, opts) {
  opts = opts || {};
  const div = document.createElement("div");
  div.className = "card tone-" + (tone % 6);

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = opts.tag || "";
  top.append(tag);

  const visual = makeVisual(item);

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "문장 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(item.spoken || item.en, null, () => div.classList.add("speaking"), () => div.classList.remove("speaking"));
  });
  box.append(txt, speakBtn);

  div.append(top, visual, box, makeSelectBtn(opts.practiceItem || item));
  return div;
}

function renderTime() {
  document.getElementById("question-card").replaceChildren(makeQuestionCard());
  const grid = document.getElementById("time-grid");
  grid.innerHTML = "";
  TIMES.forEach((t, i) => {
    const practiceItem = { en: t.en, spoken: t.spoken, ko: t.ko, h: t.h, m: t.m, word: t.timeKo };
    grid.appendChild(makeAnswerCard(t, i, { tag: t.clockEmoji + " " + t.timeKo, practiceItem }));
  });
}

/* =========================================================
 * 2) 할 일 말하기  (It's time for ___.)
 * ========================================================= */
function renderAct() {
  const grid = document.getElementById("act-grid");
  grid.innerHTML = "";
  ACTIVITIES.forEach((a, i) => {
    const item = { en: a.en, ko: a.ko, emoji: a.actEmoji };
    const practiceItem = { en: a.en, ko: a.ko, emoji: a.actEmoji, word: a.actKo };
    grid.appendChild(makeAnswerCard(item, i, { tag: a.actEmoji + " " + a.actKo, practiceItem }));
  });
}

/* =========================================================
 * 3) 조합하기  (시간 + 할 일)
 * ========================================================= */
let selTimeIdx = null;
let selActIdx = null;

function stripLead(en, lead) { return en.replace(lead, "").replace(/\.$/, ""); }

function renderCombine() {
  // ① 시간 칩 (누른 칩을 다시 누르면 선택이 취소돼요)
  const timeRow = document.getElementById("combine-times");
  timeRow.innerHTML = "";
  TIMES.forEach((t, i) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (i === selTimeIdx ? " active" : "");
    chip.innerHTML = `<span class="chip-emoji">${t.clockEmoji}</span><span class="chip-label">${stripLead(t.en, /^It's\s*/)}</span>`;
    chip.addEventListener("click", () => {
      selTimeIdx = (selTimeIdx === i) ? null : i;
      synth.cancel(); hidePopup(); renderCombine();
      if (selTimeIdx === i) speak(t.spoken || t.en, 0.85);
    });
    timeRow.appendChild(chip);
  });

  // ② 할 일 칩 (누른 칩을 다시 누르면 선택이 취소돼요)
  const actRow = document.getElementById("combine-acts");
  actRow.innerHTML = "";
  ACTIVITIES.forEach((a, i) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (i === selActIdx ? " active" : "");
    chip.innerHTML = `<span class="chip-emoji">${a.actEmoji}</span><span class="chip-label">${stripLead(a.en, /^It's time for\s*/)}</span>`;
    chip.addEventListener("click", () => {
      selActIdx = (selActIdx === i) ? null : i;
      synth.cancel(); hidePopup(); renderCombine();
      if (selActIdx === i) speak(a.en, 0.85);
    });
    actRow.appendChild(chip);
  });

  // 미리보기
  const prev = document.getElementById("combine-preview");
  prev.innerHTML = "";
  if (selTimeIdx == null || selActIdx == null) {
    const hint = document.createElement("div");
    hint.className = "combine-hint";
    hint.innerHTML = "위에서 <b>시간</b>과 <b>할 일</b>을 하나씩 골라보세요! 🧩";
    prev.appendChild(hint);
    return;
  }

  const t = TIMES[selTimeIdx], a = ACTIVITIES[selActIdx];
  // 시간대가 맞는 짝만 조합할 수 있어요 (예: 8시에 저녁 ❌)
  const valid = t.min24 >= a.okFrom && t.min24 <= a.okTo;
  const en = t.en + " " + a.en;
  const spoken = (t.spoken || t.en) + " " + a.en;
  const ko = t.ko + " " + a.ko;

  const div = document.createElement("div");
  div.className = "card preview-card" + (valid ? "" : " invalid");

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = t.clockEmoji + " " + t.timeKo + " · " + a.actEmoji + " " + a.actKo;
  top.append(tag);

  const visual = makeVisual({ h: t.h, m: t.m, actEmoji: a.actEmoji });

  // 어울리지 않는 짝이면 안내만 보여주고 연습 목록에 담을 수 없어요
  if (!valid) {
    const warn = document.createElement("div");
    warn.className = "combine-warn";
    warn.innerHTML = `🤔 <b>${t.timeKo}</b>에 <b>${a.actKo}</b>? 어울리는 짝이 아니에요!<br>시간이나 할 일을 다시 골라보세요.`;
    div.append(top, visual, warn);
    prev.appendChild(div);
    return;
  }

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const ask = document.createElement("div");
  ask.className = "ask";
  ask.textContent = "🗣️ " + QUESTION.en;
  const enEl = document.createElement("div");
  enEl.className = "en";
  enEl.appendChild(buildWords(en));
  const koEl = document.createElement("div");
  koEl.className = "ko";
  koEl.textContent = ko;
  txt.append(ask, enEl, koEl);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "문장 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(spoken, null, () => div.classList.add("speaking"), () => div.classList.remove("speaking"));
  });
  box.append(txt, speakBtn);

  // 전체 대화 듣기 (What time is it? + 조합 문장)
  const dialogBtn = document.createElement("button");
  dialogBtn.className = "dialog-btn";
  dialogBtn.textContent = "🎧 묻고 답하기 전체 듣기";
  dialogBtn.addEventListener("click", e => {
    e.stopPropagation();
    speak(QUESTION.en + " " + spoken, null, () => div.classList.add("speaking"), () => div.classList.remove("speaking"));
  });

  const practiceItem = { en, spoken, ko, h: t.h, m: t.m, actEmoji: a.actEmoji, word: t.digital + " · " + a.actKo };
  div.append(top, visual, box, dialogBtn, makeSelectBtn(practiceItem));
  prev.appendChild(div);
}

/* 시간·할 일·조합 화면의 ⭐ 상태를 새로고침 */
function refreshSources() {
  renderTime();
  renderAct();
  renderCombine();
}

/* =========================================================
 * 4) 정확도 연습 (마이크 정확도)
 * ========================================================= */
let stats = {};
try { stats = JSON.parse(localStorage.getItem("wti_stats") || "{}") || {}; } catch (e) {}
function saveStats() { try { localStorage.setItem("wti_stats", JSON.stringify(stats)); } catch (e) {} }

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const srSupported = !!SR;
let rec = srSupported ? new SR() : null;
if (rec) { rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; }
let recBusy = false;

/* 숫자 말(eight)과 숫자(8)를 같은 것으로 맞춰주기 */
const NUM_WORDS = {
  one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
  thirty: "30",
};
function normalize(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(w => NUM_WORDS[w] || w)
    .join(" ");
}
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordsClose(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  return Math.abs(a.length - b.length) <= 1 && levenshtein(a, b) <= 1;
}
const STOPWORDS = new Set(["a", "an", "the", "to", "of", "on", "in", "at", "for", "but", "i", "it's", "it", "is"]);
function scoreMatch(target, heard) {
  const t = normalize(target).split(" ").filter(Boolean);
  const h = normalize(heard).split(" ").filter(Boolean);
  if (!h.length) return 0;
  let content = t.filter(w => !STOPWORDS.has(w));
  if (!content.length) content = t;
  // recall : 정답의 핵심 단어를 얼마나 말했나 (관대하게 평가)
  let hit = 0;
  content.forEach(w => { if (h.some(x => wordsClose(x, w))) hit++; });
  const recall = hit / content.length;
  // precision : 내가 말한 단어 중 정답에 있는 단어의 비율
  let good = 0;
  h.forEach(x => { if (t.some(w => wordsClose(x, w))) good++; });
  const precision = good / h.length;
  let score = recall * (0.6 + 0.4 * precision);
  if (recall >= 0.5 && precision >= 0.75) score = Math.min(1, score + 0.1);
  return score;
}
/* 음성 인식 결과를 보기 좋게 다듬기 (대·소문자 + 문장부호) */
function prettyHeard(text, target) {
  let s = (text || "").trim().toLowerCase();
  if (!s) return "";
  s = s.replace(/\bi\b/g, "I").replace(/\bi'(\w+)/g, "I'$1");
  s = s.replace(/\bit's\b/g, "It's");
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!/[.?!]$/.test(s)) s += /\?\s*$/.test(target || "") ? "?" : ".";
  return s;
}

function practiceAttempt(target, cb) {
  if (!rec || recBusy) { cb.onend && cb.onend(); return; }
  recBusy = true;
  let score = 0, heard = "", errCode = null;
  rec.onresult = e => {
    const alts = e.results[0];
    for (let i = 0; i < alts.length; i++) {
      const s = scoreMatch(target, alts[i].transcript);
      if (s > score) { score = s; heard = alts[i].transcript; }
    }
  };
  rec.onerror = ev => { errCode = ev.error; };
  rec.onend = () => {
    recBusy = false;
    if (errCode && score === 0) cb.onerror && cb.onerror(errCode);
    else cb.onresult && cb.onresult(Math.round(score * 100), heard);
    cb.onend && cb.onend();
  };
  try { rec.start(); } catch (e) { recBusy = false; cb.onend && cb.onend(); }
}

function makePracticeCard(item) {
  const div = document.createElement("div");
  div.className = "card pcard";

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = item.word || "";
  const remove = document.createElement("button");
  remove.className = "premove";
  remove.setAttribute("aria-label", "목록에서 빼기");
  remove.textContent = "✕";
  remove.addEventListener("click", () => {
    selected.delete(item.en);
    persistSelected();
    updatePracticeBadge();
    renderPractice();
    refreshSources();
  });
  top.append(tag, remove);

  const visual = makeVisual(item);

  const box = document.createElement("div");
  box.className = "q-box";
  const txt = document.createElement("div");
  txt.className = "q-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", () => speak(item.spoken || item.en));
  box.append(txt, speakBtn);

  const micArea = document.createElement("div");
  micArea.className = "mic-area";
  const mic = document.createElement("button");
  mic.className = "mic-btn";
  mic.setAttribute("aria-label", "말하기");
  mic.textContent = "🎙️";
  const micLabel = document.createElement("div");
  micLabel.className = "mic-label";
  micLabel.textContent = "마이크를 누르고 말해보세요";
  micArea.append(mic, micLabel);

  const statsEl = document.createElement("div");
  statsEl.className = "pstats";
  const fb = document.createElement("div");
  fb.className = "mic-feedback";

  function renderStats(last) {
    const s = stats[item.en] || { attempts: 0, best: 0 };
    statsEl.innerHTML =
      `정확도 <b class="acc">${last != null ? last + "%" : "--"}</b>` +
      ` · 최고 <b class="best">${s.best ? s.best + "%" : "--"}</b>` +
      ` · 연습 <b>${s.attempts}</b>회`;
  }
  renderStats(null);

  if (!srSupported) { mic.disabled = true; mic.title = "이 브라우저는 음성 인식을 지원하지 않아요 (크롬 권장)"; }

  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording");
    micLabel.textContent = "🔴 녹음 중... 말해보세요";
    fb.textContent = "또박또박 말해보세요!";
    fb.className = "mic-feedback";
    practiceAttempt(item.en, {
      onresult: (score, heard) => {
        const s = stats[item.en] || { attempts: 0, best: 0 };
        s.attempts++; s.best = Math.max(s.best, score);
        stats[item.en] = s; saveStats();
        renderStats(score);
        const shown = prettyHeard(heard, item.en);
        if (score >= 70) { fb.className = "mic-feedback good"; fb.innerHTML = `⭐ 훌륭해요! (${score}%)<br><span class="heard">내 발음: ${shown}</span>`; }
        else if (score >= 40) { fb.className = "mic-feedback good"; fb.innerHTML = `👍 좋아요! 한 번 더! (${score}%)<br><span class="heard">내 발음: ${shown}</span>`; }
        else { fb.className = "mic-feedback bad"; fb.innerHTML = `🔁 다시 또박또박! (${score}%)<br><span class="heard">내 발음: ${shown || "(못 들었어요)"}</span>`; }
      },
      onerror: err => {
        fb.className = "mic-feedback bad";
        fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요.";
      },
      onend: () => { mic.classList.remove("recording"); micLabel.textContent = "마이크를 누르고 말해보세요"; }
    });
  });

  div.append(top, visual, box, micArea, statsEl, fb);
  return div;
}

function renderPractice() {
  const list = document.getElementById("practice-list");
  const empty = document.getElementById("practice-empty");
  const items = [...selected.values()];
  if (!items.length) {
    empty.style.display = "block";
    list.innerHTML = "";
    updatePracticeBadge();
    return;
  }
  empty.style.display = "none";
  list.innerHTML = "";
  items.forEach(it => list.appendChild(makePracticeCard(it)));
  updatePracticeBadge();
}

/* ---------- 말하기 속도 ---------- */
document.getElementById("rate").addEventListener("input", e => { speakRate = parseFloat(e.target.value); });

/* ---------- 탭 전환 ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById("tab-" + tab).classList.add("active");
    synth.cancel(); hidePopup();
    if (tab === "practice") renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 첫 화면 ---------- */
renderTime();
renderAct();
renderCombine();
updatePracticeBadge();
