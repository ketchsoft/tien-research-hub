# CoachLink — Product Requirements Document

**Version:** 2.0  
**Date:** 2026-05-27  
**Status:** Active  
**Mockup:** `/pt-app` (streak-habit-mvp.web.app/pt-app)

---

## 1. Executive Summary

CoachLink is a two-sided platform connecting Personal Trainers (PT) with clients. The app lets PTs manage clients professionally and lets clients find a trusted PT — all through in-app chat, video call, and a scheduled-message system.

**Phase 1 positioning:** Free for both PTs and clients to remove all friction and grow supply/demand simultaneously.

---

## 2. Problem Statement

### Client side
- Hard to find a credible PT — lack of transparency on qualifications and pricing
- Real PT sessions are expensive (500K–2M VND/session) and hard to access daily
- Fragmented tools: Zalo for chat, Zoom for calls, Google Sheets for plans

### PT side
- Managing many clients scattered across Zalo, Facebook — unprofessional and inefficient
- Sending reminder messages manually to each client wastes hours per week
- No unified tool for scheduling, progress tracking, or structured feedback

---

## 3. Users

| Role | Profile | Core Need |
|---|---|---|
| Client | 20–40 y/o, wants to train correctly | Find a trusted PT, easy communication |
| PT | Freelance or gym-based trainer | Manage clients professionally, save time |

---

## 4. Screen Map

The mockup has **8 screens** split into two views (Client / PT).

### CLIENT VIEW

---

#### S0 — Discover PT
*Entry point for clients. Browse and filter the PT list.*

**Features:**
- Search by name or specialty (strength, weight loss, yoga, cardio, calisthenics)
- Filter chips: Tất cả / Giảm cân / Tăng cơ / Yoga / Cardio / Calisthenics
- PT cards showing: avatar, name, specialty, years of experience, rating, review count
- Online status dot (green = available now)
- FREE badge — reinforces zero barrier to connect in Phase 1

**Tech stack:**
| Package | Role |
|---|---|
| `cloud_firestore` | Stream PT list with filters |
| `firebase_storage` | Load PT avatars |
| `algolia_helper_flutter` | Full-text search *(optional, Phase 2)* |
| `cached_network_image` | Avatar caching |

---

#### S1 — PT Profile
*Detailed profile view. Trust-building before connecting.*

**Features:**
- Cover photo + large avatar
- Certification badge (ISSA, ACE, NASM…) + ✅ Verified tick (unlocked after S7 verification)
- Stats row: review count · average rating · active client count
- Personal bio
- Specialty chips (e.g. 💪 Tăng cơ, 🔥 Giảm mỡ, 🍗 Dinh dưỡng)
- Availability slots — client sees open time slots without messaging
- Recent reviews (unfiltered — no hiding negative feedback)
- Action buttons: 💬 Chat → S2 · "Kết nối miễn phí" → S6

**Tech stack:**
| Package | Role |
|---|---|
| `cloud_firestore` | Fetch profile doc + reviews sub-collection |
| `firebase_storage` | Cover photo, certification image |
| `cloud_functions` | Trigger verified badge when verification approved |
| `url_launcher` | Share profile link |

---

#### S2 — Chat (PT ↔ Client)
*1-on-1 real-time messaging. Core communication channel.*

**Features:**
- Direct messaging with text, images, files (PDF workout plans, diet sheets)
- Read receipts
- Scheduled message preview in thread — dashed yellow border, shows content + send time
- Video call quick-launch button in header (→ S3)
- File sharing: PT sends plans; client sends check-in photos and workout logs
- Inline message reactions

**Third-party SDK decision: Stream Chat**
- Package: `stream_chat_flutter`
- Reason: prebuilt `ChannelListView` + `MessageListView` + `MessageInput` widgets; ships in ~4 hours vs 2–3 days DIY with Firestore
- Free tier: 5 MAU → $99/mo at 100 MAU
- Scale escape hatch: if cost becomes an issue, abstract a `ChatService` interface from day one and migrate to Firestore DIY later

**Tech stack:**
| Package | Role |
|---|---|
| `stream_chat_flutter` | All messaging UI + real-time delivery |
| `firebase_storage` | File/image attachment upload |
| `image_picker` | Pick photo or video to send |
| `open_filepicker` | Pick PDF workout plans |

