# MOJAR — إيصال استلام من مورد BTC

أداة يومية لتسجيل إيصالات استلام الذهب من مورد BTC: تحسب المصنعية تلقائيًا من جدول الجملة،
تحوّل وزن عيار 24 إلى ما يعادله في عيار 21، تجمع الإجمالي النهائي والنقدية، وتحفظ كل
الإيصالات في قاعدة بيانات داخل المتصفح مع بحث، وتصدير PDF و Excel، ونسخ احتياطية.

---

## الملفات (Files)

| الملف | الوصف |
|---|---|
| `index.html` | الصفحة الرئيسية للتطبيق |
| `styles.css` | كل التنسيقات |
| `app.js` | منطق التطبيق (الحسابات، قاعدة البيانات، البحث، التصدير) |
| `data.js` | **جداول أسعار BTC** — عدّل هنا المصنعية كل موسم |
| `xlsx.full.min.js` | مكتبة تصدير Excel (محليًا — تشتغل بدون إنترنت) |
| `manifest.json`, `sw.js` | لتثبيت التطبيق وتشغيله أوفلاين (PWA) |
| `icon-*.png` | أيقونات التطبيق |

> لتعديل الأسعار: افتح `data.js`، عدّل رقم `fee` لأي صنف، واحفظ الملف. مثال:
> `{n:"سبيكة 100 جرام", w:100, fee:56}` — رقم 56 هو المصنعية+الدمغة.

---

## التشغيل اليومي السريع
افتح `index.html` بالضغط المزدوج (Chrome أو Edge). البيانات تتحفظ تلقائيًا على نفس الجهاز/المتصفح.

> ملاحظة: لتشغيل التثبيت كتطبيق ويندوز والعمل أوفلاين بالكامل، شغّله من خادم (محلي أو موقع) — مش من ملف مباشر. الطرق تحت.

---

## الطريقة 1 — تثبيته كتطبيق ويندوز (الأسهل، PWA)

1. ارفع المجلد على أي استضافة مجانية (انظر "نشره كموقع" تحت)، أو شغّله محليًا:
   - ثبّت Python (مرة واحدة)، وافتح cmd داخل مجلد التطبيق واكتب:
     ```
     python -m http.server 8080
     ```
   - افتح المتصفح على `http://localhost:8080`
2. في Chrome/Edge، اضغط أيقونة **التثبيت** في شريط العنوان (أو القائمة ← "تثبيت MOJAR").
3. هيتفتح كنافذة تطبيق مستقلة، وهيظهر له أيقونة في قائمة ابدأ وسطح المكتب.
4. بعد التثبيت بيشتغل **أوفلاين بالكامل** (بفضل service worker).

---

## الطريقة 2 — نشره كموقع (Website)

أي خدمة استضافة ملفات ثابتة تنفع. الأسهل:

**Netlify (سحب وإفلات):**
1. ادخل https://app.netlify.com/drop
2. اسحب مجلد `mojar-app` كله إلى الصفحة.
3. هيديك رابط فورًا (مثال: `https://your-name.netlify.app`). افتحه وثبّته كتطبيق.

**GitHub Pages:**
1. ارفع الملفات في مستودع GitHub.
2. Settings ← Pages ← Branch: main / root ← Save.
3. الرابط: `https://username.github.io/repo-name/`

**Vercel:** اربط المستودع أو ارفع المجلد، وهينشره تلقائيًا.

> بعد النشر على HTTPS، أي حد يفتح الرابط يقدر يثبّته كتطبيق على ويندوز/أندرويد/آيفون.

---

## النسخ الاحتياطي ونقل البيانات
- البيانات محفوظة محليًا في المتصفح لكل جهاز على حدة.
- من تبويب **المحفوظات** اضغط **نسخة احتياطية (JSON)** لتنزيل كل الإيصالات في ملف.
- على جهاز آخر، اضغط **استيراد** واختر الملف لاسترجاع/دمج البيانات.
- اعمل نسخة JSON كل فترة كاحتياط.

---

## الطريقة 3 (اختياري) — ملف exe حقيقي لويندوز
لو محتاج ملف تنفيذي مستقل، غلّف المجلد بـ **Tauri** (أخف) أو **Electron**:

```
# Electron (مثال مختصر)
npm init -y
npm install electron --save-dev
# اعمل main.js يفتح index.html في نافذة، ثم:
npx electron .
# للبناء كـ .exe:
npm install electron-builder --save-dev
npx electron-builder --win
```

غالبًا تثبيت PWA (الطريقة 1) كافٍ تمامًا للاستخدام اليومي وأبسط بكثير.

---

## English (quick)
Single-page offline app. **Daily use:** double-click `index.html`.
**Install as Windows app:** serve the folder (`python -m http.server 8080` or host it),
open in Chrome/Edge, click *Install*. Works fully offline after install.
**Deploy as website:** drag the folder to https://app.netlify.com/drop or use GitHub Pages / Vercel.
**Prices:** edit `fee` values in `data.js`. **Backup:** Archive tab → Backup (JSON) / Import.

The MOJAR receipt number is auto-generated and increments per saved receipt; the BTC delivery
receipt number is entered manually. Data is stored in the browser per device; use JSON backup to move it.
