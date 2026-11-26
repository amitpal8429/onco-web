# Medical Global Academy: Oncology Website

An oncology fellowships and courses website for doctors after MBBS, built with Vite, React, React Router and Tailwind CSS. It has no backend.

> **Note:** Courses are live from the course API. Faculty, hospitals and reviews on the Home page are still placeholders, so they only show during `npm run dev`. The enquiry form and Login/Sign Up do not send or save anything yet.

## Setup

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal, usually `http://localhost:5173`.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates the production site in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with ESLint |

## Kaise badlein

### Courses data

Courses load live from `https://24x7.medicalglobalacademy.com/api/course-list`. The code is in `src/data/oncologyCourseApi.js`.

- **Which courses show:** A course appears if its name, category or department contains "onco". To add or remove one, change its details in the course admin.
- **Home page courses:** Edit `FEATURED_SLUGS` in the same file.
- **Fees and text:** Change them in the course admin. They update here automatically.
- **Course page content:** Highlights, learning points, workshops and curriculum load from `https://24x7.medicalglobalacademy.com/api/course-details/{slug}`.
- **Curriculum clean-up:** The code joins lessons that were split across rows, and removes brochure text from the "International Accreditation" line onward. Fix the source text in the course admin where you can.
- **Hidden content:** `WRONG_CONTENT_SLUGS` hides highlights, learning points and workshops for a course with wrong content. Remove the slug once its content is fixed.

### Doctors page

`src/data/oncologyDoctors.js` lists dummy doctors, so its route (`/doctor`) and nav link only exist during `npm run dev`. Once the real list is in that file, set `SHOW_DOCTORS` to `true` in `src/data/site.js`. Set `FACULTY_CONFIRMED` to `true` in `Doctor.jsx` to show the verified strip once the credentials are confirmed.

### Dummy marker

- **Top banner:** Set `SHOW_DUMMY_BANNER` to `false` in `src/data/site.js`.

### Colors and fonts

Edit the `@theme` block in `src/index.css`. For example, changing `--color-primary-800` updates everything that uses that shade. Fonts are set by `--font-display` and `--font-sans`, and are installed through the `@fontsource-variable` packages.

The Home, About, Contact, Courses, Doctors, Privacy Policy, Refund, Sitemap and Terms pages have their own brand (emerald, coral, lilac and cream, with Fraunces and DM Sans). Its colors are the `fern`, `coral`, `lilac`, `cream` and `bark` tokens in the same `@theme` block. `.theme-fern` in `src/index.css` maps the shared tokens onto them, and `src/components/Layout.jsx` applies that class to the paths in `FERN_ROUTES`. To use this brand on another page, add its path there. Shared pieces of the brand are in `src/components/FernKit.jsx`.

### Contact details and logo

- **Email and phone:** Edit `contact` in `src/data/site.js`.
- **Logo and specialty label:** Edit `logoUrl` and `specialty` in `src/data/site.js`.
- **Footer links:** Edit `courseTypeLinks`, `legalLinks` and `socialLinks` in `src/data/site.js`.
- **Page text:** Edit the files in `src/pages/`. Each page sets its own title and description through the `Seo` component.

### Enquiry form

The form only validates input for now, and nothing is sent or saved. To connect a real service, search `src/pages/Contact.jsx` for `TODO`. Replace `mockSubmitEnquiry` and update the demo message shown after submit.

### Home page sections

Faculty, hospitals and reviews on the Home page are placeholders, so they only show during `npm run dev` and stay out of the production build. Once a list is confirmed, edit it in `src/pages/Home.jsx` and set its switch to `true`: `SHOW_FACULTY`, `SHOW_HOSPITALS` or `SHOW_TESTIMONIALS`.

The FAQ answers are in `src/data/oncologyFaqs.js`.

### Login and Sign Up

The modal only validates input for now. Nothing is sent or saved, and nobody is actually logged in. To connect a real service, search `src/components/AuthModal.jsx` for `TODO`.

## Deployment

This site uses client-side routing, so the host must send every URL to `index.html`. Otherwise, opening a link like `/courses` directly can return the host's own 404 page.

- **Netlify:** Add a `public/_redirects` file containing `/* /index.html 200`.
- **Vercel:** Add a `vercel.json` file containing `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- **Other hosts:** Set up an equivalent fallback to `index.html`.
