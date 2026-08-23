# WordJail – Product Requirements Document

**Version:** 1.0  
**Date:** 2026-05-27  
**Author:** Research & Design  
**Status:** Draft  

---

## 1. Executive Summary

WordJail là ứng dụng học từ vựng tiếng Anh sử dụng chiến lược **"học bằng cách không có lựa chọn"**.  
Thay vì dựa vào motivation của user, app tạo ra friction có chủ đích: user phải trả lời đúng mới được tiếp tục dùng điện thoại bình thường.

**Core insight:** Habit formation works best when the cost of NOT doing is higher than doing.

---

## 2. Problem Statement

- User download app học tiếng Anh → dùng 3 ngày → bỏ.
- Lý do: thiếu consistency, không có accountability mechanism.
- Hiện tại: Duolingo dùng streak + notification nhưng dễ bị dismiss.
- **Gap:** Không có app nào thực sự "force" user phải học.

---

## 3. Target Users

| Segment | Đặc điểm | Nhu cầu |
|---|---|---|
| TOEIC preppers | Đang ôn thi, cần 700+ | Học đúng từ, track progress |
| IELTS learners | Target band 6.5–7.5 | Academic vocab, consistency |
| Self-learners | Muốn cải thiện tiếng Anh | Flexible, không boring |
| Busy professionals | Ít thời gian, nhiều việc | Micro-learning, passive |

---

## 4. Core Features

### 4.1 Lock Screen Widget

- **iOS:** WidgetKit (iOS 16+), Live Activities  
- **Android:** Custom overlay, Always-on display support  
- Hiển thị: từ vựng, phiên âm, nghĩa ngắn gọn  
- Action: nút nghe audio, nút shortcut luyện tập  

### 4.2 Popup System (Force Complete)

Popup xuất hiện theo lịch (mỗi 1h / 2h / 4h). User **KHÔNG thể dismiss**.

**Bước 1 – Spelling**
- Gõ lại từ vựng bằng bàn phím in-app
- Sai → rung, highlight đỏ → retry
- Sau 2 lần sai → hiện gợi ý chữ cái đầu
- Đúng → chuyển bước 2 tự động

**Bước 2 – Pronunciation**
- Nhấn giữ mic, đọc to từ vựng
- Speech recognition so sánh với phonetic chuẩn
- Accept nếu >= 70% similarity score
- Skip: tối đa 3 lần/ngày

**Bước 3 – Quiz**
- Multiple choice 4 đáp án
- Chọn sai → lock đáp án đó, thử tiếp
- Chọn đúng → completion animation + XP reward

### 4.3 Vocabulary Library

Built-in packages:

| Package | Số từ | Mô tả |
|---|---|---|
| TOEIC 700 | 700 | Theo topic: Business, HR, Finance, Logistics, Marketing |
| IELTS Academic | 3000 | Oxford Academic Word List + IELTS specific |
| Slang & Idioms | 200 | US/UK informal, phim, podcast |
| Business English | 500 | Email, meeting, presentation |
| Oxford 5000 | 5000 | Phân cấp A1→C2 theo CEFR |

Import:
- CSV: `word, definition, example, phonetic, difficulty`
- Anki deck (`.apkg`)
- JSON (custom format)
- Share pack: export JSON → share với friends

### 4.4 Spaced Repetition

- Algorithm: **SM-2** (SuperMemo 2)
- Mỗi từ có `interval` (ngày) và `easiness factor` (EF)
- Trả lời đúng → interval tăng (ít gặp lại hơn)
- Trả lời sai → reset interval (gặp lại sớm hơn)
- Word queue mỗi ngày dựa trên due date

### 4.5 Gamification

| Feature | Mô tả |
|---|---|
| Streak | Chuỗi ngày liên tiếp hoàn thành ít nhất 1 popup |
| XP | +10 spelling, +5 pronunciation, +15 quiz đúng lần đầu |
| Word Debt | Bỏ lỡ popup → nợ lại, trả trước khi mở tính năng |
| Boss Mode | Cuối tuần có mini-test 10 từ từ tuần qua |
| Combo | Trả lời nhanh + đúng → XP multiplier |