---

#### S3 — Video Call
*Live 1-on-1 PT session. PT reviews form in real time.*

**Features:**
- Full-screen video call with self-view PiP (top-right)
- Session duration timer with recording indicator (blinking red dot)
- Trainer note overlay: "PT đang review form squat của bạn qua camera"
- Controls: mute · camera toggle · end call · in-call chat · more options
- Screen share: PT can share demo videos or diagrams
- Cloud recording: session replay saved and linked to session log in Firestore
- End call → auto-creates session log entry

**Third-party SDK decision: Agora RTC Engine**
- Package: `agora_rtc_engine: ^6.3.0`
- Reason: best Flutter SDK for video, native performance, <80ms latency, AI noise suppression built-in, 10K free minutes/month
- Token must be generated server-side via Cloud Function — never expose App ID secret on the client
- Alternative: `hmssdk_flutter` (100ms) — cleaner DX but 2× the per-minute cost at scale

**Tech stack:**
| Package | Role |
|---|---|
| `agora_rtc_engine: ^6.3.0` | Core video call |
| `cloud_functions` | Generate Agora RTC token server-side |
| `permission_handler` | Camera + microphone permissions |
| `wakelock_plus` | Keep screen on during call |
| `cloud_firestore` | Save session log after call ends |

---

### PT VIEW

---

#### S4 — PT Dashboard
*PT's daily operations hub.*

**Features:**
- ⚠️ Unverified banner (visible until S7 complete) — taps through to S7
- Stats row: active client count · video sessions today · pending scheduled messages
- Recent messages inbox: client name, last message preview, timestamp, unread dot
- Scheduled messages panel: recipient → message preview → send time
- Quick action: "+ Tạo tin nhắn hẹn giờ" → S5

**Tech stack:**
| Package | Role |
|---|---|
| `stream_chat_flutter` | Unread counts + inbox list |
| `cloud_firestore` | Stats aggregation + scheduled message list |
| `firebase_messaging` | Incoming message push badge |
| `fl_chart` | Optional: mini revenue/activity chart |

---

#### S5 — Schedule Message
*PT batches reminder messages in advance for one or many clients.*

**Features:**
- Multi-recipient selector: pick individual clients or all-clients broadcast
- Free-form message compose (textarea)
- Quick templates: 📋 Nhắc tập · 🍗 Nhắc ăn protein · ⚖️ Nhắc check-in · 💪 Động viên
- Time picker: Sáng mai 7:00 SA · Tối nay 8:00 CH · Custom date/time
- Live preview of the message before scheduling
- Success confirmation: "✅ Đã lên lịch! Tin sẽ gửi lúc …"

**How it works (backend):**
1. PT submits → Firestore creates `scheduledMessages/{id}` doc with `sendAt` timestamp
2. Cloud Scheduler fires a Cloud Function at `sendAt`
3. Cloud Function delivers via Stream Chat channel + sends FCM push to client

**Tech stack:**
| Package | Role |
|---|---|
| `cloud_firestore` | Persist scheduled message doc |
| Cloud Scheduler | Cron trigger at exact send time |
| Cloud Functions | Execute delivery at send time |
| `stream_chat_flutter` | Deliver message to channel |
| `firebase_messaging` | FCM push to client device |

---

#### S6 — Onboarding / Role Selection
*First screen. Fork flow immediately by role.*

**Features:**
- CoachLink logo + tagline
- Role cards: 👤 Tôi là Client · 🏋️ Tôi là Personal Trainer
- FREE banner: "Miễn phí hoàn toàn — không cần thẻ tín dụng"
- Single CTA: "Bắt đầu ngay →"
- Sign-in link for returning users

**UX notes:**
- Minimal friction — no long form on first screen; collect info progressively inside the app
- PT selecting their role proceeds to S7 (verification) immediately after account creation
- Client proceeds directly to S0 (Discover)

**Tech stack:**
| Package | Role |
|---|---|
| `firebase_auth` | Email + OAuth sign-up |
| `google_sign_in` | Google OAuth |
| `sign_in_with_apple` | Apple Sign-In (required for iOS App Store) |
| `cloud_firestore` | Create user doc + set role field |

