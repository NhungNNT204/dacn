# 🎨 Community Hub - Visual & UI Guide

## 📐 Layout Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER (h-24)                        │
│  [Menu]  [Search Bar...................]  [User] [Bell]     │
└─────────────────────────────────────────────────────────────┘
┌──────────┬───────────────────────────────────────────────────┐
│          │                                                   │
│ SIDEBAR  │          MAIN CONTENT AREA                        │
│ (w-72)   │                                                   │
│          │  ┌─────────────────────────────────────────────┐  │
│ • Bảng   │  │  🔖 Bảng tin | 🔖 Đã lưu | 👥 Kết nối    │  │
│   tin    │  └─────────────────────────────────────────────┘  │
│ • Cộng   │                                                   │
│   đồng   │  ┌─────────────────────────────────────────────┐  │
│ • Tin    │  │        HỘP ĐĂNG BÀI (POST COMPOSER)       │  │
│   nhắn   │  │  [Avatar] [Textarea...........................] │  │
│ • Bạn    │  │  [📍] [🎵] [@] [😊]  [✨ ĐĂNG BÀI]       │  │
│   bè     │  └─────────────────────────────────────────────┘  │
│ • Đã     │                                                   │
│   lưu    │  ┌─────────────────────────────────────────────┐  │
│          │  │         BÀI VIẾT #1 (POST CARD)            │  │
│ --------  │  │  [Avatar] Author  ✓  [⋯]                  │  │
│ • Cài    │  │  Nội dung bài viết.......................  │  │
│   đặt    │  │  [Hình ảnh 400px]                          │  │
│ • Thoát  │  │  ❤️ 42  💬 2  [Share] [🔖]                │  │
│          │  │  Comments section...                       │  │
│          │  │    ┌─ [Avatar] User1 comment....         │  │
│          │  │    │  👍 3  Reply  [Trả lời]             │  │
│          │  │    │  ┌─ [Avatar] User2 reply...       │  │
│          │  │    │  │  👍 1  Reply  [Trả lời]       │  │
│          │  │    │  └─ Input reply...               │  │
│          │  │    └─ [Avatar] Input comment...        │  │
│          │  └─────────────────────────────────────────────┘  │
│          │                                                   │
│          │  [... More posts ...]                             │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

---

## 🎨 Color System

### Primary Palette
```
Indigo (Primary):
├── indigo-50    #EEF2FF (Lightest)
├── indigo-100   #E0E7FF
├── indigo-200   #C7D2FE
├── indigo-300   #A5B4FC
├── indigo-400   #818CF8
├── indigo-500   #6366F1
├── indigo-600   #4F46E5 ← Used for buttons
├── indigo-700   #4338CA ← Used for active states
└── indigo-800   #3730A3 ← Darkest

Amber (Secondary - Bookmark):
├── amber-50     #FFFBEB
├── amber-100    #FEF3C7
├── amber-400    #FBBF24
├── amber-500    #F59E0B ← Used for saved posts
└── amber-200    #FCD34D

Emerald (Location Tag):
├── emerald-50   #F0FDF4
├── emerald-100  #DCFCE7
└── emerald-700  #15803D

Slate (Neutral):
├── slate-50     #F8FAFC (Lightest)
├── slate-100    #F1F5F9
├── slate-200    #E2E8F0
├── slate-300    #CBD5E1
├── slate-400    #94A3B8
├── slate-500    #64748B
├── slate-600    #475569
├── slate-700    #334155
├── slate-800    #1E293B
└── slate-900    #0F172A (Darkest)
```

