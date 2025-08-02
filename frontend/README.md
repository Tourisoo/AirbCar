# Car Rental Platform

A modern car rental platform built with Next.js, featuring user authentication, admin panel, and a beautiful UI.

## Features

- Next.js 15.3.5 with JavaScript
- Tailwind CSS v4 for styling
- App Router architecture
- NextAuth.js authentication with email/password and Google OAuth
- Prisma ORM with SQLite database
- Admin panel for user management
- Password reset functionality
- Responsive design with modern UI components
- pnpm package manager

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hello-world
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the setup script:
```bash
pnpm run setup
```
This will create `.env.local` from the example and guide you through the setup.

4. Edit `.env.local` with your actual values (at minimum, add a NextAuth secret):
```bash
# Generate a secret for NextAuth
openssl rand -base64 32
```

5. After editing .env.local, set up the database:
```bash
pnpm run db:setup
```

6. Run the development server:
```bash
pnpm dev
```

### Manual Setup

If you prefer to set up manually:

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hello-world
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your actual values. At minimum, generate a NextAuth secret:
```bash
# Generate a secret for NextAuth
openssl rand -base64 32
```

4. Set up the database:
```bash
pnpm run db:setup
```

5. Run the development server:
```bash
pnpm dev
```

### Docker Setup (Alternative)

If you prefer to use Docker, you can run the entire application in a container:

#### Quick Docker Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hello-world
```

2. Run the Docker setup script:
```bash
./docker-setup.sh
```

This will automatically:
- Create `.env.local` from `.env.example`
- Generate a NextAuth secret
- Build the Docker image
- Start the application at `http://localhost:3000`

#### Manual Docker Setup

1. Clone and navigate to the project:
```bash
git clone <your-repo-url>
cd hello-world
```

2. Create environment file:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

3. Build and run with Docker Compose:
```bash
docker-compose up --build
```

#### Docker Commands

```bash
# Build and start the application
pnpm run docker:dev

# Stop the application
pnpm run docker:stop

# View logs
pnpm run docker:logs

# Build Docker image only
pnpm run docker:build

# Run Docker container directly
pnpm run docker:run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

You can start editing the page by modifying `src/app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
