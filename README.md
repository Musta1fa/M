# ⚡ GSAP 2027 Hyper-Motion Web Showcase

موقع استعراضي تفاعلي متقدم فائق السرعة والأداء مبني بأحدث معايير الويب لعام 2027، ومستوحى من موقع **GSAP.com** الرسمي، ومجهز بالكامل للنشر الفوري والمجاني على **GitHub Pages** وربط دومين مخصص (Custom Domain).

---

## 🌟 الميزات والحركات المضمنة

- **Scroll Animations & Pinning**: تثبيت الشاشة وتحويل التمرير العمودي إلى أفقي بسلاسة تامة عبر GSAP ScrollTrigger.
- **Lenis Smooth Scroll**: تكامل حقيقي مع Ticker الخاص بـ GSAP لضمان ثبات الإطارات عند 120 FPS وانعدام التقطيع (Jank).
- **Adaptive Custom Cursor**: مؤشر مخصص مدعوم بالـ Lerp مع انعكاس لوني ذكي (`difference`) والتصاق مغناطيسي فوق الأزرار (`Magnetic Snapping`).
- **Kinetic Text Decoder**: تأثير فك التشفير السيبراني للنصوص والعناوين في الوقت الفعلي.
- **3D Hero Parallax & Card Tilt**: محاكاة الإمالة ثلاثية الأبعاد وانعكاس الضوء الكاشف على البطاقات عند تحريك الفأرة.
- **Interactive Motion & Easing Playground**: معمل تفاعلي حي لاختبار منحنيات الحركة الفيزيائية (Elastic, Bounce, Power4, Expo) ورسم المنحنى في Canvas ونسخ كود GSAP بنقرة واحدة.
- **Bilingual & Multi-Theme**: دعم كامل للغتين العربية والإنجليزية (RTL / LTR) مع 3 ثيمات عصرية (Dark Void, Cyber Neon, Light Obsidian).

---

## 🚀 طريقة الرفع على GitHub Pages وربط دومين مخصص (Quickstart for GitHub Pages)

المشروع مصمم ليعمل كـ **Static Website** نقي، مما يجعله ينشر فوراً على GitHub Pages بدون أي أوامر بناء (Build Steps):

### الخطوة 1: إنشاء مستودع على GitHub
1. ادخل إلى حسابك على GitHub واضغط على **New Repository**.
2. سمِّ المستودع باسم تختاره (مثلاً: `gsap-motion-showcase`).
3. اضبط المستودع على **Public** واضغط **Create repository**.

### الخطوة 2: رفع ملفات المشروع
قم برفع الملفات التالية إلى الفرع الرئيسي (`main`):
- `index.html`
- `styles.css`
- مجلد `js/` وبداخله `app.js`

أو عبر سطر الأوامر (Git CLI):
```bash
git init
git add .
git commit -m "feat: initial 2027 GSAP showcase"
git branch -M main
git remote add origin https://github.com/USERNAME/gsap-motion-showcase.git
git push -u origin main
```

### الخطوة 3: تفعيل GitHub Pages
1. من صفحة المستودع على GitHub، اضغط على **Settings** (الإعدادات).
2. في القائمة الجانبية، اضغط على **Pages**.
3. تحت قسم **Build and deployment**:
   - Source: اختر `Deploy from a branch`.
   - Branch: اختر `main` والمجلد `/ (root)`.
4. اضغط **Save**. خلال دقيقة واحدة سيصبح موقعك متاحاً على الرابط:
   `https://USERNAME.github.io/gsap-motion-showcase/`

### الخطوة 4: ربط دومين مخصص (Custom Domain)
1. في نفس صفحة **GitHub Pages**:
   - اكتب اسم الدومين الخاص بك في حقل **Custom domain** (مثال: `mybrand.com` أو `motion.dev`) واضغط **Save**.
2. في لوحة تحكم شركة الدومينات الخاصة بك (Namecheap, GoDaddy, Cloudflare, إلخ)، أضف سجلات الـ DNS التالية:
   - **سجلات A Record**:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **سجل CNAME** (إذا كنت تستخدم `www`):
     - Host: `www`
     - Target: `USERNAME.github.io`
3. قم بتفعيل خيار **Enforce HTTPS** في GitHub للحصول على شهادة SSL مجانية للأمان.

---

## 🛠️ الملفات والتقنيات المستخدمة
- **GSAP 3.12.5 & ScrollTrigger**
- **Lenis Smooth Scroll Engine**
- **HTML5 Semantic & Modern CSS Tokens**
- **Lucide Icons**
