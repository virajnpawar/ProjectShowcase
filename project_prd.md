# Project Requirements Document (PRD)
## Project Showcase Platform

**Version:** 1.0  
**Last Updated:** November 25, 2025  
**Document Owner:** Development Team

---

## 1. Executive Summary

### 1.1 Project Overview
A web-based project showcase platform that enables administrators to create, manage, and display portfolio projects with a flexible drag-and-drop content management system. The platform will serve as a dynamic portfolio website with robust admin capabilities.

### 1.2 Objectives
- Provide an intuitive interface for creating and managing project showcases
- Enable flexible content layouts through drag-and-drop functionality
- Deliver a fast, responsive viewing experience for visitors
- Maintain simple deployment and hosting workflows

### 1.3 Success Metrics
- Admin can create and publish a project in under 10 minutes
- Page load time under 2 seconds for project pages
- 100% responsive across mobile, tablet, and desktop
- Zero-downtime deployments via GitHub integration

---

## 2. Technology Stack

### 2.1 Frontend
- **Framework:** Astro (Static Site Generation with Islands Architecture)
- **UI Components:** shadcn/ui (React-based components)
- **Styling:** Tailwind CSS (built into shadcn/ui)
- **Rich Text Editor:** Tiptap or similar React-based editor

### 2.2 Backend
- **Database & Auth:** PocketBase (SQLite-based backend)
  - Built-in admin UI
  - RESTful API
  - Real-time subscriptions
  - File storage
  - Authentication system

### 2.3 Deployment & Hosting
- **Version Control:** GitHub
- **Frontend Hosting:** Netlify or Vercel (GitHub integration)
- **Backend Hosting:** 
  - PocketBase on VPS (DigitalOcean, Hetzner, or similar)
  - Alternative: PocketHost (managed PocketBase hosting)

### 2.4 Additional Tools
- **Form Handling:** React Hook Form
- **Drag & Drop:** @dnd-kit/core
- **Icons:** Lucide React
- **Image Optimization:** Astro's built-in image optimization

---

## 3. System Architecture

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────┐
│         GitHub Repository               │
│  (Source Code + Static Assets)          │
└──────────────┬──────────────────────────┘
               │
               │ Push/Commit
               ▼
┌─────────────────────────────────────────┐
│      Netlify/Vercel (CI/CD)             │
│  - Automatic builds on push             │
│  - Astro SSG compilation                │
│  - CDN distribution                     │
└──────────────┬──────────────────────────┘
               │
               │ Deployed Static Site
               ▼
┌─────────────────────────────────────────┐
│       Public Website (Astro)            │
│  - Server-side rendered pages           │
│  - React Islands for interactivity      │
│  - Optimized static assets              │
└──────────────┬──────────────────────────┘
               │
               │ API Calls (REST)
               ▼
