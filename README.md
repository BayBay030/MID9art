# 藝術家極簡官網

純 HTML / CSS / JS，無打包、無依賴。本機開靜態伺服器就能跑，部署到 GitHub Pages 即上線。

## 本機預覽

```bash
cd "James web"
python3 -m http.server 8000
# 開 http://localhost:8000
```

或用任何靜態伺服器：`npx serve`, `live-server`, VS Code Live Preview 都可以。

> ⚠️ 不可直接雙擊 `index.html` 開檔案（`file://`），因為 `fetch()` 讀 JSON 在 `file://` 下會被瀏覽器擋。

## 加新作品

1. 把 jpg 丟到 `images/<年份>/<slug>.jpg`
   - 例：`images/2025/red-river.jpg`
   - slug 用小寫英文 + 連字號，不要空格 / 中文
   - 建議事先壓縮：寬 1600–2000px、jpg 品質 80–85（可用 [Squoosh](https://squoosh.app)）
2. 編輯 `data/manifest.json`，在 `works` 陣列加一筆：

```json
{
  "year": 2025,
  "slug": "red-river",
  "image": "images/2025/red-river.jpg",
  "title": { "zh": "紅河", "en": "Red River" },
  "medium": { "zh": "壓克力 / 畫布", "en": "Acrylic on canvas" },
  "dimensions": "180 × 240 cm",
  "featured": false
}
```

3. `featured: true` 會出現在首頁 hero 與精選滾動區（建議 3–6 件）
4. 重整網頁即生效

## 加 / 改文字（CV、動態、UI）

- **CV**：編輯 `data/cv.json`（中英分欄）
- **動態**：編輯 `data/news.json`（日期、雙語標題與內文）
- **導覽 / 標題 / 雙語介面文字**：編輯 `i18n/zh.json` 與 `i18n/en.json`
- **About bio 內文**：直接改 `i18n/zh.json` 與 `i18n/en.json` 的 `about.bio`（支援 HTML）

## 改視覺

`css/style.css` 頂端 `:root` 是設計變數，最常動的：

```css
--bg: #ffffff;       /* 背景 */
--fg: #111111;       /* 主文字 */
--muted: #888888;    /* 次文字 */
--hairline: #e8e8e8; /* 分隔線 */
--serif: "Cormorant Garamond", "Noto Serif TC", Georgia, serif;
--sans: "Inter", "Noto Serif TC", -apple-system, sans-serif;
--gutter: clamp(20px, 4vw, 56px);  /* 全站邊距 */
--nav-h: 64px;       /* 導覽列高度 */
```

## 檔案結構

```
.
├── index.html          # 首頁（hero + 精選）
├── work.html           # 作品總覽（年份分區）
├── about.html          # About + CV
├── news.html           # 動態
├── contact.html        # 聯絡
├── css/style.css
├── js/
│   ├── i18n.js         # 中英切換
│   ├── main.js         # nav、淡入、lightbox
│   ├── works.js        # 首頁 + 作品頁渲染
│   ├── cv.js           # About 頁 CV 渲染
│   └── news.js         # 動態頁渲染
├── data/
│   ├── manifest.json   # 作品清單
│   ├── cv.json         # CV
│   └── news.json       # 動態
├── i18n/
│   ├── zh.json
│   └── en.json
├── images/<year>/      # 作品圖
└── CNAME               # 自訂網域（部署時建立）
```

## 部署到 GitHub Pages（免費）+ 自訂網域

### 一、推上 GitHub

```bash
cd "James web"
git init
git add .
git commit -m "init: artist site"
# 在 GitHub 建一個 public repo 叫 jamesweb（或任意名）
git branch -M main
git remote add origin git@github.com:<username>/<repo>.git
git push -u origin main
```

### 二、開 Pages

- GitHub repo → **Settings** → **Pages**
- Source 選 **Deploy from a branch**
- Branch 選 `main`，資料夾 `/ (root)`，按 Save
- 一兩分鐘後預設網址會是 `https://<username>.github.io/<repo>/`

### 三、自訂網域

1. 在專案根目錄建一個 `CNAME` 檔，內容只放網域（不含 `https://`、不含結尾斜線）：
   ```
   www.example.com
   ```
   推上去後 Pages 設定會自動帶入。
2. 在你的網域 DNS 後台設定：
   - **`www` 子網域** → CNAME 紀錄指向 `<username>.github.io`
   - **裸網域（`example.com`）** → 設四筆 A 紀錄指向 GitHub IP：
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
3. 回 GitHub Pages 設定頁，勾選 **Enforce HTTPS**（憑證簽發約 10 分鐘 ~ 1 小時生效）

完成後 `https://www.example.com` 直接連到網站。

## 待你補的內容

- 藝術家中英文姓名 → 改 `i18n/{zh,en}.json` 的 `brand.name` 與 `home.title`
- Tagline → `home.tagline`
- About bio → `about.bio`
- CV 各欄 → `data/cv.json`
- 動態 → `data/news.json`
- 聯絡 Email → `contact.html` 內 `mailto:` 與社群連結
- 個人照 → 改 `data/cv.json` 的 `portrait` 路徑（例如 `images/portrait.jpg`）
- 作品圖 → 依上面流程丟進 `images/<year>/` + 寫進 manifest