---

#### S7 — PT Verification *(New)*
*PTs must complete identity + credential verification before receiving the ✅ badge.*

**Why this screen exists:**
Clients must trust that the PT they're connecting with is a real, qualified professional. Unverified PTs can still use the app but their profile shows no verified badge, which reduces discoverability and trust.

**Flow:**
```
PT registers (S6) → prompted to verify → S7
  ├── Upload face photo
  ├── Upload certificate / enrollment doc
  └── Submit → status: pending
        ↓ (24–48h)
  Team reviews → approved → Firestore status: "verified"
                           → FCM push to PT
                           → ✅ badge appears on profile (S1)
```

**Step progress indicator:** Đăng ký ✓ → Xác thực (active) → Duyệt

**Upload 1 — Ảnh khuôn mặt (selfie)**

Requirements:
- Rõ mặt, nhìn thẳng vào camera
- Không đeo kính đen, không đội mũ
- Ánh sáng đủ, không tối / không ngược sáng
- Chỉ 1 người trong ảnh

Accepted formats: JPG, PNG — max 10 MB

**Upload 2 — Bằng cấp / Giấy nhập học**

Accepted documents:
- Chứng chỉ PT: ISSA, ACE, NASM, ACSM và tương đương
- Giấy nhập học ngành TDTT, Y khoa, hoặc Dinh dưỡng
- Giấy chứng nhận PT do gym / tổ chức cấp
- Ảnh phải rõ, đọc được tên đầy đủ và ngày cấp

Accepted formats: JPG, PNG, PDF — max 20 MB

**Privacy note:** Documents stored in a private Firebase Storage bucket (`/verifications/{uid}/`). Not displayed publicly. Not shared with third parties.

**Submit behaviour:**
- Button disabled until both uploads complete
- On submit: pending overlay displayed in-screen
- Pending state shows: tài liệu đã nộp ✓ · đang xét duyệt · nhận badge ✅

**Admin side (out of scope for MVP but required):**
- Firebase Console or simple internal admin page
- Reviewer opens verification request, compares face photo to cert, clicks Approve / Reject
- Approval triggers Cloud Function: update Firestore `verificationStatus → "verified"` + send FCM push to PT

**Tech stack:**
| Package | Role |
|---|---|
| `image_picker` | Selfie from camera or photo library |
| `file_picker` | Pick PDF certificate |
| `firebase_storage` | Upload to private `/verifications/{uid}/` bucket |
| `cloud_firestore` | Store verification request doc + status |
| `cloud_functions` | Notify admin on new submission; update badge on approval |
| `firebase_messaging` | Push result notification to PT |

**Firestore document — `verifications/{uid}`:**
```json
{
  "uid": "pt_uid",
  "facePhotoUrl": "gs://…/verifications/uid/face.jpg",
  "certDocUrl": "gs://…/verifications/uid/cert.pdf",
  "status": "pending",          // pending | approved | rejected
  "submittedAt": "Timestamp",
  "reviewedAt": null,
  "reviewerNote": null
}
```

---

## 5. Firestore Data Model

```
users/{uid}
  role: "pt" | "client"
  displayName: string
  avatarUrl: string
  createdAt: Timestamp

pts/{uid}
  bio: string
  specialties: string[]
  certifications: string[]         // e.g. ["ISSA", "ACE"]
  verificationStatus: "unverified" | "pending" | "verified"
  availabilitySlots: { day: string, time: string }[]
  rating: number                   // denormalized average
  reviewCount: number
  clientCount: number
  hourlyRate: number | null

verifications/{uid}                // private — Storage access rules required
  facePhotoUrl: string
  certDocUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: Timestamp
  reviewedAt: Timestamp | null
  reviewerNote: string | null

sessions/{sessionId}
  ptId: string
  clientId: string
  scheduledAt: Timestamp
  agoraRoomId: string
  recordingUrl: string | null
  durationSeconds: number
  status: "scheduled" | "completed" | "cancelled"

scheduledMessages/{msgId}
  fromPtId: string
  toClientIds: string[]
  content: string
  sendAt: Timestamp
  templateType: string | null      // "remind_workout" | "remind_protein" | ...
  status: "pending" | "sent" | "failed"

reviews/{reviewId}
  ptId: string
  clientId: string
  rating: number                   // 1–5
  text: string
  createdAt: Timestamp
```

