# Project Showcase Platform

A dynamic portfolio website and project showcase platform featuring a robust admin interface and a high-performance public frontend. Built with **Astro**, **React**, and **PocketBase**.

## 🚀 Features

- **Admin Dashboard**: Comprehensive interface to manage projects, view statistics, and handle content.
- **Drag-and-Drop Editor**: Flexible block-based editor using `@dnd-kit` to create custom layouts for project pages.
  - Support for Text, Headings, Images, Videos, and Embeds.
- **Public Showcase**: Fast, responsive, and SEO-friendly project listing and detail pages generated with Astro.
- **Authentication**: Secure admin login and session management via PocketBase.
- **Modern UI**: Polished interface built with **shadcn/ui** and **Tailwind CSS**.

## 🛠️ Tech Stack

- **Frontend Framework**: [Astro](https://astro.build/) (Static Site Generation with Islands Architecture)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [PocketBase](https://pocketbase.io/) (SQLite-based backend)
- **State & Logic**:
  - `react-hook-form` & `zod` for form handling
  - `@dnd-kit` for drag-and-drop interactions
  - `lucide-react` for icons

## � Project Structure

```text
project-showcase/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard and editor components
│   │   ├── public/         # Public facing components (ProjectCard, etc.)
│   │   └── ui/             # shadcn/ui reusable components
│   ├── layouts/            # Astro layouts (Admin, Public, Base)
│   ├── pages/              # File-based routing
│   │   ├── index.astro     # Home page
│   │   ├── projects/       # Project listing and details
│   │   └── admin/          # Admin routes
│   ├── lib/                # Utilities and PocketBase client
│   └── styles/             # Global styles
├── public/                 # Static assets
└── package.json
```

## 🏁 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **PocketBase** instance (running locally or hosted)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/virajnpawar/ProjectShowcase.git
   cd project-showcase
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090  # Or your hosted PocketBase URL
   POCKETBASE_ADMIN_EMAIL=admin@example.com
   POCKETBASE_ADMIN_PASSWORD=your-secure-password
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

### Backend Setup (PocketBase)

1. Download and run PocketBase.
2. Create the necessary collections (`projects`, `categories`, `tags`, etc.) as defined in the project requirements.
3. Ensure the Admin user is created.

## 🧞 Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/` |
| `npm run preview` | Preview your build locally |
| `npm run check` | Run Astro check for type errors |