┌─────────────────────────────────────────┐
│      PocketBase Backend (VPS)           │
│  - SQLite Database                      │
│  - Admin Authentication                 │
│  - File Storage                         │
│  - API Endpoints                        │
└─────────────────────────────────────────┘
```

### 3.2 Data Flow

**Admin Creating Project:**
1. Admin logs into PocketBase admin panel or custom admin interface
2. Creates project record with metadata
3. Uploads media files to PocketBase storage
4. Saves content blocks as JSON in database
5. Sets visibility status (draft/published)

**Visitor Viewing Project:**
1. Visitor requests project page
2. Astro fetches project data from PocketBase API at build time
3. Static HTML generated with all content
4. Page served from CDN
5. Interactive elements hydrated with React Islands

---

## 4. Database Schema (PocketBase Collections)

### 4.1 Collections Structure

#### **users** (built-in PocketBase collection)
- `id` (auto)
- `email` (email, required, unique)
- `username` (text, required, unique)
- `role` (select: 'super_admin', 'editor', 'viewer')
- `created` (date, auto)
- `updated` (date, auto)

#### **projects**
- `id` (auto)
- `title` (text, required, min: 3, max: 200)
- `slug` (text, required, unique, pattern: ^[a-z0-9-]+$)
- `excerpt` (text, max: 300)
- `featured_image` (file, single, max: 5MB)
- `content_blocks` (json, stores array of content blocks)
- `status` (select: 'draft', 'published', 'hidden', 'scheduled')
- `featured` (bool, default: false)
- `publish_date` (date, optional)
- `view_count` (number, default: 0)
- `author` (relation to users)
- `created` (date, auto)
- `updated` (date, auto)

#### **categories**
- `id` (auto)
- `name` (text, required, unique)
- `slug` (text, required, unique)
- `description` (text, optional)
- `created` (date, auto)

#### **tags**
- `id` (auto)
- `name` (text, required, unique)
- `slug` (text, required, unique)
- `created` (date, auto)

#### **project_metadata**
- `id` (auto)
- `project` (relation to projects, required)
- `client_name` (text, optional)
- `project_date` (date, optional)
- `technologies` (json, array of strings)
- `team_members` (json, array of strings)
- `project_type` (text, optional)
- `live_url` (url, optional)
- `github_url` (url, optional)
- `case_study_file` (file, single, optional)

#### **project_categories** (many-to-many junction)
- `id` (auto)
- `project` (relation to projects)
- `category` (relation to categories)

#### **project_tags** (many-to-many junction)
- `id` (auto)
- `project` (relation to projects)
- `tag` (relation to tags)

#### **media_library**
- `id` (auto)
- `file` (file, single, max: 10MB)
- `title` (text, optional)
- `alt_text` (text, optional)
- `file_type` (select: 'image', 'video', 'document')
- `file_size` (number, auto)
- `uploaded_by` (relation to users)
- `created` (date, auto)

#### **project_analytics**
- `id` (auto)
- `project` (relation to projects)
- `views` (number, default: 0)
- `unique_visitors` (number, default: 0)
- `date` (date, required)

### 4.2 Content Blocks JSON Structure

The `content_blocks` field in the projects collection stores an array of block objects:

```json
[
  {
    "id": "block_1",
    "type": "title",
    "order": 0,
    "content": {
      "text": "Project Title",
      "level": "h1",
      "alignment": "center"
    }
  },
  {
    "id": "block_2",
    "type": "paragraph",
    "order": 1,
    "content": {
      "html": "<p>Rich text content here...</p>",
      "alignment": "left"
    }
  },
  {
    "id": "block_3",
    "type": "image",
    "order": 2,
    "content": {
      "url": "https://pocketbase-url/api/files/...",
      "alt": "Image description",
      "caption": "Image caption",
      "size": "large"
    }
  },
  {
    "id": "block_4",
    "type": "video",
    "order": 3,
    "content": {
      "url": "https://youtube.com/watch?v=...",
      "type": "embed",
      "autoplay": false
    }
  },
  {
    "id": "block_5",
    "type": "embed",
    "order": 4,
    "content": {
      "code": "<iframe src='...'></iframe>",
      "height": "500px"
    }
  }
]
```

---

## 5. Features & Requirements

### 5.1 Phase 1 (MVP) - Core Features

#### 5.1.1 Authentication & Authorization
**Priority:** High  
**Estimated Effort:** Medium

**Requirements:**
- Admin login using PocketBase authentication
- Session management with JWT tokens
- Password reset functionality
- Single admin role initially (can expand later)

**Technical Implementation:**
- Use PocketBase SDK for authentication
- Store auth token in httpOnly cookies
- Protected API routes checking authentication

**Acceptance Criteria:**
- [ ] Admin can register an account
- [ ] Admin can log in with email/password
- [ ] Admin can reset password via email
- [ ] Admin session persists across page reloads
- [ ] Unauthorized users cannot access admin pages

---

#### 5.1.2 Admin Dashboard
**Priority:** High  
**Estimated Effort:** Large

**Requirements:**
- Overview page with key statistics
- List all projects with filtering
- Quick actions (edit, delete, duplicate, toggle visibility)
- Search functionality
- Responsive layout

**Technical Implementation:**
- Astro page with React Island for interactive table
- Use shadcn/ui Table, Button, Badge components
- PocketBase API calls for CRUD operations
- Client-side search and filtering

**Acceptance Criteria:**
- [ ] Dashboard displays total projects count
- [ ] Projects listed in sortable table
- [ ] Search filters projects in real-time
- [ ] Quick visibility toggle works without page reload
- [ ] Delete action shows confirmation dialog
- [ ] Responsive on mobile devices

---

#### 5.1.3 Project Editor (Drag & Drop)
**Priority:** High  
**Estimated Effort:** Very Large

**Requirements:**
- Add content blocks: Title, Heading, Paragraph, Image, Video, Embed
- Drag and drop to reorder blocks
- Delete and duplicate blocks
- Rich text editing for paragraph blocks
- Image upload with preview
- Video embed (YouTube, Vimeo) and upload
- Custom HTML/iframe embed
- Save as draft or publish
- Real-time preview

**Technical Implementation:**
- React component with @dnd-kit for drag & drop
- Tiptap for rich text editing
- File upload to PocketBase storage
- Store blocks as JSON array in database
- Use shadcn/ui form components
- Debounced auto-save functionality

**Block Components:**
- TitleBlock: Input with heading level selector
- HeadingBlock: Input with H2-H6 selector
- ParagraphBlock: Tiptap editor with toolbar
- ImageBlock: File upload + URL input, alt text, caption
- VideoBlock: YouTube/Vimeo URL or file upload
- EmbedBlock: Textarea for HTML/iframe code

**Acceptance Criteria:**
- [ ] Can add any block type from toolbar
- [ ] Blocks can be reordered via drag & drop
- [ ] Visual feedback during drag (highlight drop zones)
- [ ] Can delete blocks with confirmation
- [ ] Can duplicate existing blocks
- [ ] Rich text editor supports bold, italic, links, lists
- [ ] Images upload successfully and display preview
- [ ] Video embeds render correctly
- [ ] Custom HTML embeds work (with security warnings)
- [ ] Changes save automatically every 30 seconds
- [ ] Can manually save as draft or publish

---

#### 5.1.4 Project Metadata & Settings
**Priority:** High  
**Estimated Effort:** Medium

**Requirements:**
- Basic fields: Title, Slug, Excerpt, Featured Image
- Category selection (single or multiple)
- Tag input (create new tags on the fly)
- Visibility settings: Draft, Published, Hidden, Featured
- SEO fields: Meta title, Meta description
- External links: Live URL, GitHub URL

**Technical Implementation:**
- Form using React Hook Form + Zod validation
- shadcn/ui Select, Input, Textarea components
- Auto-generate slug from title
- Tag input with autocomplete
- Featured image upload to PocketBase

**Acceptance Criteria:**
- [ ] Title is required, minimum 3 characters
- [ ] Slug auto-generates from title
- [ ] Slug can be manually edited
- [ ] Excerpt limited to 300 characters
- [ ] Featured image uploads successfully
- [ ] Can select multiple categories
- [ ] Can add new tags inline
- [ ] Visibility can be changed easily
- [ ] SEO fields are optional but recommended
- [ ] External URLs validate as proper URLs

---

#### 5.1.5 Public Project Listing Page
**Priority:** High  
**Estimated Effort:** Medium

**Requirements:**
- Grid layout of project cards
- Show: Featured image, Title, Excerpt, Categories
- Filter by category
- Search by title
- Sort by: Newest, Oldest, Most Viewed
- Pagination (12 projects per page)
- Responsive design

**Technical Implementation:**
- Astro SSG page fetching all published projects
- Use Astro's pagination feature
- shadcn/ui Card components
- Client-side filtering/search with React Island
- Lazy load images

**Acceptance Criteria:**
- [ ] Shows only published projects
- [ ] Featured projects appear at top
- [ ] Cards display correctly on all devices
- [ ] Category filter works instantly
- [ ] Search filters as user types
- [ ] Pagination works correctly
- [ ] Images load optimized and lazy

---

#### 5.1.6 Public Project Detail Page
**Priority:** High  
**Estimated Effort:** Large

**Requirements:**
- Render all content blocks in order
- Display metadata (categories, tags, date)
- Show external links as buttons
- Social share buttons
- Responsive layout
- Breadcrumb navigation
- Related projects section

**Technical Implementation:**
- Dynamic Astro route: [slug].astro
- Fetch project data from PocketBase at build time
- Render each block type with appropriate component
- Use Astro's Image component for optimization
- Static generation for all published projects

**Block Renderers:**
- TitleRenderer: Renders H1/H2/H3 with styling
- HeadingRenderer: Renders H2-H6
- ParagraphRenderer: Renders HTML safely
- ImageRenderer: Optimized image with caption
- VideoRenderer: Responsive video embed or player
- EmbedRenderer: Sanitized iframe/HTML

**Acceptance Criteria:**
- [ ] All block types render correctly
- [ ] Images are optimized for web
- [ ] Videos embed properly from YouTube/Vimeo
- [ ] Custom embeds work (maps, slides, etc.)
- [ ] Page is fully responsive
- [ ] Social share buttons work
- [ ] Related projects show similar projects
- [ ] Breadcrumbs link back to listing page

---

### 5.2 Phase 2 - Enhanced Features

#### 5.2.1 Media Library
**Priority:** Medium  
**Estimated Effort:** Medium

**Requirements:**
- View all uploaded media
- Search and filter by type
- Reuse media across projects
- Delete unused media
- Bulk upload

---

#### 5.2.2 Analytics Dashboard
**Priority:** Medium  
**Estimated Effort:** Large

**Requirements:**
- Track project views
- Most viewed projects
- View trends over time
- Export reports

---

#### 5.2.3 Version History
**Priority:** Low  
**Estimated Effort:** Large

**Requirements:**
- Save project versions automatically
- View version history
- Compare versions
- Restore previous versions

---

#### 5.2.4 Template System
**Priority:** Low  
**Estimated Effort:** Medium

**Requirements:**
- Save project as template
- Create project from template
- Pre-built templates library

---

### 5.3 Phase 3 - Advanced Features

#### 5.3.1 Role-Based Access Control
**Priority:** Low  
**Estimated Effort:** Medium

**Requirements:**
- Multiple admin roles
- Permission management
- Activity logs

---

#### 5.3.2 Multi-language Support
**Priority:** Low  
**Estimated Effort:** Large

**Requirements:**
- Create projects in multiple languages
- Language switcher
- Separate content per language

---

#### 5.3.3 Comments System
**Priority:** Low  
**Estimated Effort:** Medium

**Requirements:**
- Visitor comments on projects
- Comment moderation
- Spam filtering

---

## 6. User Interface Design

### 6.1 Design Principles
- Clean and minimal aesthetic
- Prioritize content readability
- Consistent spacing and typography
- Accessible color contrasts (WCAG AA)
- Mobile-first responsive design

### 6.2 Color Scheme (shadcn/ui default)
- Use shadcn/ui default theme with CSS variables
- Support light/dark mode toggle
- Primary colors for CTAs and links
- Neutral grays for backgrounds and text

### 6.3 Typography
- Headings: System font stack or Inter
- Body: System font stack for performance
- Code blocks: Monospace font

### 6.4 Key Pages Wireframes

#### Admin Dashboard
```
┌─────────────────────────────────────────────┐
│  Logo    Dashboard    Projects    Logout    │
├─────────────────────────────────────────────┤
│                                             │
│  Projects Overview                          │
│  ┌──────┐  ┌──────┐  ┌──────┐             │
│  │ 24   │  │ 12   │  │ 5    │             │
│  │Total │  │Pub.  │  │Draft │             │
│  └──────┘  └──────┘  └──────┘             │
│                                             │
│  All Projects           [+ New] [Search]    │
│  ┌───────────────────────────────────────┐ │
│  │Thumb │Title    │Status │Views │Actions│ │
│  ├───────────────────────────────────────┤ │
│  │ [img]│Project 1│ Pub   │ 342  │ E D H │ │
│  │ [img]│Project 2│ Draft │  0   │ E D H │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### Project Editor
```
┌─────────────────────────────────────────────┐
│  < Back to Projects          [Save] [Publish]│
├─────────────────────────────────────────────┤
│ Left Sidebar  │  Main Editor   │ Right Panel│
│               │                │            │
│ [+ Title]     │  ═══ Title     │ Settings   │
│ [+ Heading]   │  ═══           │            │
│ [+ Paragraph] │  [  ] Heading  │ Status:    │
│ [+ Image]     │  ═══           │ ○ Draft    │
│ [+ Video]     │  Lorem ipsum...│ ○ Published│
│ [+ Embed]     │  ═══           │            │
│               │  [📷] Image    │ Categories │
│               │  ═══           │ □ Web Dev  │
│               │                │ □ Design   │
└─────────────────────────────────────────────┘
```