### Component Color Usage
```
Buttons:
├── Primary action: bg-indigo-600 hover:bg-indigo-700
├── Secondary: bg-slate-100 hover:bg-slate-200
├── Danger: bg-red-600 hover:bg-red-700
├── Bookmark: amber-500 (when saved)
└── Success: bg-emerald-600

Text:
├── Headings: text-slate-900 (dark)
├── Body: text-slate-600 (medium)
├── Secondary: text-slate-400 (light)
├── Links: text-indigo-600
├── Success: text-emerald-600
├── Error: text-red-600
└── Disabled: text-slate-300

Backgrounds:
├── Cards: bg-white
├── Surface: bg-slate-50
├── Overlay: bg-slate-50/30 (semi-transparent)
├── Hover: hover:bg-slate-50
├── Active: bg-indigo-700
└── Glass: bg-white/95 backdrop-blur-xl

Borders:
├── Primary: border-slate-200
├── Light: border-slate-100
├── Accent: border-white (glass effect)
├── Indigo: border-indigo-100 (nested comments)
└── Red: border-red-100 (error states)
```

---

## 🎭 Typography Scale

```
Sizes:
├── text-[9px]   → 9px   (Timestamps, small labels)
├── text-[10px]  → 10px  (Comment author, tags)
├── text-[11px]  → 11px  (Button text, small body)
├── text-xs      → 12px  (Regular text)
├── text-sm      → 14px  (Large body, post content)
└── text-base    → 16px  (Headers)

Weights:
├── font-bold    → 700 (Regular text)
└── font-black   → 900 (Headlines, buttons, labels)

Style:
├── italic       → Post content, comments
├── not-italic   → UI elements
└── uppercase    → Labels, buttons

Tracking (Letter Spacing):
├── tracking-widest  → 0.25em (Uppercase labels)
├── tracking-tighter → -0.025em (Headings)
└── tracking-wider   → 0.15em (Emphasis)
```

### Font Stack
```javascript
className="font-sans text-slate-900"
// Tailwind default: ui-sans-serif, system-ui, -apple-system
```

---

## 🎨 Component Styles

### Post Card
```
┌───────────────────────────────────────┐
│ bg-white border border-white          │ ← Border white (glass)
│ rounded-[3rem]                        │ ← Large rounded corners
│ shadow-xl hover:shadow-2xl            │ ← Deep shadow
│ overflow-hidden                       │ ← Hide overflow
│ group hover:shadow-2xl                │ ← Hover effect
│ transition-all duration-500           │ ← Smooth animation
└───────────────────────────────────────┘

Header:
├── p-7 flex justify-between items-start
└── Ring effect: ring-1 ring-slate-100

Content:
├── px-8 pb-6
├── text-sm font-bold text-slate-700
└── italic leading-relaxed

Image:
├── px-6 pb-6
├── w-full h-[400px] object-cover
├── rounded-[2.5rem] border border-white
├── shadow-2xl
└── Hover overlay: bg-black/40 backdrop-blur-xl

Actions:
├── px-8 py-5
├── border-t border-slate-50
├── bg-slate-50/10
└── flex justify-between

Comments:
├── px-8 pb-8 pt-6
├── bg-slate-50/30
└── space-y-6
```

### Nested Comment
```
Level 0 (Direct):
├── flex gap-4 group
├── [Avatar] w-10 h-10 rounded-2xl
└── bg-white p-4 rounded-[1.5rem]

Level 1+ (Reply):
├── ml-8 border-l-2 border-indigo-100 pl-6
└── Recursive rendering
```

### Button States
```
Unclicked:
├── bg-white
├── border border-slate-100
├── text-slate-400
└── hover:text-indigo-600

Clicked/Active:
├── bg-indigo-600
├── text-white
├── shadow-lg shadow-indigo-200
└── scale-110 (animate)

Saved (Bookmark):
├── bg-amber-500
├── text-white
├── shadow-lg shadow-amber-200
└── fill-current (icon filled)

Disabled:
├── opacity-50
└── cursor-not-allowed
```

---

## 🎬 Animation Library

### Keyframes
```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-top {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-from-bottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Animation Timings
```javascript
animate-in          // fade-in 0.5s
slide-in-from-top   // 0.3s
slide-in-from-top-2 // 0.4s
slide-up            // 0.4s cubic-bezier
zoom-in             // 0.5s cubic-bezier
animate-pulse       // Built-in Tailwind
transition-all      // 200-500ms (default)
```

### Usage Examples
```jsx
{/* Fade in */}
<div className="animate-in fade-in duration-700">
  Content appears with fade