---

## 5. Technical Architecture

### 5.1 Platform

- **Primary:** Flutter (cross-platform iOS + Android)
- **Web mockup:** HTML/CSS/JS (prototype hiện tại)
- **Minimum:** iOS 15+, Android 8+

### 5.2 Tech Stack

| Layer | Technology |
|---|---|
| UI | Flutter + Material 3 |
| State | Riverpod / Bloc |
| Local DB | SQLite (drift / isar) |
| Speech | `speech_to_text` package |
| Audio | `audioplayers` package |
| Notifications | `flutter_local_notifications` |
| Lock Screen Android | `android_alarm_manager_plus` + overlay |
| Lock Screen iOS | WidgetKit via `flutter_widgetkit` |
| Analytics | Firebase Analytics |
| Crash reporting | Firebase Crashlytics |

### 5.3 Data Models

```dart
class Word {
  String id;           // UUID
  String term;
  String phonetic;
  String partOfSpeech;
  String definitionVI;
  String example;
  String audioUrl;
  String packId;
  int difficulty;      // 1–5
}

class UserWordProgress {
  String wordId;
  int interval;           // days
  double easinessFactor;  // SM-2 EF, starts at 2.5
  int repetitions;
  DateTime nextReviewDate;
  int totalCorrect;
  int totalAttempts;
}

class PopupSession {
  String id;
  String wordId;
  DateTime scheduledAt;
  DateTime? completedAt;
  bool spellCorrect;
  bool pronounceSkipped;
  bool quizCorrect;
  int xpEarned;
}
```

---

## 6. UX Principles

1. **Unavoidable friction:** Popup không có nút X thật. User phải hoàn thành.
2. **Progressive difficulty:** Từ dễ trước, tăng dần theo kết quả quiz.
3. **Micro moments:** Mỗi popup mất <2 phút. Không chiếm quá nhiều thời gian.
4. **Transparency:** User biết rõ lịch popup, có thể điều chỉnh.
5. **Grace period:** Giờ nghỉ ngơi (22h–7h) không có popup.

---

## 7. MVP Scope

### Phase 1 (2–3 tuần)
- [x] CRUD từ vựng + SQLite
- [x] Built-in pack TOEIC 700
- [x] Popup 3 bước (spell + mic simulation + quiz)
- [x] Local notification scheduler
- [x] Streak counter

### Phase 2 (2 tuần)
- [ ] Speech recognition tích hợp thật
- [ ] Spaced repetition SM-2
- [ ] Stats & analytics screen
- [ ] Import CSV

### Phase 3
- [ ] Lock screen widget (Android trước)
- [ ] Lock screen widget (iOS WidgetKit)
- [ ] Import Anki `.apkg`
- [ ] Share vocabulary pack
- [ ] Boss Mode weekend test

---

## 8. Success Metrics

| Metric | Target Month 1 | Target Month 3 |
|---|---|---|
| D7 Retention | 40% | 55% |
| Avg popup completion rate | 70% | 85% |
| Words learned per user/day | 3 | 5 |
| 7-day streak rate | 30% | 45% |
| Avg session duration | 90s | 90s |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| iOS lock screen restrictions | High | Android-first, iOS widget fallback |
| User uninstall due to annoyance | Medium | Grace period, cooldown tuning |
| Speech recognition accuracy | Medium | Allow skip, lower threshold |
| Vocabulary copyright | Low | Use public domain (Oxford open lists) |

---

## 10. Open Questions

1. Có nên có "gentle mode" cho user không muốn popup quá gắt?
2. Có nên có subscription model cho built-in packs premium?
3. Social features: leaderboard với friends?
4. TTS audio tự tạo hay mua audio gốc?

---

*WordJail Research & Design · 2026-05-27*