#### Public Project Page
```
┌─────────────────────────────────────────────┐
│  Logo              Home   Projects   About  │
├─────────────────────────────────────────────┤
│                                             │
│         Project Title (Large)               │
│         Category • Date • 5 min read        │
│                                             │
│  [=================================]        │
│  │     Featured Image (Full Width)│        │
│  [=================================]        │
│                                             │
│  Introduction paragraph with some           │
│  descriptive text about the project...      │
│                                             │
│  Heading 2                                  │
│  More content here describing details       │
│  about the project work and process.        │
│                                             │
│  [Image with Caption]                       │
│                                             │
│  [▶ Embedded Video]                         │
│                                             │
│  ─────────────────────────────────          │
│  [Live Demo] [GitHub] [Case Study]          │
│  ─────────────────────────────────          │
│                                             │
│  Related Projects                           │
│  [Card] [Card] [Card]                       │
└─────────────────────────────────────────────┘
```

---

## 7. API Endpoints (PocketBase)

### 7.1 Authentication
- `POST /api/collections/users/auth-with-password` - Login
- `POST /api/collections/users/request-password-reset` - Password reset
- `POST /api/collections/users/confirm-password-reset` - Confirm reset
- `POST /api/collections/users/refresh` - Refresh token

### 7.2 Projects
- `GET /api/collections/projects/records` - List projects
- `GET /api/collections/projects/records/:id` - Get single project
- `POST /api/collections/projects/records` - Create project
- `PATCH /api/collections/projects/records/:id` - Update project
- `DELETE /api/collections/projects/records/:id` - Delete project