</div>

{/* Slide from top */}
<div className="animate-in slide-in-from-top-2">
  Content slides down smoothly
</div>

{/* Scale up (zoom) */}
<div className="animate-in zoom-in duration-500">
  Chat window appears
</div>

{/* Hover transition */}
<button className="transition-all hover:scale-105 active:scale-95">
  Click me
</button>

{/* Group hover */}
<div className="group">
  <button className="group-hover:bg-slate-50" />
</div>
```

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:     < 640px   (Default)
Tablet:     640-1024px (md:)
Desktop:    > 1024px  (lg:)
```

### Sidebar Behavior
```
Mobile:
├── Sidebar: w-24 (always open icons only)
├── Main: ml-24
└── Less text labels

Desktop:
├── Sidebar: w-72 (expandable)
├── Main: ml-72
└── Full labels
```

### Post Grid
```
Mobile:
└── max-w-2xl (single column)

Tablet:
└── max-w-4xl (might be 2 col optional)

Desktop:
├── max-w-2xl (main view)
└── Friends: grid-cols-2
```

### Header Adjustments
```
Mobile:
├── Hidden user info
├── Smaller search bar
└── Icons only

Desktop:
├── Show user level badge
├── Full search placeholder
└── Full notification bell
```

---

## 🎯 Interactive States

### Hover Effects
```
Button:
├── scale-105 transform
├── shadow increase
├── color darken
└── transition-all 200ms

Card:
├── shadow-2xl (from shadow-xl)
├── cursor-pointer
└── smooth transition

Input:
├── ring-4 ring-indigo-100
├── bg-white (from bg-slate-100)
└── focus:border-indigo-300
```

### Active/Click Effects
```
Button on click:
├── scale-95 (press effect)
├── active:scale-95 Tailwind
└── instant feedback

Post on like:
├── Heart fills
├── Color changes to indigo
├── Count increases with animation
└── scale-110 briefly

Bookmark toggle:
├── Color: slate → amber
├── Icon: outline → filled
├── Button fills with color
└── Shadow appears
```

### Focus States (Keyboard Nav)
```
Input focus:
├── ring-4 ring-indigo-100
├── border-indigo-300
└── outline-none

Button focus:
├── ring-4 ring-indigo-100 (using Tailwind)
└── visible outline

Link focus:
├── underline appears
└── color brightens
```

---

## 🌙 Dark Mode Ready (Future)

```javascript
// Structure ready for dark mode
{/* Light mode (default) */}
className="bg-white text-slate-900"

{/* Dark mode (add when needed) */}
className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
```

---

## 📊 Layout Grid System

### Flexbox Usage
```
Row layouts:
├── flex (default direction: row)
├── justify-between (space apart)
├── justify-center (center)
├── items-center (vertical center)
└── gap-4 (spacing between items)

Column layouts:
├── flex-col (vertical)
├── items-start/end (horizontal alignment)
├── justify-between (vertical spacing)
└── space-y-4 (vertical spacing alternative)
```

### Size System
```
Width:
├── w-full (100%)
├── w-14 (3.5rem / 56px)
├── w-72 (18rem / sidebar)
└── max-w-2xl (42rem / content width)

Height:
├── h-full (100%)
├── h-24 (header)
├── h-14 (avatar)
└── h-[400px] (post image)

Padding:
├── p-3 (input)
├── p-4 (comment)
├── p-8 (post card)
└── p-6 (section)

Margin:
├── ml-72 (main container)
└── mb-4 (spacing between sections)
```

---

## 🎪 Modal / Dropdown Styles

### Menu Dropdown
```
┌─────────────────────┐
│ ⋯ Button            │
│ ├─ Option 1         │
│ ├─ Option 2         │
│ └─ Option 3         │
└─────────────────────┘

Styles:
├── absolute right-0 top-full
├── mt-2 w-48
├── bg-white rounded-2xl
├── shadow-2xl border border-slate-100
├── p-2 space-y-1
├── hidden group-hover/menu:block (show on hover)
└── z-20 (above content)
```

