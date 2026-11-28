# FRONTEND_FIX_BACKLOG.md — Careerku (STACK 2026 Semifinal)

> Pasangan: `LLM_CONTEXT.md` (baca dulu). Dokumen ini = daftar tugas + spesifikasi target agar frontend **utuh dan sesuai master plan**.
> Menggantikan Bagian 2 (audit) pada `CAREERKU_DEV_MASTERPLAN.md`. Bagian lain masterplan tetap berlaku.
> Basis audit: snapshot repo `Careerku-main/frontend` (docs menyebut commit `c159766`). Nomor baris = **petunjuk**; verifikasi dengan `grep`.
> Batas audit: pembacaan statis. `npm run build/lint` belum dijalankan oleh auditor (jaringan mati). T-000 mewajibkan baseline.

## 0. Cara memakai

- Ukuran: **S** < 2 jam, **M** 2–5 jam, **L** 5–10 jam.
- Prioritas: **P0** wajib untuk demo semifinal, **P1** sebaiknya, **P2** jika sempat.
- Pemilik (saran): **A** = domain/engine/store, **B** = UI/halaman, **C** = ekstraksi (client + panel + service backend).
- Setiap task menyisakan `npm run check` hijau. Jangan menggabungkan beberapa task dalam satu perubahan.
- Centang `[ ]` → `[x]` saat selesai dan lulus Acceptance Criteria.

### Urutan dan jalur kritis

```
T-000 → T-001 → T-002 ─┬→ T-100 → T-110/T-111 → T-120 → T-130/T-140 ─┐
                       │                                              ├→ T-230 (store) → T-410/411/420/430
                       ├→ T-150 → T-450 (extraction client) ──────────┘          ↑
                       └→ T-200 → T-210 → T-220 → T-240                          │
T-300..T-306 (komponen presentasional, hanya butuh T-100) ───────────────────────┘
T-307 (panel ekstraksi) butuh T-150 + T-450 + T-230
T-440 (copy jujur), T-400 (nav/route) setelah T-200/T-230
```

### Bila waktu mepet (urutan pemotongan)

1. Potong dulu: T-540, T-510, T-520, unggah poster (T-451).
2. Lalu: tampilan riwayat detail di T-305 (cukup hitungan sebelum/sesudah).
3. **Jangan dipotong**: T-120, T-130, T-230, T-420, T-440, T-450 (minimal mode fixture), T-210.

---

## 1. Kondisi saat ini (fakta dari audit)

| Area | Fakta | File |
|---|---|---|
| Matching | Satu skor 20–99 menjumlahkan IPK+semester+jurusan+skill; bobot beda per kategori; tier High/Medium/Low | `utils/matching.ts` |
| Skill match | `includes` dua arah ("Java"↔"JavaScript", "Django"↔"Go") | `hasSkillMatch` di `matching.ts` |
| Bukti | Tidak ada. `skills: string[]`; `experiences` tidak dipakai matching | `types/index.ts` |
| Reassessment | `addSkill` menaikkan skor tanpa bukti | `hooks/useCareerkuStore.tsx`, `AnalyzePage.tsx` ~585 |
| Data | 9 record mock (4 internship, 3 competition, 2 scholarship), nama perusahaan nyata + persyaratan karangan, `verifiedAt` ditulis manual | `services/mockData.ts` |
| Profil | Hard-coded "Raka Pratama"; `Number(gpa) \|\| 0` mengubah kosong jadi 0 | `mockData.ts`, `ProfilePage.tsx` ~79 |
| Backend | Tidak ada. `apiClient` didefinisikan tetapi tidak dipakai di mana pun | `services/api.ts` |
| Auth | UI saja, menerima input apa pun | `AuthPage.tsx` |
| Konsumen skor | Analyze 19×, Dashboard 16×, Discover 8×, Drawer 8×, MatchBadge 6×, Tracker 5×, Card 4×, Gauge 3×, Profile 2×, Welcome 1×, Auth 1×, store 1× | grep `\.match\.` dll. |
| Klaim palsu | Lihat T-440 (daftar lokasi) | Welcome, Auth, Discover, Dashboard, mockData, store, `index.html` title |
| Tes/CI | Tidak ada skrip test | `package.json` |

---

## 2. Spesifikasi target (kanonik)

### 2.1 Tipe domain — `src/domain/types.ts`