### 7.3 Categories & Tags
- `GET /api/collections/categories/records` - List categories
- `POST /api/collections/categories/records` - Create category
- `GET /api/collections/tags/records` - List tags
- `POST /api/collections/tags/records` - Create tag

### 7.4 Media
- `POST /api/collections/media_library/records` - Upload file
- `GET /api/files/:collection/:id/:filename` - Get file

### 7.5 Query Parameters
- `filter` - Filter records (e.g., `status='published'`)
- `sort` - Sort records (e.g., `-created`)
- `expand` - Expand relations (e.g., `author,categories`)
- `page` - Pagination
- `perPage` - Records per page (default: 30, max: 100)

---

## 8. Development Workflow

### 8.1 Project Structure
```
project-showcase/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProjectEditor.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   └── blocks/
│   │   │       ├── TitleBlock.tsx
│   │   │       ├── ParagraphBlock.tsx
│   │   │       ├── ImageBlock.tsx
│   │   │       └── ...
│   │   ├── public/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   └── renderers/
│   │   │       ├── TitleRenderer.astro
│   │   │       ├── ParagraphRenderer.astro
│   │   │       └── ...
│   │   └── ui/ (shadcn/ui components)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── AdminLayout.astro
│   │   └── PublicLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── projects/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── admin/
│   │       ├── login.astro
│   │       ├── dashboard.astro
│   │       └── editor/
│   │           ├── new.astro
│   │           └── [id].astro
│   ├── lib/
│   │   ├── pocketbase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── styles/
│       └── global.css
├── public/
├── astro.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 8.2 Environment Variables
```env
PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.com
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=secure-password
```

### 8.3 Development Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run check
```

### 8.4 Git Workflow
1. Create feature branch: `git checkout -b feature/project-editor`
2. Make changes and commit: `git commit -m "Add drag & drop functionality"`
3. Push to GitHub: `git push origin feature/project-editor`
4. Create Pull Request
5. Review and merge to main
6. Automatic deployment via Netlify/Vercel

---

## 9. Deployment

### 9.1 PocketBase Backend Setup

