# 🕐 What time is it? — 4학년 영어 듣고 따라 말하기

초등학교 4학년 영어 **"What time is it?"** 단원의 문장을 **듣고 따라 말하며 발음 정확도**를 측정해 보는 웹 앱입니다.
[`3th-grade-_-Do-you-like`](https://github.com/z2x3c4v5/3th-grade-_-Do-you-like) 페이지의 양식(무지개 테마·탭·음성 합성·정확도 측정)을 참고해 만들었습니다.

## 다루는 문장 (듣기 대본)

| 시계 | 시각 | 문장 |
|------|------|------|
| 🕗 | 8:00 | It's 8 o'clock. It's time for **breakfast**. |
| 🕣 | 8:30 | It's eight thirty. It's time for **school**. |
| 🕘 | 9:00 | It's 9 o'clock. It's time for **class**. |
| 🕛 | 12:00 | It's 12 o'clock. It's time for **lunch**. |
| 🕕 | 6:00 | It's 6 o'clock. It's time for **dinner**. |
| 🕤 | 10:30 | It's ten thirty. It's time for **bed**. |

묻는 말은 언제나 **"What time is it?"** 입니다.

## 주요 기능

- **🗣️ 듣고 따라하기 탭**
  - 바늘이 움직이는 **아날로그 시계**로 시각을 보여 줘요.
  - **🔊 듣기** 로 문장을, **🎧 묻고 답하기 전체 듣기** 로 질문+대답을 함께 들을 수 있어요. (Web Speech API)
  - 영어 낱말을 누르면 **발음과 뜻 풍선**이 나와요. (숫자 `8`, `o'clock` 등도 지원)
  - **🌈 하루 종일 / 🕐 정각 / 🕧 30분** 으로 문장을 묶어 볼 수 있어요.
  - **⭐ 연습 목록에 추가** 로 연습할 문장을 담아요.
- **🎤 정확도 연습 탭**
  - ⭐ 로 담은 문장을 **마이크로 따라 말하면** 발음 정확도를 **0~100%** 로 측정해요. (Web Speech API · 음성 인식)
  - **정확도 · 최고 점수 · 연습 횟수** 를 카드마다 기록해요.
  - `eight` ↔ `8` 처럼 숫자 말과 숫자를 같은 것으로 인식해 점수를 매겨요.
- **말하기 속도** 조절, 연습 기록 **자동 저장**(localStorage)

## 사용 방법

별도 설치 없이 `index.html` 을 브라우저에서 열면 됩니다.

```
git clone <repo>
cd 4th_What-Time-Is-It
# index.html 을 더블클릭하거나 아래처럼 간단한 서버로 열기
python3 -m http.server 8000   # http://localhost:8000
```

> 🎙️ 마이크 정확도 측정과 영어 음성은 **크롬(Chrome)** 에서 가장 잘 동작합니다. 마이크 권한을 허용해 주세요.

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 화면 구조 (탭·섹션) |
| `style.css` | 무지개 테마 스타일 · 아날로그 시계 |
| `data.js` | 문장·시각·단어 뜻 데이터 |
| `app.js` | 음성 합성/인식, 시계 그리기, 정확도 채점 로직 |