---

## 6. Tech Stack

| Layer | Technology | Package / Service |
|---|---|---|
| Mobile | Flutter 3.x | iOS + Android, `go_router` |
| Auth | Firebase Auth | `firebase_auth`, `google_sign_in`, `sign_in_with_apple` |
| Database | Cloud Firestore | `cloud_firestore` |
| File Storage | Firebase Storage | `firebase_storage` |
| **Chat** ✓ | **Stream Chat** | **`stream_chat_flutter`** — prebuilt widgets, 5 MAU free |
| **Video Call** ✓ | **Agora RTC Engine** | **`agora_rtc_engine: ^6.3.0`** — 10K min/mo free, <80ms |
| Scheduled Messages | Cloud Functions + Cloud Scheduler | Cron → Function → FCM |
| Notifications | Firebase Cloud Messaging | `firebase_messaging`, `flutter_local_notifications` |
| File Picker | — | `image_picker`, `file_picker` |
| Search | Algolia *(Phase 2)* | `algolia_helper_flutter` |
| Analytics | PostHog | `posthog_flutter` |

### Chat library decision
**Chosen: `stream_chat_flutter`**
- Prebuilt `ChannelListView` + `MessageListView` + `MessageInput` — ship in ~4 hours
- $0 up to 5 MAU, then $99/mo at 100 MAU
- Scale exit: abstract `ChatService` interface → migrate to Firestore DIY if cost becomes a concern

### Video library decision
**Chosen: `agora_rtc_engine: ^6.3.0`**
- Best Flutter SDK for production video, native performance, AI noise suppression
- Agora RTC token must be generated server-side via Cloud Function (never expose App ID in client)
- $0 up to 10,000 min/month → $0.00099/min after
- Alternative at scale: 100ms (`hmssdk_flutter`) if better prebuilt UI layout control is needed

---

## 7. MVP Scope

### Phase 1 — Core (Weeks 1–4)
- [ ] Onboarding: role selection + Firebase Auth (Google, Apple, Email)
- [ ] PT profile creation + listing (S0, S1)
- [ ] PT Verification upload flow (S7) + manual admin review via Firebase Console
- [ ] 1-on-1 chat with image + file sharing (S2) via Stream Chat
- [ ] Basic scheduled message: single recipient, text only (S5 lite)
- [ ] PT Dashboard with inbox + unverified banner (S4)

### Phase 2 — Video + Full Schedule (Weeks 5–8)
- [ ] Video call via Agora RTC (S3) with cloud recording
- [ ] Scheduled message broadcast (multiple recipients) + templates
- [ ] Availability calendar + session booking
- [ ] Reviews & ratings post-session
- [ ] FCM push notifications (new message, session reminder, verification result)

### Phase 3 — Growth (Weeks 9–12)
- [ ] In-call chat overlay
- [ ] PT analytics: client activity, response rate, session hours
- [ ] Algolia full-text search for PT discovery
- [ ] Admin dashboard for verification review (replace Firebase Console)
- [ ] Monetization: PT subscription tier ($29/mo for advanced features)

---

## 8. Success Metrics

| Metric | Month 1 | Month 3 |
|---|---|---|
| PT registrations | 50 | 200 |
| PT verified (✅ badge) | 30 | 160 |
| Client registrations | 200 | 1,000 |
| PT–Client connections | 100 | 600 |
| Avg messages / connection / week | 5 | 10 |
| Video call sessions / week | 50 | 300 |
| Scheduled messages sent | 100 | 800 |
| Verification approval rate | — | >80% |

---

## 9. Open Questions

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | Who does admin review for verification — internal team or outsourced? | Product | High |
| 2 | What's the rejection flow — does PT get a reason + retry? | Product | High |
| 3 | Do we support re-verification if cert expires? | Product | Medium |
| 4 | Stream Chat vs Firestore DIY — revisit at 50 active PTs | Eng | Medium |
| 5 | Apple IAP policy — does PT subscription need to go through IAP? | Legal/Eng | High |

---

*CoachLink · PRD v2.0 · 2026-05-27*