```ts
export type OpportunityCategory = 'internship'
export type OpportunityOrigin = 'sample' | 'fixture' | 'extracted'
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Online'
export type Dimension = 'formal' | 'competency' | 'other'
export type Importance = 'required' | 'preferred'
export type SkillKind = 'technical' | 'soft'

export type RequirementCriterion =
  | { kind: 'min_gpa'; value: number }
  | { kind: 'semester_range'; min: number; max?: number }
  | { kind: 'major_in'; allowed: string[] }
  | { kind: 'skill'; skill: string; skillKind: SkillKind }
  | { kind: 'free_text' }

export interface RequirementItem {
  id: string                      // stabil dalam satu Opportunity, mis. "req-0"
  dimension: Dimension            // formal | competency | other
  label: string                   // teks singkat untuk UI
  importance: Importance
  criterion: RequirementCriterion
  sourceText: string | null       // kutipan persis dari posting; null untuk data sample
  needsVerification: boolean      // true = hasil ekstraksi yang tidak pasti / tidak ditemukan di teks sumber
}

export interface PortfolioProjectIdea {
  id: string; title: string; description: string
  estimatedDuration: string; targetSkills: string[]; deliverable: string
}
export interface CuratedGuidance {
  bySkill: Record<string, { why: string; hint: string }>   // key = normalizeSkill(skill)
  portfolioIdeas: PortfolioProjectIdea[]
}

export interface Opportunity {
  id: string
  title: string
  organization: string
  orgInitials: string
  orgAccent: string
  category: OpportunityCategory
  typeLabel: string
  workMode: WorkMode | null
  location: string | null
  summary: string
  description: string
  deadline: string | null         // 'YYYY-MM-DD'
  sourceUrl: string | null
  sourceName: string
  benefitLabel: string | null
  origin: OpportunityOrigin
  extractedAt: string | null      // ISO nyata; null untuk sample
  sourceText: string | null       // teks posting asli untuk ketertelusuran
  requirementItems: RequirementItem[]
  curatedGuidance?: CuratedGuidance
}

export type EvidenceType = 'project' | 'experience' | 'certificate' | 'coursework'
export interface EvidenceItem {
  id: string
  type: EvidenceType
  title: string
  description: string
  url?: string
  skills: string[]
  addedAt: string
}

export interface StudentProfile {
  name: string
  email: string
  university: string
  major: string                   // '' = belum diisi
  semester: number | null         // null = belum diisi
  gpa: number | null              // null = belum diisi
  claimedSkills: string[]         // self-declared
  interests: string[]
  evidence: EvidenceItem[]
  isSample: boolean
}

export type FormalStatus = 'meets' | 'does_not_meet' | 'unable_to_assess'
export type CompetencyStatus = 'supported' | 'partial' | 'evidence_needed' | 'not_stated'
export type RequirementStatus = FormalStatus | CompetencyStatus

export interface RequirementResult {
  requirementId: string
  dimension: Dimension
  status: RequirementStatus
  reason: string                  // WAJIB, bahasa Inggris, bisa dibaca manusia
  evidenceIds: string[]
  claimed?: boolean               // hanya untuk competency
}

export interface AssessmentSummary {
  formal: { meets: number; doesNotMeet: number; unableToAssess: number; total: number }
  competencyMatch: { stated: number; notStated: number; total: number }
  evidenceSufficiency: { withLink: number; withoutLink: number; none: number; totalStated: number }
}
export interface AssessmentResult {
  opportunityId: string
  computedAt: string
  results: RequirementResult[]
  summary: AssessmentSummary
}

export type TaskKind = 'add_evidence' | 'upgrade_evidence' | 'state_or_learn' | 'complete_profile_field'
export interface ActionTask {
  id: string                      // `${opportunityId}:${requirementId}`
  opportunityId: string
  requirementId: string
  kind: TaskKind
  title: string
  doneCriteria: string
  why?: string                    // dari curatedGuidance
  hint?: string                   // dari curatedGuidance
  state: 'open' | 'done'          // DERIVED dari hasil penilaian (D-07)
  satisfiedByEvidenceId?: string
}

export interface SnapshotEntry { requirementId: string; status: RequirementStatus }
export interface AssessmentSnapshot {
  id: string; opportunityId: string; at: string
  label: 'baseline' | 'reassessment'
  entries: SnapshotEntry[]
}
export interface ActionPlan { opportunityId: string; startedAt: string; baselineSnapshotId: string }
export interface RequirementChange {
  requirementId: string; from: RequirementStatus; to: RequirementStatus
  direction: 'improved' | 'regressed' | 'changed'
}
```

### 2.2 API domain (pure functions)

```ts
// src/domain/skills.ts
export function normalizeSkill(input: string): string
export function skillsMatch(a: string, b: string): boolean      // kesetaraan kanonik / satu grup alias. DILARANG substring.

// src/domain/majors.ts
export function majorMatches(studentMajor: string, allowed: string[]): boolean

// src/domain/assessment.ts
export function assessOpportunity(input: {
  opportunity: Opportunity; profile: StudentProfile; now: Date
}): AssessmentResult

// src/domain/actions.ts
export function deriveActionTasks(input: {
  opportunity: Opportunity; current: AssessmentResult; profile: StudentProfile
  baseline?: SnapshotEntry[]          // jika ada, himpunan gap diambil dari baseline
}): { tasks: ActionTask[]; blockers: RequirementResult[] }   // blockers = formal does_not_meet (tanpa task)

// src/domain/snapshots.ts
export function toSnapshotEntries(r: AssessmentResult): SnapshotEntry[]
export function diffEntries(prev: SnapshotEntry[], curr: SnapshotEntry[]): RequirementChange[]
```

Alias skill awal (`SKILL_ALIAS_GROUPS`, boleh diperluas; kunci setelah `normalizeSkill` = lowercase, trim, spasi tunggal):
`['react','react.js','reactjs']`, `['node.js','nodejs','node']`, `['typescript','ts']`, `['javascript','js']`, `['tailwind css','tailwind','tailwindcss']`, `['postgresql','postgres']`, `['rest api','rest','restful api']`, `['testing (vitest/jest)','vitest','jest','react testing library','unit testing']`, `['team communication','communication','teamwork']`, `['problem solving','problem-solving']`.

Alias jurusan awal (`MAJOR_ALIAS_GROUPS`): `['computer science','ilmu komputer']`, `['informatics','informatika','teknik informatika']`, `['information systems','sistem informasi']`. Wildcard: `all majors`, `semua jurusan`.

### 2.3 Aturan penilaian

**Formal** (`dimension: 'formal'`)
- `min_gpa`: `profile.gpa === null` → `unable_to_assess`; `gpa >= value` → `meets`; selain itu `does_not_meet`.
- `semester_range`: `semester === null` → `unable_to_assess`; di dalam `[min, max ?? ∞]` → `meets`; selain itu `does_not_meet`.
- `major_in`: jika `allowed` memuat wildcard → `meets` (apa pun isi `major`). Jika `major.trim() === ''` → `unable_to_assess`. `majorMatches` → `meets`; selain itu `does_not_meet`.

**Competency** (`kind: 'skill'`) — lihat urutan 6 langkah di `LLM_CONTEXT.md` Bagian 5.

**Other** (`kind: 'free_text'`) → selalu `unable_to_assess`. Jangan membuat pengecekan semantik teks bebas (di luar scope).

Template `reason` (tes memeriksa `status` dan bahwa `reason` memuat nama skill/nilai; kalimat persis boleh berbeda sedikit):

| Status | Template |
|---|---|
| `meets` (GPA) | `GPA 3.62 meets the minimum 3.20.` |
| `does_not_meet` (GPA) | `GPA 3.00 is below the minimum 3.20.` |
| `unable_to_assess` | `GPA is not set in your profile, so this requirement cannot be assessed.` |
| semester | `Semester 4 is outside the required range 5–8.` / `Semester 6 meets the minimum of 5.` |
| major | `Major "Informatika" is accepted (matches "Informatics").` / `Major "Mechanical Engineering" is not in the accepted list: Computer Science, Informatics.` |
| `supported` | `Supported: "Campus Event Portal" has a public link and lists React.` |
| `partial` | `Partially supported: evidence lists React but has no public link (or is coursework only).` |
| `evidence_needed` | `Evidence needed: you claim React, but no evidence item lists it.` |
| `not_stated` | `Not stated yet: no claimed skill or evidence mentions Docker.` |
| `other` | `Free-text requirement. Careerku cannot check it automatically; review it yourself.` |

### 2.4 Turunan tugas aksi (D-07)