### Tab Navigation
```
┌─────────────────────────────────────┐
│ 📰 Tab 1 | 🔖 Tab 2 | 👥 Tab 3    │
│ ━━━━                                │
└─────────────────────────────────────┘

Styles:
├── flex gap-4
├── border-b-2 border-slate-100 pb-4
├── button with relative + bottom indicator
├── active: text-indigo-700
├── absolute bottom-0 bg-indigo-600 h-1 rounded-full
└── smooth color transition
```

---

## 📐 Spacing Constants

```javascript
// Tailwind spacing scale (4px base unit)
1   = 4px
2   = 8px
3   = 12px
4   = 16px   // Base
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
14  = 56px
16  = 64px
20  = 80px
24  = 96px
28  = 112px
32  = 128px
```

---

## 🎨 Visual Hierarchy

### Element Importance
```
Level 1 (Highest):
├── Post composer (always at top)
├── Bookmark button (high contrast)
├── Main text/content
└── Action buttons

Level 2 (Medium):
├── Secondary buttons
├── Metadata (time, location)
├── Comment text
└── Like count

Level 3 (Lowest):
├── Timestamps
├── Helper text
├── Disabled elements
└── Tooltips
```

### Visual Weight
```
Heavy:
├── Large font-black
├── Dark colors (indigo-700)
├── Large shadows
└── High contrast

Medium:
├── font-bold
├── Medium colors (indigo-600)
├── Subtle shadows
└── Normal contrast

Light:
├── Regular font
├── Light colors (slate-400)
├── No shadow
└── Low contrast
```

---

## 🔍 Micro-interactions

### Hover Feedback
```
Button hover:
  Mouse over → scale-105 + shadow increase → feels clickable

Card hover:
  Mouse over → shadow-2xl + cursor-pointer → feels interactive

Input hover:
  Mouse over → bg-white transition → ready to type
```

### Click Feedback
```
Button click:
  Mouse down → scale-95 → instant response
  Mouse up → scale-100 → spring-like feel

Bookmark click:
  Click → color changes instantly
  Background fills → icon changes → satisfying

Like button:
  Click → heart fills + color changes + count++
  Brief scale animation → fun interaction
```

### State Feedback
```
Posting state:
  Text: "ANALYZING..." 
  Icon: <Loader2 className="animate-spin" />
  Button: disabled opacity-50

Success message:
  Color: indigo-600 bg-indigo-50
  Icon: ShieldAlert
  Auto-disappear: 3000ms
```

---

## 🎊 Polish Details

### Shadows & Depth
```
Level 0: no shadow (text, simple UI)
Level 1: shadow-sm (inputs, small elements)
Level 2: shadow-md (cards)
Level 3: shadow-xl (post cards, modals)
Level 4: shadow-2xl (hovers, focus states)

Shadow colors match element color:
├── Indigo buttons: shadow-indigo-200
├── Amber bookmarks: shadow-amber-200
└── Default: shadow-slate-100
```

### Border Radius
```
Small:      rounded-lg     (8px)
Medium:     rounded-xl     (12px)
Large:      rounded-2xl    (16px)
XLarge:     rounded-3xl    (24px)
XXLarge:    rounded-[2.5rem] (40px)
Huge:       rounded-[3rem] (48px)

Usage:
├── Small inputs/buttons → rounded-lg
├── Avatar images → rounded-2xl
├── Post cards → rounded-[3rem]
├── Post composer → rounded-3xl
└── Modal/sheets → rounded-[3rem]
```

### Backdrop Blur
```
backdrop-blur-sm    (4px blur)
backdrop-blur-md    (12px blur)
backdrop-blur-lg    (16px blur)
backdrop-blur-xl    (24px blur)  ← Used in Community

Effect:
├── Glass morphism look
├── Frosted glass appearance
├── Transparent with blur background
└── Premium feel
```

---

**🎨 Design System Complete! Ready to build beautiful UIs! ✨**
