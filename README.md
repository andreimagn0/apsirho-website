# Alpha Psi Rho — Alpha Chapter Website
**San Diego State University**

A clean, collegiate website for the Alpha Chapter of Alpha Psi Rho fraternity. Built with React.

---

## 🗂 Project Structure

```
src/
  components/
    Navbar.jsx / .css       ← Sticky nav with mobile menu
    Hero.jsx / .css         ← Full-screen landing section
    About.jsx / .css        ← Mission statement + exec board
    History.jsx / .css      ← Timeline of fraternity history
    Brothers.jsx / .css     ← Filterable active brothers roster
    Newsletter.jsx / .css   ← Archive + email signup
    Contact.jsx / .css      ← Rush steps + contact form
    Footer.jsx / .css       ← Links, contact, motto
  App.jsx                   ← Assembles all sections
  index.js                  ← React entry point
  index.css                 ← Global styles + design tokens
public/
  index.html                ← HTML shell + Google Fonts
```

---

## ✏️ Customizing Content

### Brothers Roster (`src/components/Brothers.jsx`)
Replace the `BROTHERS` array with your actual roster:
```js
const BROTHERS = [
  { name: 'Full Name', year: 'Senior', major: 'Major', pledge: 'Fall 2023' },
  // ...
];
```

### Executive Board (`src/components/About.jsx`)
Update the array inside `about__eboard-grid`:
```js
{ role: 'President', name: 'Your Name Here' },
```

### History Timeline (`src/components/History.jsx`)
Replace the `TIMELINE` array with your chapter's actual history and founding dates.

### Newsletter Issues (`src/components/Newsletter.jsx`)
Replace the `ISSUES` array and update `link` fields to point to actual PDF/page URLs.

### Contact Info (`src/components/Contact.jsx` + `Footer.jsx`)
Update the email address `sdsuapsirho@gmail.com` and social media links (`#` placeholders).

### Colors / Fonts (`src/index.css`)
All design tokens live in `:root {}` — tweak `--navy`, `--gold`, fonts, etc. there.

---

## 🚀 Running Locally

```bash
npm install
npm start
# Opens at http://localhost:3000
```

---

## 🌐 Deploying to Vercel (Free + Custom Domain)

### Step 1 — Push to GitHub
1. Create a free account at [github.com](https://github.com)
2. Create a new repository called `apsirho-website`
3. Run these commands in your project folder:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/apsirho-website.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `apsirho-website` repository
4. Leave all settings as default — Vercel auto-detects React
5. Click **Deploy**
6. Your site is now live at `apsirho-website.vercel.app` 🎉

### Step 3 — Buy a Custom Domain (~$12/year)
Recommended registrars: [Namecheap](https://namecheap.com) or [Porkbun](https://porkbun.com)

Suggested domains:
- `sdsuapsirho.org`
- `apsirhoalpha.org`
- `apsirhosdsu.com`

### Step 4 — Connect Domain to Vercel
1. In your Vercel project, go to **Settings → Domains**
2. Add your custom domain (e.g. `sdsuapsirho.org`)
3. Copy the DNS records Vercel gives you
4. In your domain registrar's DNS settings, add those records
5. Wait 10–30 min for DNS to propagate — done! ✅

---

## 🔧 Future Enhancements
- [ ] Add real brother photos (replace initials avatars)
- [ ] Connect contact form to Formspree or EmailJS (free)
- [ ] Add a photo gallery / events page
- [ ] Connect newsletter signup to Mailchimp
- [ ] Add Google Calendar embed for events