- Himpunan gap = (jika ada `baseline`) requirement yang berstatus gap di baseline, selain itu yang berstatus gap sekarang.
- Gap kompetensi: `evidence_needed` → `add_evidence`; `partial` → `upgrade_evidence`; `not_stated` → `state_or_learn`.
- Gap formal `unable_to_assess` → `complete_profile_field` (field: GPA / Semester / Major).
- Formal `does_not_meet` → **tidak ada task**; masuk `blockers` dan ditampilkan sebagai "Blocking criterion".
- `free_text` → tidak ada task.
- `state`: kompetensi `done` bila status sekarang `supported`; profile-field `done` bila status sekarang bukan `unable_to_assess`; selain itu `open`.
- `satisfiedByEvidenceId` = id evidence pertama yang punya link dan memuat skill tersebut.
- Teks: `add_evidence` → title `Add evidence for ${skill}`, doneCriteria `Add a project, experience, or certificate that lists ${skill} and includes a public link.` `upgrade_evidence` → `Add a public link for ${skill} evidence`. `state_or_learn` → `Show or build ${skill}`, doneCriteria `If you already have this skill, add it with evidence. If not, build a small project that uses ${skill} and add it with a public link.` Isi `why`/`hint` dari `curatedGuidance.bySkill[normalizeSkill(skill)]` bila ada.

### 2.5 API store target (`careerkuContext.ts`)

```ts
interface CareerkuContextValue {
  profile: StudentProfile
  updateProfile(patch: Partial<Pick<StudentProfile,'name'|'email'|'university'|'major'|'semester'|'gpa'|'interests'>>): void
  addClaimedSkill(skill: string): void
  removeClaimedSkill(skill: string): void
  addEvidence(draft: Omit<EvidenceItem,'id'|'addedAt'>): EvidenceItem
  updateEvidence(id: string, patch: Partial<Omit<EvidenceItem,'id'|'addedAt'>>): void
  removeEvidence(id: string): void

  opportunities: Opportunity[]                         // sample + custom, hanya ACTIVE_CATEGORIES
  assessments: Record<string, AssessmentResult>        // derived (useMemo) per opportunity.id
  addExtractedOpportunity(o: Omit<Opportunity,'id'>): Opportunity
  removeCustomOpportunity(id: string): void

  plans: Record<string, ActionPlan>                    // by opportunityId
  snapshots: AssessmentSnapshot[]
  startPlan(opportunityId: string): void               // simpan snapshot 'baseline' + plan
  reassess(opportunityId: string): { changes: RequirementChange[] }   // simpan snapshot 'reassessment'

  selectedOpportunity: Opportunity | null
  openOpportunityDetail(id: string): void
  closeOpportunityDetail(): void

  theme: ThemeMode; setTheme(m: ThemeMode): void
  toast: ToastMessage | null; showToast(...): void; dismissToast(): void

  resetToSample(): void        // profil sample + hapus custom/plans/snapshots
  clearProfile(): void         // profil kosong (isSample=false)
  deleteAllLocalData(): void   // hapus semua key `careerku_*`, lalu reload state default
}
```

Kunci localStorage (lewat `services/storage.ts`, divalidasi Zod saat load; jika invalid → default): `careerku_profile_v3`, `careerku_custom_opps_v1`, `careerku_plans_v1`, `careerku_snapshots_v1`, `careerku_theme_v1`. Data lama `*_v2` diabaikan (boleh dihapus saat load).

### 2.6 Matriks tes engine (minimum, wajib lulus)

| # | Kasus | Ekspektasi |
|---|---|---|
| F1 | gpa 3.62, min 3.2 | `meets` |
| F2 | gpa 3.0, min 3.2 | `does_not_meet` |
| F3 | gpa `null` | `unable_to_assess` |
| F4 | semester 4 vs 5–8; semester 9 vs 5–8 | keduanya `does_not_meet` |
| F5 | semester `null` | `unable_to_assess` |
| F6 | major "Informatika" vs ["Informatics"] | `meets` |
| F7 | major "" vs ["Computer Science"] | `unable_to_assess` |
| F8 | major "Mechanical Engineering" vs ["Computer Science"] | `does_not_meet` |
| F9 | major "" vs ["All Majors"] | `meets` |
| S1 | claimed "Django", requirement "Go" | `not_stated` (BUKAN stated) |
| S2 | claimed "JavaScript", requirement "Java" | `not_stated` |
| S3 | claimed "ReactJS", requirement "React", tanpa evidence | `evidence_needed`, `claimed: true` |
| S4 | tidak ada klaim/evidence untuk "Docker" | `not_stated`, `claimed: false` |
| S5 | evidence (project) memuat "React" tanpa url | `partial` |
| S6 | evidence memuat "React" dengan `https://...` | `supported` |
| S7 | evidence type `coursework` dengan url | `partial` |
| S8 | evidence url `"not a url"` | `partial` |
| S9 | evidence memuat "React" tetapi "React" tidak ada di `claimedSkills` | stated = true (status mengikuti evidence) |
| S10 | menambah skill ke `claimedSkills` saja | status tidak pernah menjadi `supported` (I-05) |
| S11 | evidence memuat "Vitest", requirement "Testing (Vitest/Jest)" | `supported` bila ada link |
| O1 | requirement `free_text` | `unable_to_assess` |
| D1 | input sama dua kali | output identik (determinisme; `now` di-inject) |
| M1 | ringkasan 3 dimensi | angka sesuai hitungan manual dari hasil |
| T1 | gap kompetensi | task terbentuk dengan `requirementId` benar |
| T2 | formal `does_not_meet` | tidak ada task, ada di `blockers` |
| T3 | formal `unable_to_assess` | task `complete_profile_field` |
| T4 | setelah evidence berlink ditambah | task `state: 'done'` dan `satisfiedByEvidenceId` terisi |
| R1 | diff `evidence_needed → supported` | `direction: 'improved'` |
| R2 | tanpa perubahan | diff kosong |
| Z1 | payload ekstraksi invalid (tanpa `requirementItems`, `deadline` salah format, `dimension` tak dikenal) | ditolak Zod |

---

## 3. Task — Fase 0: Baseline dan pengaman

### [ ] T-000 Baseline build dan branch  `P0 · A · S`
- **Do:** buat branch `masterplan/frontend-fix`. Di `frontend/`: `npm ci`, `npm run build`, `npm run lint`. Catat hasilnya (lulus/gagal + pesan) di `docs/dev/BASELINE.md`. Perbaiki hanya error build yang sepele; jangan menyentuh fitur.
- **Files:** `docs/dev/BASELINE.md` (baru).
- **Acceptance:** ada catatan baseline; `npm run build` berhasil atau kegagalannya terdokumentasi jelas.