**Option 1: VPS Deployment (Recommended)**
1. Provision VPS (DigitalOcean Droplet, Hetzner, etc.)
2. Install PocketBase binary
3. Set up systemd service for auto-restart
4. Configure nginx reverse proxy with SSL (Let's Encrypt)
5. Set up automated backups
6. Configure firewall rules

**Option 2: PocketHost (Managed)**
1. Sign up at pockethost.io
2. Create new instance
3. Configure custom domain
4. Automatic backups included

### 9.2 Frontend Deployment (Netlify)

**Initial Setup:**
1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables
4. Enable automatic deploys on push to main

**Deployment Process:**
1. Push code to GitHub main branch
2. Netlify detects changes
3. Runs build command
4. Deploys to CDN
5. Notification on completion

### 9.3 Domain Configuration
- Point domain A record to Netlify
- Configure PocketBase subdomain (api.yourdomain.com)
- Enable HTTPS with automatic SSL certificates

---

## 10. Testing Strategy

### 10.1 Unit Testing
- Test utility functions (slug generation, validation)
- Test block components rendering
- Test API integration functions

### 10.2 Integration Testing
- Test PocketBase API calls
- Test authentication flow
- Test file upload functionality

### 10.3 E2E Testing (Future)
- Test complete project creation flow
- Test public project viewing
- Test admin dashboard interactions

### 10.4 Manual Testing Checklist
- [ ] Admin can register and login
- [ ] Admin can create project with all block types
- [ ] Drag and drop works smoothly
- [ ] Images upload and display correctly
- [ ] Projects publish and appear on public site
- [ ] Filtering and search work
- [ ] Responsive on mobile devices
- [ ] All links work correctly

---

## 11. Performance Requirements

### 11.1 Page Load Times
- Admin dashboard: < 1.5s
- Project listing page: < 2s
- Individual project page: < 2s
- Editor page: < 2s

### 11.2 Optimization Strategies
- Astro static generation for public pages
- Image optimization with Astro Image
- Lazy loading for images and videos
- Code splitting for React components
- CDN caching via Netlify
- Minimize JavaScript bundle size

### 11.3 Lighthouse Targets
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

---

## 12. Security Considerations

### 12.1 Authentication Security
- HTTPS only (enforce SSL)
- JWT tokens with short expiration
- HttpOnly cookies for token storage
- CSRF protection on forms
- Rate limiting on login attempts

### 12.2 Input Validation
- Server-side validation for all inputs
- Sanitize HTML in rich text editor
- Validate file uploads (type, size)
- Prevent SQL injection (PocketBase handles this)
- XSS protection on rendered content

### 12.3 File Upload Security
- Whitelist allowed file types
- Maximum file size limits (5MB for images, 10MB for videos)
- Scan for malware (future enhancement)
- Store files outside web root
- Generate unique filenames

### 12.4 Embed Code Security
- Warn users about security risks
- Sandbox iframes when possible
- Content Security Policy headers
- Validate embed URLs

### 12.5 API Security
- Authenticate all admin API requests
- Use PocketBase's built-in API rules
- Rate limiting on public endpoints
- CORS configuration

---

## 13. Accessibility Requirements

### 13.1 WCAG 2.1 Level AA Compliance
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Color contrast ratios meet AA standards
- Focus indicators visible
- Alt text required for all images

### 13.2 Form Accessibility
- Labels for all form inputs
- Error messages clearly associated with fields
- Validation feedback announced to screen readers
- Logical tab order

### 13.3 Content Accessibility
- Proper heading hierarchy (H1 > H2 > H3)
- Descriptive link text (no "click here")
- Video captions support (user-provided)
- Responsive text sizing

---

## 14. Browser & Device Support

### 14.1 Desktop Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### 14.2 Mobile Browsers
- Chrome for Android
- Safari for iOS
- Samsung Internet

### 14.3 Screen Sizes
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

---

## 15. Maintenance & Support

### 15.1 Backup Strategy
- Daily automated database backups
- Weekly full system backups
- 30-day backup retention
- Test restore process monthly

### 15.2 Monitoring
- Uptime monitoring (UptimeRobot or similar)
- Error logging (Sentry integration)
- Performance monitoring
- Security alerts

### 15.3 Updates
- Monthly dependency updates
- Security patches applied immediately
- PocketBase version updates quarterly
- Astro version updates as needed

---

## 16. Future Enhancements

### 16.1 Potential Features
- AI-powered content suggestions
- Automatic image optimization and cropping
- Video transcoding and compression
- Built-in SEO analyzer
- A/B testing for project layouts
- Export projects as PDF
- Integration with analytics platforms (Google Analytics, Plausible)
- Collaboration features (multiple admins editing)
- Project scheduling calendar view
- Custom domain per project

### 16.2 Technical Improvements
- Progressive Web App (PWA) support
- Offline editing capabilities
- Real-time collaborative editing
- GraphQL API option
- Headless CMS mode (API-only)

---

## 17. Success Criteria

### 17.1 Phase 1 (MVP) Success Metrics
- [ ] Admin can create and publish 10 projects in under 2 hours
- [ ] All page load times under target thresholds
- [ ] Zero critical bugs reported in first week
- [ ] Lighthouse scores meet targets
- [ ] Successfully deployed to production
- [ ] Positive feedback from initial users

### 17.2 Phase 2 Success Metrics
- [ ] Media library saves 30% of admin's time
- [ ] Analytics provide actionable insights
- [ ] 50+ projects successfully migrated to platform
- [ ] Version history prevents content loss incidents
- [ ] Template system speeds up project creation by 40%

### 17.3 Long-term Success Metrics
- [ ] 95% uptime over 6 months
- [ ] Average project creation time under 15 minutes
- [ ] Public pages receive 10,000+ monthly views
- [ ] Zero data loss incidents
- [ ] Positive user satisfaction (8+/10 rating)

---

## 18. Risk Assessment & Mitigation

### 18.1 Technical Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| PocketBase performance issues with large databases | High | Medium | Implement pagination, caching, and regular database optimization. Monitor performance metrics. |
| Build time increases with many projects | Medium | High | Use Astro's incremental builds, implement on-demand ISR if needed, optimize image processing. |
| File storage limits on PocketBase | Medium | Medium | Implement file size limits, image compression, and consider external storage (S3) for scaling. |
| Complex drag-and-drop bugs | Medium | Medium | Thorough testing, use stable library (@dnd-kit), implement undo/redo functionality. |
| Browser compatibility issues | Low | Low | Test on all major browsers, use PostCSS autoprefixer, implement progressive enhancement. |

### 18.2 Project Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Scope creep beyond MVP | High | High | Strict prioritization, clear phase definitions, regular scope reviews with stakeholders. |
| Admin learning curve too steep | Medium | Medium | Create comprehensive documentation, video tutorials, intuitive UI/UX, onboarding wizard. |
| Poor SEO performance | Medium | Low | Implement proper meta tags, semantic HTML, sitemaps, structured data, test with SEO tools. |
| Insufficient backup strategy | High | Low | Automated daily backups, test restore procedures, multiple backup locations, monitoring alerts. |
| Security vulnerabilities | High | Low | Regular security audits, keep dependencies updated, implement security best practices, bug bounty program. |

### 18.3 Business Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Hosting costs exceed budget | Medium | Medium | Monitor usage, implement CDN caching, optimize resources, plan for scaling costs. |
| Low user adoption | Medium | Low | User feedback sessions, iterative improvements, marketing strategy, showcase benefits. |
| Competitor emerges with better features | Low | Low | Continuous improvement, unique value proposition, focus on niche requirements. |

---

## 19. Timeline & Milestones

### 19.1 Phase 1 (MVP) - 8-10 Weeks

**Week 1-2: Project Setup & Foundation**
- [ ] Initialize Astro project with TypeScript
- [ ] Set up PocketBase instance and configure collections
- [ ] Implement shadcn/ui components
- [ ] Configure GitHub repository and deployment pipeline
- [ ] Set up development environment
- **Deliverable:** Working development environment with basic routing

**Week 3-4: Authentication & Admin Dashboard**
- [ ] Implement PocketBase authentication
- [ ] Create admin login/logout flow
- [ ] Build admin dashboard layout
- [ ] Implement project listing table
- [ ] Add search and filter functionality
- **Deliverable:** Functional admin dashboard with project management

**Week 5-7: Project Editor (Core Feature)**
- [ ] Build drag-and-drop interface with @dnd-kit
- [ ] Implement all content block types (Title, Heading, Paragraph, Image, Video, Embed)
- [ ] Create rich text editor for paragraphs
- [ ] Implement file upload to PocketBase
- [ ] Add block actions (add, delete, duplicate, reorder)
- [ ] Build project metadata form
- [ ] Implement auto-save functionality
- **Deliverable:** Fully functional project editor

**Week 8: Public Pages**
- [ ] Create project listing page with grid layout
- [ ] Implement filtering and search on frontend
- [ ] Build dynamic project detail pages
- [ ] Create content block renderers
- [ ] Optimize images with Astro Image
- [ ] Implement social sharing
- **Deliverable:** Public-facing project showcase

**Week 9: Testing & Refinement**
- [ ] Comprehensive testing across browsers
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] Bug fixes and UI polish
- [ ] Accessibility audit and fixes
- **Deliverable:** Production-ready MVP

