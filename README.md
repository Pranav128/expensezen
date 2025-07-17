# ExpenseZen: Your Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](/License)

ExpenseZen is a modern, intuitive, and secure web application designed to help you effortlessly track your daily expenses, gain insights into your spending habits, and take control of your financial health. Built with a powerful tech stack including Next.js, MongoDB, and Tailwind CSS, ExpenseZen provides a seamless user experience from signup to detailed financial analysis.

## Live Demo

**[Access the Live Demo](https://expense-tracker-eight-flax.vercel.app/)** &nbsp; 

---

## Features

- **Secure User Authentication**: Robust login and signup functionality using JWT (JSON Web Tokens) to keep your data safe.
- **Intuitive Expense Logging**: Quickly add new expenses with descriptions, amounts, categories, and dates.
- **AI-Powered Category Suggestions**: Get smart category recommendations based on your expense description.
- **Interactive Dashboard**: Visualize your financial data with dynamic charts showing total expenses, average transaction value, and breakdowns by category and month.
- **Comprehensive Transaction History**: View, sort, and filter all your past transactions.
- **Update & Delete**: Easily edit or remove expenses as needed.
- **Data Export**: Export your filtered expense data to a CSV file for your records or further analysis.
- **User Profile Management**: Update your email and upload a custom profile picture.
- **Fully Responsive Design**: Access and manage your finances on any device, from desktop to mobile.

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

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (with React), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend**: Next.js API Routes
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Authentication**: [JWT](https://jwt.io/), [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- **Generative AI**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: Ready for Vercel, Firebase App Hosting, or any Node.js environment.

---

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-hosted, e.g., MongoDB Atlas)
- An email account configured to send emails (required for "Forgot Password" functionality, e.g., Gmail, SendGrid, etc.)
- If using AI features, a Google Cloud project with Genkit set up.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Pranav128/expensezen.git
    cd expensezen
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of your project and add the following variables. Replace the placeholder values with your actual data.

    ```env
    # Your MongoDB connection string
    MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

    # A strong, secret key for signing JWTs
    JWT_SECRET="your_super_secret_jwt_key_here"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

---