### [ ] T-001 Vitest dan skrip `check`  `P0 · A · S · dep: T-000`
- **Do:** tambah `vitest` yang kompatibel dengan Vite ^8 (cek peer dependency; jangan memaksa versi). Skrip: `"test": "vitest run"`, `"check": "oxlint && tsc -b && vitest run"`. Tambah 1 tes dummy di `src/domain/smoke.test.ts`.
- **Files:** `package.json`, `package-lock.json`, `src/domain/smoke.test.ts`.
- **Acceptance:** `npm run check` hijau. Tidak ada dependency lain yang ditambah selain Vitest dan dependensi langsungnya.

### [ ] T-002 Mekanisme karantina `_deferred`  `P0 · A · S · dep: T-001`
- **Do:** buat `src/_deferred/`. Tambah `"exclude": ["src/_deferred"]` ke `tsconfig.app.json`. Konfigurasikan oxlint mengabaikan folder itu (`ignorePatterns` di `.oxlintrc.json`, atau `--ignore-pattern`; ikuti dokumentasi oxlint). Pastikan Vitest tidak mengumpulkan tes dari sana.
- **Acceptance:** file TS yang rusak di `_deferred` tidak membuat `npm run check` gagal.

---

## 4. Task — Fase 1: Domain (pure TypeScript)

### [ ] T-100 Tipe domain  `P0 · A · S · dep: T-002`
- **Do:** buat `src/domain/types.ts` persis dari Bagian 2.1. Jangan mengubah `src/types/index.ts` dulu (tipe lama hidup berdampingan sampai T-230).
- **Acceptance:** `tsc -b` lulus; tidak ada impor React di `src/domain/`.

### [ ] T-110 Normalisasi dan pencocokan skill  `P0 · A · M · dep: T-100`
- **Files:** `src/domain/skills.ts`, `src/domain/skills.test.ts`.
- **Do:** `normalizeSkill`, `skillsMatch`, `SKILL_ALIAS_GROUPS` (Bagian 2.2). Kesetaraan = string kanonik sama ATAU berada dalam satu grup alias. **Dilarang** `includes`/substring antar skill.
- **Acceptance:** kasus S1, S2, S11 lulus; `skillsMatch('ReactJS','React') === true`; `skillsMatch('Django','Go') === false`; `skillsMatch('Java','JavaScript') === false`.

### [ ] T-111 Pencocokan jurusan  `P0 · A · S · dep: T-100`
- **Files:** `src/domain/majors.ts`, `majors.test.ts`.
- **Do:** `majorMatches` dengan normalisasi + `MAJOR_ALIAS_GROUPS`; tanpa substring.
- **Acceptance:** F6, F8 lulus; "Computer Science" ≠ "Computer Science and Electronics" kecuali didaftarkan sebagai alias.

### [ ] T-120 Engine penilaian  `P0 · A · L · dep: T-110, T-111`
- **Files:** `src/domain/assessment.ts`, `assessment.test.ts`.
- **Do:** implementasi `assessOpportunity` sesuai Bagian 2.3, termasuk `reason`, `evidenceIds`, `claimed`, dan `summary` tiga dimensi. `now` di-inject (tidak ada `new Date()` di dalam fungsi, kecuali default parameter di pemanggil).
- **Acceptance:** seluruh matriks F, S, O, D, M di Bagian 2.6 lulus.
- **Don't:** jangan menambah skor, bobot, atau peringkat. Jangan mengimpor dari `src/utils/matching.ts`.

### [ ] T-130 Turunan tugas aksi  `P0 · A · M · dep: T-120`
- **Files:** `src/domain/actions.ts`, `actions.test.ts`.
- **Do:** `deriveActionTasks` sesuai Bagian 2.4.
- **Acceptance:** T1–T4 lulus.

### [ ] T-140 Snapshot dan diff  `P0 · A · S · dep: T-120`
- **Files:** `src/domain/snapshots.ts`, `snapshots.test.ts`.
- **Do:** `toSnapshotEntries`, `diffEntries` dengan `direction`. Urutan "membaik": `not_stated < evidence_needed < partial < supported` untuk kompetensi; `unable_to_assess < meets` untuk formal; `does_not_meet` ke `meets` = `improved`.
- **Acceptance:** R1, R2 lulus.

### [ ] T-150 Skema Zod (ekstraksi dan persistensi)  `P0 · A · M · dep: T-100`
- **Files:** `src/domain/schemas.ts`, `schemas.test.ts`.
- **Do:** skema untuk `RequirementItem`, `Opportunity`, `EvidenceItem`, `StudentProfile`, `ActionPlan`, `AssessmentSnapshot`, serta `extractionPayloadSchema` (Lampiran A). `deadline` regex `^\d{4}-\d{2}-\d{2}$` atau `null`. Tipe TS tetap ditulis eksplisit di `types.ts`; gunakan `satisfies`/uji tipe agar skema dan tipe tidak berselisih.
- **Acceptance:** kasus Z1 lulus; payload valid contoh di Lampiran A lulus.

---

## 5. Task — Fase 2: Data dan store

### [ ] T-200 Karantina kode lama  `P0 · A · M · dep: T-002`
- **Do (pindahkan, jangan hapus):**
  - `pages/DashboardPage.tsx` → `_deferred/DashboardPage.legacy.tsx`
  - `pages/TrackerPage.tsx` → `_deferred/tracker/TrackerPage.legacy.tsx`
  - `components/MatchBadge.tsx`, `components/CareerkuMatchGauge.tsx` → `_deferred/components/`
  - `utils/matching.ts` → `_deferred/matching.legacy.ts`
  - 5 record non-internship dari `mockData.ts` → `_deferred/mockData.nonInternship.ts`
  - Kode state Tracker dari store (trackOpportunity, toggleDocumentItem, dst.) dan tipe `TrackedApplication`, `DocumentChecklist*`, `ApplicationStatus`, `getStatusLabel` → `_deferred/tracker/`
- **Files:** barrel (`components/index.ts`, `pages/index.ts`, `utils/index.ts`, `services/index.ts`), `App.tsx`.
- **Acceptance:** tidak ada impor dari `_deferred` di kode aktif; build lulus setelah T-230 menyelesaikan konsumen (T-200 dan T-230 boleh dikerjakan berurutan di satu branch). Catatan: glyph `HighMatchGlyph`/`MatchIndexGlyph` di `DashboardIcons.tsx` tidak lagi dipakai; boleh dibiarkan.