**Week 10: Deployment & Documentation**
- [ ] Deploy PocketBase to production VPS
- [ ] Deploy frontend to Netlify
- [ ] Configure custom domains and SSL
- [ ] Write user documentation
- [ ] Create video tutorials
- [ ] Conduct user training
- **Deliverable:** Live production system with documentation

### 19.2 Phase 2 (Enhanced Features) - 6-8 Weeks

**Week 11-12: Media Library**
- [ ] Build media library interface
- [ ] Implement advanced file management
- [ ] Add media reuse functionality
- [ ] Create bulk upload feature

**Week 13-14: Analytics Dashboard**
- [ ] Implement view tracking
- [ ] Build analytics visualizations
- [ ] Create export functionality
- [ ] Add date range filtering

**Week 15-16: Version History**
- [ ] Implement automatic version saving
- [ ] Build version comparison UI
- [ ] Add restore functionality
- [ ] Create version timeline view

**Week 17-18: Template System**
- [ ] Build template saving functionality
- [ ] Create template library UI
- [ ] Implement project creation from templates
- [ ] Add pre-built template examples

### 19.3 Phase 3 (Advanced Features) - 8-10 Weeks

**Weeks 19-26: Advanced capabilities** (based on user feedback and priority)
- Role-based access control
- Multi-language support
- Comments system
- Additional features as needed

---

## 20. Budget Estimation

### 20.1 Development Costs

| Item | Cost Type | Estimated Cost |
|------|-----------|----------------|
| Developer Time (Phase 1) | One-time | $8,000 - $15,000 (if outsourced) |
| Developer Time (Phase 2) | One-time | $5,000 - $10,000 (if outsourced) |
| UI/UX Design | One-time | $1,000 - $3,000 (optional) |
| Testing & QA | One-time | $1,000 - $2,000 |
| **Total Development** | | **$15,000 - $30,000** |

