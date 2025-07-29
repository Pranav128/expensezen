# 💰 ExpenseZen: Your Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/License)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.5.1-green?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

ExpenseZen is a **modern, intuitive, and secure** web application designed to help you effortlessly track your daily expenses, gain insights into your spending habits, and take control of your financial health. Built with cutting-edge technologies including **Next.js 15**, **MongoDB**, **TypeScript**, and **Tailwind CSS**, ExpenseZen provides a seamless user experience from signup to detailed financial analysis.

## Live Demo

**[Access the Live Demo](https://expense-tracker-eight-flax.vercel.app/)** &nbsp; 

---

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure User Authentication**: Robust login and signup functionality using JWT (JSON Web Tokens)
- **Password Reset**: Secure password recovery via email
- **Protected Routes**: Authenticated access to all financial data

### 📊 **Smart Dashboard**
- **5 Key Metrics Cards**: 
  - 💰 Monthly Total Expenses
  - 📈 Average Transaction Amount
  - 🧾 Transaction Count
  - 🏆 Top Spending Category
  - 📅 Daily Average Spending
- **Interactive Charts**: Dynamic pie charts and bar graphs for spending visualization
- **Month Selector**: Easy navigation between different months
- **Real-time Updates**: All metrics update instantly when data changes

### 💸 **Expense Management**
- **Intuitive Expense Logging**: Quick expense entry with smart form validation
- **AI-Powered Category Suggestions**: Get intelligent category recommendations using Google AI
- **8 Predefined Categories**: Housing, Transportation, Food, Utilities, Insurance, Healthcare, Saving & Investing, Personal Spending
- **CRUD Operations**: Create, read, update, and delete expenses seamlessly
- **Date & Amount Validation**: Ensures data accuracy and consistency

### 📈 **Analytics & Insights**
- **Category Breakdown**: Visual representation of spending by category
- **Monthly Trends**: Track spending patterns over time
- **Daily Spending Analysis**: Understand your daily spending habits
- **Top Category Insights**: Identify your highest spending areas

### 🔧 **Advanced Features**
- **Data Export**: Export filtered expense data to CSV format
- **Advanced Filtering**: Filter by date range, category, and amount
- **Search Functionality**: Quick search through transaction history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 👤 **User Experience**
- **Profile Management**: Update email and upload custom profile pictures
- **Contact System**: Built-in contact form with email integration
- **Help & Support**: Comprehensive help documentation
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and Radix UI

---

## Screenshots

Here's a sneak peek into the ExpenseZen application:

| Dashboard | Transaction History |
| :---: | :---: |
| <img src="docs\screenshots\desktop-view.png" alt="ExpenseZen Dashboard Desktop"/>  | <img src="docs\screenshots\expenses.png" alt="Transactions and add new Expense"/>  |

| Mobile View | User Dropdown |
| :---: | :---: |
| <img src="docs\screenshots\mobile-view.png" alt="ExpenseZen Dashboard Mobile"/>  | <img src="docs\screenshots\desktop-view-user_dropdown.png" alt="ExpenseZen Dashboard User" />  |

| Login | Signup |
| :---: | :---: |
| <img src="docs\screenshots\login.png" alt="Login Page"/>  | <img src="docs\screenshots\signup.png" alt="Signup Page"/>  |

| Update Expense | About |
| :---: | :---: |
| <img src="docs\screenshots\update-expense.png" alt="Update expense Page"/>  | <img src="docs\screenshots\about.png" alt="About Page"/>  |

| Contact  | Contact |
| :---: | :---: |
| <img src="docs\screenshots\contact.png" alt="Update expense Page"/>  | <img src="docs\screenshots\contact-map.png" alt="About Page"/>  |

| Help and Support   | Page |
| :---: | :---: |
| <img src="docs\screenshots\help-support.png" alt="help-support Page"/>  | <img src="docs\screenshots\help-support-2.png" alt="help-support Page"/>  |

- For more screenshots [Click here](/docs/screenshots/)
---

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 15.3.3](https://nextjs.org/)** - React framework with App Router
- **[React 18.3.1](https://reactjs.org/)** - UI library with hooks and context
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Recharts](https://recharts.org/)** - Data visualization library

### **Backend**
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API endpoints
- **[MongoDB 8.5.1](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[bcrypt.js](https://www.npmjs.com/package/bcryptjs)** - Password hashing

### **AI Integration**
- **[Google AI & Genkit](https://firebase.google.com/docs/genkit)** - AI-powered category suggestions
- **Smart categorization** - Automatic expense category detection

### **Development & Deployment**
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **Environment Variables** - Secure configuration management

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### 📋 Prerequisites

- **[Node.js](https://nodejs.org/en/)** (v18 or newer recommended)
- **[MongoDB](https://www.mongodb.com/try/download/community)** instance (local or cloud-hosted, e.g., MongoDB Atlas)
- **Email account** configured to send emails (required for "Forgot Password" functionality)
- **Google Cloud project** with Genkit set up (for AI features)

### ⚡ Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Pranav128/expensezen.git
   cd expensezen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

   # Authentication
   JWT_SECRET="your_super_secret_jwt_key_here"
   
   # Email Configuration (for contact forms and password reset)
   EMAIL_SERVICE="gmail"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   CONTACT_EMAIL="your-contact-email@gmail.com"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   🎉 **Your app is now running at** `http://localhost:9002`

### 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint

# AI development (Genkit)
npm run genkit:dev
```

### 📧 Email Setup (Gmail)

For Gmail users, you'll need an **App Password**:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use the App Password in your `.env` file

---

## 📁 Project Structure

```
expense-tracker/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── login/          # Authentication pages
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   ├── expense-dashboard.tsx
│   │   └── ...
│   ├── models/            # MongoDB schemas
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── types/             # TypeScript definitions
│   └── ai/                # AI integration
├── public/                # Static assets
├── docs/                  # Documentation & screenshots
└── ...
```

---

## 🎯 Key Features Breakdown

### Dashboard Analytics
- **5 Metric Cards**: Comprehensive financial overview
- **Interactive Charts**: Visual spending analysis
- **Month Navigation**: Easy period selection
- **Real-time Updates**: Instant data refresh

### Expense Management
- **Smart Forms**: Intuitive expense entry
- **AI Categories**: Intelligent categorization
- **CRUD Operations**: Full expense lifecycle
- **Data Validation**: Ensures accuracy

### User Experience
- **Responsive Design**: Works on all devices
- **Fast Performance**: Optimized loading times
- **Secure Authentication**: JWT-based security
- **Modern UI**: Clean, professional interface

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Pranav Patel** - [GitHub](https://github.com/Pranav128)

**Project Link**: [https://github.com/Pranav128/expensezen](https://github.com/Pranav128/expensezen)

**Live Demo**: [https://expense-tracker-eight-flax.vercel.app/](https://expense-tracker-eight-flax.vercel.app/)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [MongoDB](https://www.mongodb.com/) for the flexible database solution
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Google AI](https://ai.google/) for intelligent category suggestions
- [Vercel](https://vercel.com/) for seamless deployment

---

<div align="center">
  <strong>⭐ Star this repository if you found it helpful! ⭐</strong>
</div>