### [ ] T-210 Data sample baru  `P0 · A · M · dep: T-100`
- **Files:** `src/services/sampleData.ts` (baru; menggantikan `mockData.ts` yang lalu dipindah/dihapus dari barrel).
- **Do:**
  - `SAMPLE_STUDENT_PROFILE`: nama "Sample Student", email `sample.student@example.edu`, `isSample: true`, `semester: 5`, `gpa: 3.62`, `major: 'Computer Science'`. `claimedSkills` dari skill lama. `evidence` dari `experiences` lama (type `experience`) dan minimal 1 proyek sample dengan url `https://example.com/sample/...`. Rancang agar demo menampilkan **campuran status** (ada `supported`, `partial`, `evidence_needed`, `not_stated`).
  - `SAMPLE_OPPORTUNITIES`: 4 internship lama, tetapi nama organisasi **fiktif** diakhiri "(Sample)" (D-06), `sourceUrl: null`, `origin: 'sample'`, `extractedAt: null`, `sourceText: null`, `sourceName: 'Illustrative sample'`. Buat `requirementItems` lewat fungsi adapter `buildRequirementItems(legacy)` dari struktur `OpportunityRequirements` lama (minGpa → `min_gpa`, semester → `semester_range`, allowedMajors → `major_in`, technicalSkills/softSkills → `skill`, otherRequirements → `free_text`). `sourceText: null`, `needsVerification: false`.
  - `aiImprovementMeta` → `curatedGuidance` (`prioritySkills` → `bySkill`: `why`=reason, `hint`=resourceHint; `portfolioIdeas` tetap).
  - Deadline dihitung dari hari ini (`daysFromNow(n)`) agar demo tidak pernah menampilkan "kedaluwarsa".
  - `SUGGESTED_SKILLS` dipertahankan.
- **Acceptance:** semua record lolos `opportunitySchema`; tidak ada nama perusahaan nyata; tidak ada `verifiedAt`; tidak ada field dokumen/CV/surat.

### [ ] T-220 Util penyimpanan  `P0 · A · S · dep: T-150`
- **Files:** `src/services/storage.ts`.
- **Do:** `loadJson(key, schema, fallback)`, `saveJson(key, value)`, `removeAllCareerkuKeys()`; semua dibungkus try/catch; validasi Zod saat load.
- **Acceptance:** data korup di localStorage tidak membuat aplikasi crash (kembali ke default); tidak ada akses `localStorage` di tempat lain (grep DoD).

### [ ] T-230 Tulis ulang store dan context  `P0 · A · L · dep: T-120, T-130, T-140, T-200, T-210, T-220`
- **Files:** `hooks/careerkuContext.ts`, `hooks/useCareerkuStore.tsx`.
- **Do:** implementasikan API Bagian 2.5. `assessments` dihitung dengan `useMemo` dari `opportunities` + `profile` (memanggil `assessOpportunity`). `startPlan` menyimpan snapshot `baseline` + plan; `reassess` menyimpan snapshot `reassessment` dan mengembalikan diff terhadap baseline (atau snapshot terakhir bila baseline tidak ada). Toast `addClaimedSkill`: `Skill added as a claim. Add evidence to support it.` (BUKAN "included in your Match Score").
- **Acceptance:** `addClaimedSkill` tidak mengubah status menjadi `supported` (tes store/engine); `deleteAllLocalData` membersihkan semua key `careerku_*`; build hijau setelah halaman dimigrasi (T-4xx). Jika halaman belum dimigrasi, gunakan branch integrasi yang sama; jangan meninggalkan `main` dalam keadaan merah.

### [ ] T-240 Konfigurasi scope  `P0 · A · S · dep: T-100`
- **Files:** `src/config/scope.ts`.
- **Do:** `export const ACTIVE_CATEGORIES = ['internship'] as const`. Store hanya mengekspos opportunity dengan kategori aktif.
- **Acceptance:** tidak ada filter kategori hard-coded lain di halaman.

---

## 6. Task — Fase 3: Komponen presentasional (B, paralel setelah T-100)

Semua komponen: props-driven, tanpa memanggil `useCareerku`, tanpa GSAP wajib, status **tidak hanya warna** (selalu ada teks + ikon), memakai CSS variables yang ada.

### [ ] T-300 `RequirementStatusBadge`  `P0 · B · S · dep: T-100`
- **Files:** `components/assessment/RequirementStatusBadge.tsx`.
- **Do:** props `{ status: RequirementStatus }`; label sesuai `LLM_CONTEXT.md` Bagian 5; warna dari `--status-success|warning|danger` dan netral untuk `unable_to_assess`/`not_stated`.
- **Acceptance:** semua 7 status terender dengan label teks yang benar.

### [ ] T-301 `AssessmentSummary` dan `AssessmentChips`  `P0 · B · M · dep: T-100`
- **Do:** `AssessmentSummary` (panel tiga dimensi terpisah, tanpa angka gabungan). `AssessmentChips` (versi inline untuk kartu): `Formal 3/3 met · Competency 4/6 stated · Evidence 2/4 with link`.
- **Acceptance:** tidak ada tanda `%`; angka hanya hitungan dari `AssessmentSummary`.

### [ ] T-302 `RequirementList`  `P0 · B · M · dep: T-300`
- **Do:** daftar `RequirementResult` dikelompokkan per `dimension`; tiap baris: `label`, badge, `reason`, penanda "Preferred", penanda "Needs verification" (bila `needsVerification`), dan `sourceText` (dapat dibuka/tutup) bila ada.
- **Acceptance:** `reason` selalu tampil; baris tanpa `reason` tidak mungkin (tipe mewajibkan).

### [ ] T-303 `EvidenceForm` dan `EvidenceList`  `P0 · B · M · dep: T-100`
- **Do:** form: type, title, description, url (opsional, validasi http(s)), skills (multi-input chip; boleh diprefill dengan satu skill dari task). Daftar bukti dengan badge "Has public link" / "No link" dan tombol hapus.
- **Acceptance:** url tidak valid ditolak dengan pesan; `coursework` menampilkan catatan "Coursework alone counts as partial support".

### [ ] T-304 `ActionPlanPanel`  `P0 · B · M · dep: T-100`
- **Do:** daftar `ActionTask` (open/done), `title`, `doneCriteria`, `why`/`hint` (label "Curated guidance"), tombol "Add evidence" (memprefill `EvidenceForm` dengan skill task) untuk kind kompetensi, tautan "Go to Profile" untuk `complete_profile_field`. Bagian terpisah "Blocking criteria" untuk `blockers`.
- **Acceptance:** tidak ada checkbox manual (D-07); task `done` menampilkan bukti pemenuhnya.

