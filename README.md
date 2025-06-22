<p align="center">
  <img src="client/public/logo.jpg" alt="SplitEasy Logo" width="180" />
</p>
<h1 align="center">SplitEasy</h1>
<h3 align="center">Split smart. Skip the awkwardness!</h3>

## 🚀 Live Demo

Try SplitEasy live here: [https://split-easy-chi.vercel.app](https://split-easy-chi.vercel.app)

## 🧾 About

**SplitEasy** is a modern, full-stack MERN application that simplifies how groups manage shared expenses. Whether you’re planning a trip, managing rent, or organizing events, SplitEasy makes it easy to create groups, split expenses, upload receipts, and settle payments with smart email reminders and a clean user experience.

## ✨ Features

- 🔐 **User Authentication with Email Verification**  
  Secure signup/login flow with email confirmation to ensure verified participation.

- 👥 **Flexible Group Creation**  
  Create groups by adding user emails or sharing a unique invite link.

- 💸 **Intelligent Split Management**  
  Create expense splits with equal or custom distributions, attach receipts, and add notes.

- 📩 **Automated Email Reminders**  
  Set `notifyAfter` days and let SplitEasy automatically remind unpaid users at regular intervals using GitHub Actions and a background worker.

- 🧾 **Detailed Activity History**  
  Track all key actions like group creation, splits, settlements, and reviews with timestamps.

- 📱 **Fully Responsive UI**  
  Built with Tailwind CSS for smooth experience across mobile, tablet, and desktop.


## 🧰 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Email verification with tokens
- **Cron Jobs:** GitHub Actions (via `cron-job.yml`)
- **Deployment:**
  - Frontend → Vercel  
  - Backend → Render  
  - Cron Worker → GitHub Actions

## 📸 Screenshots

### 🏠 Landing Page

![image](https://github.com/user-attachments/assets/e61bc46b-be59-462c-aad2-97f33e4183a4)

### 📊 Dashboard View

![image](https://github.com/user-attachments/assets/df0ea488-6f0f-45a9-be57-c69ad4e0e019)


## 🤔 How to Use

1. **Sign up and verify your email.**
2. **Create a group** and add members by email or share the group link.
3. **Create a split** – choose to divide equally or assign custom amounts.
4. **Add optional bill image** or notes for clarity.
5. **Set the reminder interval** (`notifyAfter`) and let SplitEasy handle the rest.
6. **Track activity** via the history log and settle payments easily.

## 👨‍💻 Developer

Built by [Monika Dalawat](https://github.com/Monika-1082005) & [Jyoti Gaud](https://github.com/23Jyoti) <br>
Feel free to explore, star ⭐ the repo, and connect!

## 🪪 License

This project is licensed under the **[MIT License](LICENSE)**.  
You are free to use, modify, and distribute this project with proper attribution.
