# LuxeStay | Hotel Book Management Frontend

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS%204-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel)](https://vercel.com/)

A premium, high-performance hotel booking platform built with the latest React ecosystem. LuxeStay offers a seamless experience for users to find and book luxury rooms while providing a powerful administrative interface for management.

---

## ✨ Key Features

### 🏨 Public Features
- **Premium Room Gallery**: High-quality visual representation of available stays.
- **Detailed Room Views**: Comprehensive information on amenities, pricing, and availability.
- **Multi-language Support**: Seamless switching between different languages.
- **Dark/Light Mode**: Elegant theme switching with system preference detection.

### 👤 User Features
- **Secure Authentication**: Robust login and registration system.
- **Booking Management**: Easy-to-use booking flow with status tracking.
- **Personal Dashboard**: Manage profile settings and view booking history.

### 🛡️ Admin Features
- **Comprehensive Dashboard**: Real-time overview of bookings and room statuses.
- **Room Management**: Add, update, or remove room listings effortlessly.
- **Booking Oversight**: Manage all guest bookings and availability.

---

## 🚀 Tech Stack

- **Core**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI & Styling**: 
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [Shadcn UI](https://ui.shadcn.com/)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
  - [Lucide React](https://lucide.dev/) (Icons)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Feedback**: [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rakesh01999/hotel-book-management-frontend.git
   cd hotel-book-management-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add:
   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages, Layouts)
├── components/     # Reusable UI components
│   ├── layout/     # Shared layout parts (Navbar, Footer)
│   ├── ui/         # Base Shadcn/UI components
│   └── modals/     # Application-wide modals
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── providers/      # Context providers (Theme, Auth, Query)
├── store/          # Zustand state stores
└── types/          # TypeScript interfaces and types
```

---

## 🌐 Deployment

The project is optimized for deployment on the **Vercel Platform**. 

1. Push your changes to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and import the repository.
3. Configure the `NEXT_PUBLIC_API_URL` environment variable.
4. Deploy!

Current production link: [hotel-management-frontend-ivory.vercel.app](https://hotel-management-frontend-ivory.vercel.app/)

---

## 📄 License

This project is private and intended for internal use.

---

Built with ❤️ by the LuxeStay Team.