### [ ] T-305 `ReassessmentPanel`  `P1 · B · M · dep: T-100`
- **Do:** tombol "Reassess", ringkasan "n of m gaps closed since baseline", daftar perubahan (`from → to`, `improved/regressed`), dan riwayat snapshot (waktu + label).
- **Acceptance:** setelah evidence berlink ditambahkan lalu Reassess, perubahan `→ Supported` tampil. Versi minimal (hitungan saja) diterima bila waktu mepet.

### [ ] T-306 `DataOriginBadge`  `P0 · B · S · dep: T-100`
- **Do:** `sample` → "Sample data", `fixture` → "Fixture result", `extracted` → "Extracted <tanggal>" + tautan sumber bila ada.
- **Acceptance:** muncul di Card, Drawer, dan header Analyze.

### [ ] T-307 `ExtractOpportunityPanel`  `P0 · C · L · dep: T-150, T-450, T-230`
- **Files:** `components/extraction/ExtractOpportunityPanel.tsx`.
- **Do:** panel samping (pola seperti Drawer) dengan 3 langkah: **Input** (textarea teks posting wajib, URL sumber opsional, unggah poster opsional jika T-451), **Review** (field editable: title, organisasi, deadline, dan daftar requirement yang dapat diedit/dihapus/diubah dimensinya; item `needsVerification` disorot; kutipan `sourceText` tampil), **Save** (checkbox wajib "I reviewed these requirements"; tombol Save menjalankan `addExtractedOpportunity`).
- **Acceptance:** error jaringan atau payload invalid → pesan jelas dan **tidak ada yang tersimpan**; mode fixture menampilkan banner "FIXTURE MODE: this returns a pre-made result regardless of your input"; opportunity tersimpan punya `origin` benar, `sourceText`, `sourceUrl`, `extractedAt` dari `meta`.

---

## 7. Task — Fase 4: Halaman dan navigasi (B)

### [ ] T-400 Route, nav, shell  `P0 · B · M · dep: T-230`
- **Files:** `App.tsx`, `components/AppShell.tsx`, `pages/index.ts`.
- **Do:**
  - Route: `/` Welcome, `/login`, `/register`, `/discover`, `/analyze`, `/profile`. `/dashboard` dan `/tracker` → `<Navigate to="/discover" replace />`.
  - Nav (AppShell ~27–31): hanya **Opportunities** `/discover`, **Assessment** `/analyze`, **Profile** `/profile`.
  - Hapus dari AppShell ~41 dan ~203–210 pemakaian `trackedApplications` dan bagian "saved to Tracker" (~307). Ganti bagian itu dengan tautan ringkas ke Assessment, atau hapus panel.
  - Judul header profil (~364) `GPA {gpa ?? '—'} • Semester {semester ?? '—'}` (nullable).
- **Acceptance:** tidak ada tautan ke Dashboard/Tracker; AppShell tidak crash saat `gpa`/`semester` null.

### [ ] T-410 `DiscoverPage`  `P0 · B · L · dep: T-230, T-301`
- **Files:** `pages/DiscoverPage.tsx`.
- **Do:**
  - Hapus tab kategori (~126–134, 158) dan KPI berbasis skor (~138–143, ~269–283); hapus filter `onlyHighMatch` (~39, 159, 394) dan sort `match` (~173).
  - Filter baru: **Formal eligibility** = All / Meets all / Has unmet / Unable to assess (dihitung dari `assessments`). Sort: **Deadline** | **Most supported** (jumlah `supported` menurun; tampilkan angkanya di kartu agar bisa dijelaskan).
  - Teks ~249 "Verified Listings" → "Opportunities"; ~343 ganti dengan `Showing N internships`. Ringkasan KPI baru: jumlah opportunity, berapa yang punya `unable_to_assess`, berapa `origin: 'extracted'`.
  - Tombol "Add opportunity" membuka `ExtractOpportunityPanel` (T-307).
  - Hapus tombol/aksi Track (`trackOpportunity`, `untrackOpportunity`).
- **Acceptance:** tidak ada `.match.` di file; kartu menampilkan `AssessmentChips` + `DataOriginBadge`.

### [ ] T-411 `OpportunityCard` dan `OpportunityDetailDrawer`  `P0 · B · L · dep: T-301, T-302, T-306, T-230`
- **Do (Card):** ganti `CareerkuMatchGauge` (~4, 56–57) dengan `AssessmentChips`; hapus cabang kategori (~85) selain internship; tambah `DataOriginBadge`.
- **Do (Drawer):** ganti `MatchBadge` (~22, 93), `readinessSummary` (~96), `ruleChecks` (~164+), daftar skill matched/missing (~197–240) dengan `RequirementList`; ganti teks "Verified …" (~130) dengan `DataOriginBadge`; hapus "Required Documents" (~244+) dan tombol Track (~265–302). CTA utama: "Open assessment" → `navigate('/analyze?opportunity=<id>')` dan menutup drawer. Tampilkan `sourceUrl` bila ada.
- **Acceptance:** tidak ada `.match.`; drawer dapat ditutup dengan Escape dan tombol tutup; tautan sumber terbuka di tab baru dengan `rel="noopener noreferrer"`.

### [ ] T-420 `AnalyzePage` (halaman Assessment)  `P0 · B · L · dep: T-230, T-301–T-306`
- **Files:** `pages/AnalyzePage.tsx` (tulis ulang; versi lama → `_deferred/AnalyzePage.legacy.tsx`).
- **Do:** tetap opportunity-centered lewat `?opportunity=<id>` (pola `useSearchParams` yang sudah ada). Susunan:
  1. Header: judul "Assessment", pemilih peluang (daftar semua opportunity aktif), `DataOriginBadge`, tautan sumber.
  2. `AssessmentSummary` (3 dimensi).
  3. `RequirementList`.
  4. `ActionPlanPanel` (+ tombol "Start preparation plan" → `startPlan`).
  5. `EvidenceForm` (muncul dari tombol task) dan ringkasan `EvidenceList`.
  6. `ReassessmentPanel`.
  - Hapus: skor/gauge/progress "Readiness & Qualification Score" (~473), "Role Match Score" (~262), `techPct`, tombol "add to profile" (~585 `addSkill`), "Start Prep & Track" (~245), judul "AI Skill Gap Analysis" (~228).
  - Sub-judul jujur: "Rule-based assessment against this opportunity's requirements."
  - Tampilkan **gap per peluang**, bukan saran generik. `curatedGuidance.portfolioIdeas` boleh muncul sebagai "Curated idea" di dalam task terkait skill-nya.
