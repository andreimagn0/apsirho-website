
# Alpha Psi Rho — Alpha Chapter Platform

> Production-ready website and content management system built with **React, Vite, Supabase, PostgreSQL, and Vercel**.

**Live Site:** https://alphapsirho.org

---

## Project Summary

Alpha Psi Rho is a production-ready web platform developed for the Alpha Chapter of Alpha Psi Rho at San Diego State University. The platform combines a modern public-facing website with a secure Brother Portal that enables chapter leadership to manage organizational content through a custom content management system (CMS) instead of modifying source code.

Built with React, Vite, Supabase, PostgreSQL, and Vercel, the project emphasizes maintainability, security, and long-term sustainability. Authentication, authorization, database access, and object storage are handled through Supabase, while deployment is automated through Vercel.

---

## Project Motivation

Alpha Psi Rho's Alpha Chapter is a growing fraternity with a strong emphasis on brotherhood, academics, prosperity, and strength. As the chapter expanded, it lacked a modern platform that accurately represented those values while also providing secure tools for members to manage chapter resources.

This project was created to solve both challenges by combining a professional public-facing website with a secure Brother Portal. The public website introduces prospective members, alumni, and visitors to the organization, while the Brother Portal provides authenticated members with secure access to chapter management tools, archives, newsletters, and internal resources.

As a member of the chapter, I wanted to build a platform that represented the professionalism of the organization while creating infrastructure that would continue to benefit future generations of brothers. Rather than developing a simple informational website, I focused on building a secure, maintainable content management system that chapter leadership can continue to use and expand without requiring changes to the underlying codebase.

---

## Engineering Highlights

- Production-ready Single Page Application (SPA)
- Component-based frontend architecture using React + Vite
- Custom Content Management System (CMS)
- Supabase Authentication with password recovery
- Role-Based Access Control (RBAC)
- PostgreSQL Row Level Security (RLS)
- Secure cloud file storage with Supabase Storage
- Responsive desktop and mobile experience
- Secure CRUD operations across administrative modules
- Production deployment with GitHub, Vercel, and a custom domain

---

## Technology Stack

### Frontend
- React
- Vite
- JavaScript (ES6+)
- HTML5
- CSS3

### Backend
- Supabase

### Database
- PostgreSQL
- Row Level Security (RLS)

### Authentication
- Supabase Auth
- Session Management
- Password Recovery

### Storage
- Supabase Storage

### Deployment
- Vercel
- GitHub
- Git

---

## Feature Overview

### Public Website
- Chapter information
- Brother directory
- Executive board
- Archive
- Newsletter
- Contact page

### Brother Portal
- Secure login
- Password recovery
- Protected routes

### CMS
- Brother management
- Pledge class management
- Executive board management
- Archive management
- Newsletter management

### Media
- Image upload
- Image replacement
- Non-destructive image framing
- Automatic storage cleanup

### Security
- Database-level authorization
- Upload validation
- Storage policies
- Approved administrator workflow

---

## Architecture Overview

```text
Browser
   │
React + Vite
   │
Supabase Client
   ├── Authentication
   ├── PostgreSQL (RLS)
   └── Storage
```

See `docs/ARCHITECTURE.md` for the complete system design.

---

## Project Structure

```text
src/
  components/
  pages/
    public/
    admin/
  lib/
docs/
screenshots/
diagrams/
```

---

## Getting Started

```bash
git clone <repository>
cd apsirho-website
npm install
npm run dev
```

Environment variables:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_publishable_key
```

Build:

```bash
npm run build
npm run preview
```

---

## Documentation

Additional documentation:

- ARCHITECTURE.md
- SECURITY.md
- DATABASE.md
- STORAGE.md
- DEPLOYMENT.md
- ADMIN_GUIDE.md
- CHANGELOG.md

---

## Roadmap

### Version 1.1
- Resend SMTP
- Cloudflare Turnstile
- Open Graph metadata
- Favicon improvements

### Version 1.2
- Alumni directory
- Search
- Mobile UX improvements

### Future
- Event management
- Expanded roles
- Audit logging

---

## License

MIT
