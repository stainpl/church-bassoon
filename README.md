# Church Website - Modern Web Platform

A comprehensive, modern church website built with Next.js 15, TypeScript, and Prisma. This platform provides a complete solution for church management including member registration, blog management, payment processing, and administrative tools.

## 🌟 Features

### Public Features
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Blog System**: Dynamic blog posts with rich text editor
- **Member Portal**: Secure member registration and login
- **Payment Processing**: Online donations and payment tracking
- **Notice Board**: Real-time announcements and updates
- **Image Gallery**: Photo management and display

### Admin Dashboard
- **Comprehensive Admin Panel**: Full administrative control
- **User Management**: Manage members, admins, and users
- **Content Management**: Create and manage blog posts
- **Payment Tracking**: Monitor donations and payments
- **Notice Management**: Create and schedule announcements
- **Media Library**: Upload and manage photos/videos

### Member Dashboard
- **Profile Management**: Update personal information
- **Donation History**: Track giving history
- **Payment Management**: Manage recurring donations
- **Settings**: Account preferences and security

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **React Dropzone** - File upload handling

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication solution
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prisma Migrate** - Database migrations
- **tsx** - TypeScript execution

## 📁 Project Structure

```
church-website/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── member/            # Member dashboard pages
│   ├── components/        # Reusable components
│   └── pages/             # Legacy pages (if any)
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── types/                 # TypeScript type definitions
├── lib/                   # Utility libraries
├── utils/                 # Helper functions
└── middleware.ts          # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd church-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/church_db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # JWT
   JWT_SECRET="your-jwt-secret-here"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed database (optional)
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🗄️ Database Schema

### Core Models
- **User** - Admin and member accounts
- **Member** - Church member profiles
- **Blog** - Blog posts and articles
- **Notice** - Announcements and notices
- **Payment** - Donation and payment records

### Relationships
- Users can create multiple blog posts
- Members can make multiple payments
- Notices can be created by admins
- Payments are linked to members

## 🔐 Authentication & Authorization

### Authentication Methods
- **NextAuth.js** - Session-based authentication
- **JWT Tokens** - API authentication
- **Role-based Access** - Admin and member roles

### Protected Routes
- `/admin/*` - Admin-only access
- `/member/*` - Member-only access
- `/api/admin/*` - Admin API endpoints
- `/api/members/*` - Member API endpoints

## 📱 Pages Overview

### Public Pages
- `/` - Homepage with hero section, notices, and recent posts
- `/blog` - Blog listing page
- `/blog/[id]` - Individual blog post
- `/member/login` - Member login
- `/member/register` - Member registration

### Admin Dashboard
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Main admin dashboard
- `/admin/blog` - Blog management
- `/admin/users` - User management
- `/admin/payments` - Payment tracking
- `/admin/notices` - Notice management

### Member Dashboard
- `/member/dashboard` - Member home
- `/member/profile` - Profile management
- `/member/donations` - Donation history
- `/member/settings` - Account settings

## 🎨 UI Components

### Reusable Components
- **BlogCard** - Blog post preview
- **NoticeBar** - Announcement display
- **PaymentCard** - Payment information
- **UserCard** - User profile preview
- **Loader** - Loading states
- **Toast** - Notifications

### Admin Components
- **SlateEditor** - Rich text editor
- **DashboardStats** - Analytics display
- **UserManagement** - User administration
- **ContentManagement** - Blog and notice management

## 📸 Media Management

### Image Upload
- **Profile Photos** - Member profile pictures
- **Blog Covers** - Blog post featured images
- **Gallery Images** - Church event photos
- **Notice Images** - Announcement attachments

### Storage
- **Local Storage** - Development uploads
- **Cloud Storage** - Production ready (configurable)

## 💳 Payment Integration

### Supported Payment Methods
- **Online Donations** - One-time payments
- **Recurring Donations** - Monthly/weekly giving
- **Payment Tracking** - Donation history
- **Receipt Generation** - Automated receipts

### Payment Processing
- **Stripe Integration** - Ready for Stripe
- **PayPal Integration** - Configurable
- **Bank Transfers** - Manual entry support

## 🧪 Testing

### Manual Testing
- **User Registration** - Test member signup
- **Login Flow** - Test authentication
- **Admin Access** - Test admin permissions
- **Payment Flow** - Test donation process
- **Content Management** - Test blog creation

### Automated Testing
- **Unit Tests** - Component testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User journey testing

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy with automatic CI/CD

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
# Production
NODE_ENV=production
DATABASE_URL=your-production-db-url
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
```

## 🔍 Monitoring & Analytics

### Built-in Analytics
- **User Activity** - Login and registration tracking
- **Content Analytics** - Blog post views and engagement
- **Payment Analytics** - Donation tracking and reporting

### Error Monitoring
- **Error Boundaries** - React error handling
- **API Error Logging** - Server-side error tracking
- **User Feedback** - Error reporting system

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **TypeScript** - Strict type checking
- **ESLint** - Code linting rules
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📞 Support

### Documentation
- **API Documentation** - Available in `/docs`
- **Component Documentation** - Storybook integration
- **Database Schema** - Prisma documentation

### Community
- **GitHub Issues** - Bug reports and feature