- **Acceptance:** golden path E2E (Bagian 9) berjalan; tidak ada `%`; tidak ada `.match.`; memilih peluang lain menghasilkan penilaian terpisah.

### [ ] T-430 `ProfilePage`  `P0 · B · L · dep: T-230, T-303`
- **Files:** `pages/ProfilePage.tsx`.
- **Do:**
  - GPA/semester **boleh kosong** → simpan `null` (perbaiki `Number(gpa) || 0` dan `Math.max(1, …|| 1)` ~79–88). Validasi: GPA 0–4, semester 1–14 jika diisi.
  - Bagian "Skills" → "Claimed skills (self-declared)" (~241, 268); tombol add memakai `addClaimedSkill`; saran skill (`SUGGESTED_SKILLS`) tetap.
  - Bagian "Experience" (~316–341) diganti bagian **Evidence** (`EvidenceForm` + `EvidenceList`).
  - Hapus statistik `skills.length` yang diklaim "verified" (~421).
  - Banner bila `isSample`: "You are viewing a sample student profile." + tombol "Start with my own profile" (`clearProfile`) dan "Restore sample" (`resetToSample`).
  - Panel **Your data**: teks "Your profile is stored only in this browser (localStorage). Posting text you submit for extraction is sent to the extraction service; your profile is not." + tombol "Delete all my data" (konfirmasi) → `deleteAllLocalData`.
  - Teks ~137 ("Used by rule-based matching to verify…") → "Used to check formal eligibility (GPA, semester, major)."
- **Acceptance:** profil kosong tidak crash; penilaian menunjukkan `unable_to_assess` untuk field kosong; tombol hapus data bekerja.

### [ ] T-440 Kejujuran copy (Welcome, Auth, title)  `P0 · B · M · dep: T-400`
Ganti klaim menjadi jujur. Tabel lokasi (verifikasi dengan `grep`):

| File:baris | Sekarang (inti) | Ganti menjadi |
|---|---|---|
| `index.html` `<title>` | "…& AI Skill Gap Platform" | "Careerku — Evidence-based internship readiness" |
| `WelcomePage` ~34 | "verified internships, scholarships, and competitions" | "internship requirements and check your readiness with evidence" |
| ~39 | "Smart Rule-Based Matching" | "Requirement-by-requirement assessment" |
| ~48 | "LLM-powered analysis highlights…" | "Gaps are shown per requirement, with a specific next action for each." |
| ~406, ~913–916 | `highMatchCount` / "High-Match Demo" | hapus penghitung berbasis skor; ganti dengan jumlah requirement yang didukung bukti pada peluang sample |
| ~676 | "Match Smarter." | "Prepare with evidence." (atau setara) |
| ~689, ~1030 | "AI-powered career platform…" | "Careerku helps undergraduate students understand internship requirements and prepare with evidence." |
| ~857 | "Register, Discover, Match, Analyze, Improve, Apply, and Track" | "Discover, Assess, Understand, Improve, Reassess" |
| ~874–893, ~926 | Kartu "AI + OCR" / "Digital poster extraction via OCR & LLM" | "Opportunity extraction (in progress): paste a posting and review structured requirements." Jangan menyebut OCR kecuali T-451 selesai dan berjalan. |
| ~932–956 | "Verified & Tracked 100%" (counter) | hapus kartu atau ganti dengan fakta non-statistik |
| ~1158 | "Try live matching with…" | "Try the sample assessment" |
| ~1377 | "Rule-Based GPA, Semester & Major Matching" | "Rule-based formal eligibility checks" |
| `AuthPage` ~36 | "Unlock AI matches & tracker" | "Save your profile and evidence" |
| ~108, ~119, ~130 | `navigate('/dashboard')` | `navigate('/discover')` (register → `/profile`) |
| ~239 | "verified internships, scholarships, AI skill gap" | "your profile, evidence, and assessments in this browser" |
| ~357 | "match with verified internships, scholarships, and competitions" | "assess your readiness for internships" |

Tambahan: pada Auth, beri catatan "Demo sign-in: no account is created" jika memang mock (jangan klaim akun nyata).
- **Acceptance:** grep regresi (Bagian 9, butir 2) bersih di `WelcomePage`, `AuthPage`, `index.html`. Tidak ada statistik tanpa dasar.

### [ ] T-450 Klien ekstraksi dan mode fixture  `P0 · C · M · dep: T-150`
- **Files:** `services/extraction.ts`, `services/extractionFixtures.ts`, `utils/env.ts`, `.env.example`.
- **Do:**
  - Tambah env `VITE_EXTRACTION_MODE` = `live` | `fixture` (default `fixture`) ke skema Zod di `env.ts`.
  - `extractOpportunity(input)` → `Promise<ExtractionResult>`; mode `live`: `apiClient.post('/extract', body)` (timeout lebih panjang, mis. 60 dtk), validasi `data` dengan `extractionPayloadSchema`; mode `fixture`: kembalikan fixture bertanda `origin: 'fixture'`.
  - `flagUngroundedRequirements(payload, inputText)`: untuk tiap requirement, jika `sourceText` null atau bukan substring dari teks input (setelah normalisasi spasi/kapitalisasi) → `needsVerification = true`. Ini pemeriksaan deterministik anti-halusinasi.
  - Beri `id` (`req-${i}`) di klien, bukan dari server.
  - Fixture: 2 posting contoh fiktif beserta payload hasilnya.
  - `env.ts`: jangan melempar error fatal bila backend tidak ada; hanya validasi format.
- **Acceptance:** payload invalid → error terkontrol; tes untuk `flagUngroundedRequirements`; tidak ada SDK LLM atau API key di frontend.

### [ ] T-451 Unggah poster  `P1 · C · M · dep: T-450, T-307`
- **Do:** input file `image/png|jpeg`, batas 4 MB, konversi base64, dikirim sebagai `imageBase64` + `imageMime` ke `/extract`. Frontend **tidak** melakukan OCR.
- **Acceptance:** file terlalu besar/format salah ditolak dengan pesan. Hanya aktifkan di mode `live`; di fixture, nonaktifkan dengan keterangan.

### [ ] T-460 Kontrak layanan ekstraksi (untuk C, sisi backend)  `P0 · C · —`
Implementasi service Node/Express berada di luar `frontend/` (mis. `/server`), mengikuti Lampiran A. Frontend tidak bergantung pada implementasinya selama kontrak terpenuhi.