### 20.2 Monthly Operating Costs

| Item | Provider | Estimated Monthly Cost |
|------|----------|----------------------|
| VPS for PocketBase (2GB RAM) | DigitalOcean/Hetzner | $6 - $12 |
| Frontend Hosting | Netlify/Vercel (Free tier) | $0 - $19 |
| Domain Name | Any registrar | $1 - $2 |
| SSL Certificates | Let's Encrypt (Free) | $0 |
| Backup Storage | Backblaze B2 | $1 - $5 |
| Monitoring Services | UptimeRobot (Free tier) | $0 |
| **Total Monthly** | | **$8 - $38** |

### 20.3 Scaling Costs (Future)

| Item | Trigger | Estimated Monthly Cost |
|------|---------|----------------------|
| Larger VPS (4GB RAM) | 100+ projects, 10k+ monthly visitors | $12 - $24 |
| CDN Bandwidth | 100GB+ monthly traffic | $10 - $50 |
| Backup Storage | 50GB+ media files | $5 - $15 |
| Premium Hosting | High traffic, SLA requirements | $50 - $200 |

**Note:** Costs assume self-hosting PocketBase. Using managed PocketHost would cost $10-30/month depending on plan.

---

## 21. Documentation Requirements

### 21.1 User Documentation

**Admin User Guide**
- Getting started guide
- How to create your first project
- Understanding content blocks
- Using drag-and-drop editor
- Managing media files
- Publishing and scheduling projects
- SEO best practices
- Troubleshooting common issues

**Video Tutorials (Recommended)**
- 5-minute quick start guide
- Complete project creation walkthrough
- Advanced editing techniques
- Tips and tricks for efficiency

### 21.2 Technical Documentation

**Developer Documentation**
- Installation and setup guide
- Architecture overview
- Database schema reference
- API integration guide
- Custom block development guide
- Deployment procedures
- Backup and restore procedures
- Troubleshooting guide

**Code Documentation**
- Component API documentation
- Utility function references
- Type definitions
- Code comments for complex logic

### 21.3 Maintenance Documentation

**Operations Manual**
- Server maintenance procedures
- Database optimization tasks
- Security update process
- Monitoring and alerting setup
- Incident response procedures
- Backup verification process

---

## 22. Training & Onboarding

### 22.1 Admin Training Plan

**Initial Training Session (1-2 hours)**
- Platform overview and capabilities
- Live demonstration of project creation
- Hands-on practice with supervision
- Q&A session

**Self-Paced Learning**
- Access to video tutorials
- Written documentation
- Sample projects to explore
- Practice exercises

**Ongoing Support**
- Weekly check-in calls (first month)
- Email/chat support
- Knowledge base articles
- Feature update announcements

### 22.2 Onboarding Checklist

**For New Admins:**
- [ ] Account created and credentials provided
- [ ] Initial training session completed
- [ ] Documentation access granted
- [ ] First test project created
- [ ] Understanding of publishing workflow
- [ ] Awareness of support channels
- [ ] Familiarity with best practices

---

## 23. Quality Assurance

### 23.1 Code Quality Standards

**Code Review Requirements**
- All code must be reviewed before merging
- Follow TypeScript strict mode
- Maintain ESLint configuration with no errors
- Prettier for consistent formatting
- Meaningful commit messages following conventional commits

**Code Coverage Targets**
- Unit tests: 70%+ coverage for utilities
- Critical paths: 90%+ coverage
- Integration tests for all API endpoints

### 23.2 Testing Checklist

**Functional Testing**
- [ ] All CRUD operations work correctly
- [ ] Authentication and authorization function properly
- [ ] File uploads succeed and display correctly
- [ ] Drag-and-drop behaves as expected
- [ ] Search and filtering return accurate results
- [ ] Pagination works correctly
- [ ] All forms validate properly

**Cross-Browser Testing**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Responsive Testing**
- [ ] Mobile portrait (320px - 480px)
- [ ] Mobile landscape (481px - 767px)
- [ ] Tablet portrait (768px - 1024px)
- [ ] Tablet landscape (1025px - 1200px)
- [ ] Desktop (1201px+)
- [ ] Large desktop (1920px+)

**Performance Testing**
- [ ] Lighthouse scores meet targets
- [ ] Page load times under thresholds
- [ ] Large images optimized automatically
- [ ] No memory leaks in editor
- [ ] Smooth scrolling and animations

**Security Testing**
- [ ] XSS protection verified
- [ ] CSRF tokens working
- [ ] SQL injection prevention confirmed
- [ ] File upload restrictions enforced
- [ ] Authentication bypass attempts fail
- [ ] Unauthorized API access blocked

**Accessibility Testing**
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text present on images
- [ ] Form labels properly associated

---

## 24. Launch Checklist

### 24.1 Pre-Launch (1 week before)

**Technical Preparation**
- [ ] All Phase 1 features tested and working
- [ ] Production database configured and backed up
- [ ] SSL certificates installed and verified
- [ ] Domain configured and propagated
- [ ] Environment variables set correctly
- [ ] Monitoring and alerting configured
- [ ] Error logging configured (Sentry or similar)
- [ ] Performance optimization completed
- [ ] Security audit completed

