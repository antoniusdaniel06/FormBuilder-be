# 🛠️ Form Builder – Backend API

🌐 **Frontend Live:**
[https://form-builder-fe-pi.vercel.app](https://form-builder-fe-pi.vercel.app)

🚀 **Backend Base URL (Railway):**
`formbuilder-be-production.up.railway.app`

---

## 🚀 Features

* 🔐 Authentication (Register & Login)
* 🔑 JWT Authorization
* 📝 Create / Update / Delete Form
* 📋 Manage Questions
* 📊 Submit & View Responses
* 📌 Publish / Unpublish Form
* 👤 Role-based Access (Form Owner & Public User)

---

## 🛠️ Tech Stack

* **Node.js**
* **NestJS** 
* **Prisma ORM**
* **PostgreSQL**
* **JWT Authentication**
* **Railway (Deployment)**

---

## ⚙️ Installation (Local Development)

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/form-builder-be.git
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Buat file `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/formbuilder"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 4️⃣ Run Migration (Jika pakai Prisma)

```bash
npx prisma migrate dev
```

### 5️⃣ Start Server

```bash
npm run start:dev
```

Server akan berjalan di:

```
http://localhost:3000
```
## 👤 Author

Antonius Daniel