---

## 8. Task — Fase 5: Hardening

### [ ] T-500 Perbaikan tanggal dan penamaan  `P1 · A · S`
- **Files:** `utils/format.ts` dan pemanggilnya.
- **Do:** parse `'YYYY-MM-DD'` sebagai tanggal lokal (pecah string, `new Date(y, m-1, d)`), bukan `new Date(iso)` yang UTC. Ganti nama `formatDateID` → `formatDate` (bulan Inggris). Dukung `deadline: null` ("No deadline listed") dan deadline lewat ("Deadline passed").
- **Acceptance:** tes unit untuk `getDaysUntilDeadline` pada zona waktu berbeda (set `TZ` di tes).

### [ ] T-510 Aksesibilitas minimum  `P2 · B · M`
- Status tidak hanya warna; tombol ikon punya `aria-label`; drawer/panel: fokus masuk saat dibuka, Escape menutup, fokus kembali ke pemicu; label form terhubung (`htmlFor`).

### [ ] T-520 README dan dokumentasi  `P2 · A · S`
- Ganti `frontend/README.md` (template Vite) dengan: cara menjalankan, env (`VITE_API_BASE_URL`, `VITE_EXTRACTION_MODE`), scope, tautan ke `LLM_CONTEXT.md`. Tandai `docs/obsidian-code-flow/*` sebagai "outdated sampai diperbarui".

### [ ] T-530 Regresi dan skrip uji manual  `P0 · semua · S`
Jalankan perintah regresi dan skrip uji manual pada Bagian 9; centang hasilnya di PR.

### [ ] T-540 Halaman ringkasan opsional  `P2 · B · M`
- Hanya jika semua P0/P1 selesai. Ringkasan lintas-peluang berbasis `assessments` (jumlah gap terbuka, task selesai/total). Tanpa skor.

---

## 9. Definisi selesai dan uji

### Perintah regresi (jalankan di `frontend/`)

1. `npm run check` → hijau.
2. Pola terlarang di kode aktif (harus **nol baris**, atau tiap sisa baris punya justifikasi tertulis):
   `grep -rniE "match score|% match|high-match|highmatch|gauge|\btier\b|ai \+|llm-powered|ai-powered|verified" src --include=*.ts --include=*.tsx | grep -v "^src/_deferred"`
   (Catatan: "ocr" hanya boleh muncul di `ExtractOpportunityPanel`/`extraction.ts` dan hanya bila T-451 benar-benar berjalan.)
3. `grep -rn "\.match\." src | grep -v "^src/_deferred"` → nol baris.
4. `grep -rn "localStorage" src | grep -v "src/services/storage.ts" | grep -v "^src/_deferred"` → nol baris.
5. `grep -rn "Math.round" src/pages src/components | grep -v "^src/_deferred"` → periksa: tidak ada pembulatan yang menghasilkan persentase kecocokan.
6. `grep -rnE "from '@/_deferred|from '\.\./_deferred" src | grep -v "^src/_deferred"` → nol baris.

### Skrip uji manual golden path (rekam layar bisa diambil dari sini)

1. Buka `/` → klaim di halaman jujur (tanpa OCR/AI/verified).
2. Masuk (demo) → mendarat di `/discover`; tiga item nav saja.
3. Klik **Add opportunity** → tempel teks posting → **Extract** → review requirement, perhatikan item "Needs verification" → centang "I reviewed" → **Save**. Peluang baru muncul dengan badge `Extracted <waktu>` (atau banner FIXTURE bila mode fixture).
4. Buka peluang → drawer menampilkan daftar persyaratan dan sumber → **Open assessment**.
5. Di Assessment: tiga ringkasan dimensi terpisah; tiap persyaratan punya status + alasan.
6. Temukan satu `Evidence needed` dan satu `Not stated yet` → **Start preparation plan** (baseline tersimpan).
7. Pada task, **Add evidence** (isi url http(s)) → status berubah ke `Supported`, task `done`.
8. Di Profile: tambah klaim skill baru **tanpa bukti** → status TIDAK naik menjadi Supported (I-05).
9. Kembali ke Assessment → **Reassess** → perubahan `→ Supported` tampil dengan "n of m gaps closed".
10. Pilih peluang lain → penilaian terpisah.
11. Profile → kosongkan IPK → peluang terkait menjadi `Unable to assess` + task "Complete profile: GPA".
12. **Delete all my data** → aplikasi kembali ke sample tanpa error.

---

## Lampiran A — Kontrak `POST /api/extract`

Base URL = `VITE_API_BASE_URL` (default `http://localhost:5000/api`).

**Request** (`Content-Type: application/json`), minimal salah satu dari `text` atau `imageBase64`:
```json
{
  "text": "string, <= 20000 karakter",
  "sourceUrl": "string | undefined",
  "imageBase64": "string | undefined",
  "imageMime": "image/png | image/jpeg | undefined"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "title": "string",
    "organization": "string",
    "location": "string | null",
    "workMode": "Remote | Hybrid | On-site | Online | null",
    "deadline": "YYYY-MM-DD | null",
    "summary": "string",
    "description": "string",
    "benefitLabel": "string | null",
    "requirementItems": [
      {
        "dimension": "formal | competency | other",
        "label": "string",
        "importance": "required | preferred",
        "criterion": { "kind": "min_gpa", "value": 3.0 },
        "sourceText": "kutipan persis dari input | null",
        "needsVerification": false
      }
    ]
  },
  "meta": { "model": "string", "extractedAt": "ISO-8601", "inputKind": "text | image" }
}
```
`criterion` mengikuti `RequirementCriterion` (Bagian 2.1): `min_gpa` | `semester_range` | `major_in` | `skill` | `free_text`. `id` TIDAK dikirim server.

**Error:** status 4xx/5xx dengan `{ "success": false, "message": "string" }`.

**Aturan server (untuk C):**
- Kunci API LLM hanya di environment server; tidak pernah dikirim ke klien; tidak di-commit.
- Output LLM WAJIB JSON; validasi dengan Zod yang sama; bila invalid → 502, jangan mengembalikan data setengah jadi.
- Setel `needsVerification: true` untuk field yang disimpulkan atau tidak pasti.
- Jangan mengirim atau menyimpan data profil mahasiswa (permintaan tidak memuatnya).
- Satu sumber/format untuk demo; scraper multi-sumber = Final Day.
- Batasi ukuran input dan lakukan rate limit sederhana.