**Content Preparation**
- [ ] Sample projects created for demonstration
- [ ] User documentation finalized
- [ ] Video tutorials recorded and published
- [ ] Admin accounts created
- [ ] Initial categories and tags set up

**Communication Preparation**
- [ ] Launch announcement drafted
- [ ] Support channels established
- [ ] Training sessions scheduled
- [ ] Feedback collection method prepared

### 24.2 Launch Day

- [ ] Final production build deployed
- [ ] Smoke tests on production environment
- [ ] Backup taken before launch
- [ ] Monitoring dashboards open
- [ ] Support team on standby
- [ ] Launch announcement sent
- [ ] Social media updates posted
- [ ] Team celebration! 🎉

### 24.3 Post-Launch (First Week)

- [ ] Monitor error logs daily
- [ ] Track user feedback
- [ ] Respond to support requests within 24 hours
- [ ] Address critical bugs immediately
- [ ] Collect analytics on usage patterns
- [ ] Schedule follow-up training if needed
- [ ] Document any issues and solutions

---

## 25. Support & Maintenance Plan

### 25.1 Support Tiers

**Tier 1: Critical Issues (Response: 2 hours)**
- Site completely down
- Data loss
- Security breach
- Authentication broken
- Unable to publish projects

**Tier 2: High Priority (Response: 24 hours)**
- Major feature not working
- Performance significantly degraded
- Editor crashes frequently
- Images not uploading

**Tier 3: Medium Priority (Response: 3 days)**
- Minor feature bugs
- UI inconsistencies
- Non-critical error messages
- Feature enhancement requests

**Tier 4: Low Priority (Response: 1 week)**
- Cosmetic issues
- Documentation updates
- Nice-to-have features

### 25.2 Maintenance Schedule

**Daily**
- Monitor uptime and performance
- Review error logs
- Check backup completion

**Weekly**
- Review and triage support tickets
- Update documentation as needed
- Plan minor improvements

**Monthly**
- Update dependencies (patch versions)
- Review security advisories
- Performance optimization review
- User feedback analysis

**Quarterly**
- Major dependency updates
- PocketBase version updates
- Security audit
- Backup restore test
- Capacity planning review

**Annually**
- Comprehensive security audit
- Infrastructure review
- Feature roadmap planning
- User satisfaction survey

---

## 26. Success Metrics Dashboard

### 26.1 Key Performance Indicators (KPIs)

**Technical KPIs**
- Uptime percentage (Target: 99.5%)
- Average page load time (Target: < 2s)
- Lighthouse performance score (Target: > 90)
- Number of critical bugs (Target: 0)
- API response time (Target: < 500ms)

**User Experience KPIs**
- Average project creation time (Target: < 15 minutes)
- Number of projects created per month
- Admin session duration
- Feature adoption rate (% of admins using each feature)
- User satisfaction score (Target: > 8/10)

**Business KPIs**
- Total projects published
- Monthly active admins
- Public page views per month
- Visitor engagement time
- Conversion rate (visitors to contact/action)

**Content KPIs**
- Average content blocks per project
- Most used block types
- Average images per project
- Average project length (words)
- Featured projects performance

### 26.2 Reporting Frequency

- Real-time: System uptime, error rates
- Daily: Page views, new projects
- Weekly: User activity, feature usage
- Monthly: Comprehensive report with all KPIs
- Quarterly: Strategic review with insights and recommendations

---

## 27. Glossary

**Astro** - Modern static site generator that ships minimal JavaScript by default

**Content Block** - Individual components (title, paragraph, image, etc.) that make up a project

**Draft** - Unpublished project visible only to admins

**Featured** - Project highlighted prominently on the public site

**Island** - Interactive component in Astro that hydrates on the client side

**MVP** - Minimum Viable Product, the first phase with core features

**PocketBase** - Open-source backend with database, auth, and file storage

**Shadcn/ui** - Collection of reusable React components built with Tailwind CSS

**Slug** - URL-friendly version of a title (e.g., "my-project")

**SSG** - Static Site Generation, pre-rendering pages at build time

**VPS** - Virtual Private Server for hosting backend services

---

## 28. Appendix

### 28.1 Useful Resources

**Documentation**
- Astro Docs: https://docs.astro.build
- PocketBase Docs: https://pocketbase.io/docs
- Shadcn/ui Docs: https://ui.shadcn.com
- @dnd-kit Docs: https://docs.dndkit.com

**Tools**
- TypeScript Playground: https://typescriptlang.org/play
- Tailwind CSS Playground: https://play.tailwindcss.com
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci

**Community**
- Astro Discord: https://astro.build/chat
- PocketBase Discussions: https://github.com/pocketbase/pocketbase/discussions

### 28.2 Recommended Reading

- "Building Modern Web Applications" - Patterns and best practices
- "Web Performance in Action" - Optimization techniques
- "Accessible Web Design" - WCAG compliance guide
- "API Design Patterns" - RESTful API best practices

### 28.3 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 25, 2025 | Initial PRD creation | Development Team |

---

## 29. Sign-Off

**Document Prepared By:**
- Development Team Lead: _________________
- Date: _________________

**Reviewed By:**
- Project Stakeholder: _________________
- Date: _________________

**Approved By:**
- Project Owner: _________________
- Date: _________________

---

**END OF DOCUMENT**

*This PRD is a living document and will be updated as the project evolves. All team members should refer to the latest version in the project repository.*