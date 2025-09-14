# CODING-FACTORY-FE-TECH-ESHOP

Author: Γιώργος Τζεμπελίκος

Project για το Coding Factory – Athens University of Economics & Business


# Tech-eShop

Full-stack e-shop εφαρμογή για το Coding Factory.  
Ο χρήστης μπορεί να κάνει εγγραφή, login, να βλέπει προϊόντα, να τα προσθέτει στο καλάθι και να ολοκληρώνει παραγγελία.

---

## Tech Stack

**Frontend**
- React + Vite + TypeScript
- TailwindCSS + ShadCN UI
- JWT Authentication (cookies)
- Zod (form validation)
- Context API (Cart, Auth)

**Backend**
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (login / register / role-based auth)
- Swagger (API docs)
- Jest + Supertest (testing)

------

##  Installation
 
##  1.
Clone:

bash
git clone https://github.com/gtzempe/CODING-FACTORY-FE-TECH-ESHOP.git

##  2. 
cd backend
npm install
npm run dev

##  3. 
cd frontend
npm install
npm run dev

## 4.
Demo Accounts

Admin:
Login: admin
Password: 123!@#

User:
Login: jason77
Password: 123!@#

User:
Login: natalia_v
Password: 123!@#

.env:
-------------------------------------------------------------------
MONGODB_URI = mongodb+srv://eShopUser:JMpEx6i8Gr4thWRe@tzecluster.irlx7cj.mongodb.net/FE-Tech-eShop?retryWrites=true&w=majority&appName=TzeCluster
JWT_SECRET = f544ffdea33b3e5db9bebdcc928199385f7f04dd0fbc13a91728f27bc7cf3548251d2189e1dfb476d72abcf6bdafb71a4d48e6794e0c3310d37831b52deaf22b
----------------------------------------------------------------------

Comments:
## Postman Collection

Για δοκιμή των API endpoints: 

Στον φάκελο files του Backend θα βρειτε ολα τα δεδομενα της βάσης δεδομένων καθως και το αρχείο Postman που αφορουν τις κλησεις!


Features
	•	Εγγραφή & login με JWT
	•	Ρόλοι χρηστών (ADMIN, EDITOR, READER)
	•	CRUD για Users, Products, Orders
	•	Καλάθι αγορών με Context API
	•	Ολοκλήρωση παραγγελίας με αποθήκευση στη βάση
	•	Swagger UI για API documentation
	•	Testing με Jest + Supertest

Δομη:
CF7 FINAL EXAM ESHOP/
│── backend/                # Node.js + Express API
│   │── controllers/        # Controllers (handle requests & responses)
│   │── coverage/           # Jest coverage reports
│   │── dao/                # Data Access Objects
│   │── dto/                # Data Transfer Objects
│   │── files/              # Extra files (π.χ. seed data)
│   │── logs/               # Winston logs
│   │── middlewares/        # Express middlewares (auth, error handling)
│   │── models/             # Mongoose models (User, Product, Order)
│   │── node_modules/       # Backend dependencies
│   │── routes/             # Express routes (auth, users, products, orders)
│   │── services/           # Business logic
│   │── tests/              # Jest + Supertest tests
│   │── utils/              # Logger, Swagger config κ.ά.
│   │── .env                # Περιβάλλον (Mongo URI, JWT secret)
│   │── .gitignore
│   │── app.js              # Express app setup
│   │── package-lock.json
│   │── package.json
│   │── README.md           # Backend docs (optional)
│   │── server.js           # Entry point του backend
│
│── frontend/               # React + Vite App
│   │── .idea/              # IDE configs
│   │── node_modules/       # Frontend dependencies
│   │── public/             # Static assets
│   │── src/                # React source code (pages, components, hooks, routes, context)
│   │── .env                # Frontend περιβάλλον (API URL)
│   │── .gitignore
│   │── components.json     # shadcn/ui components config
│   │── diafora.tsx         # extra αρχείο για testing/παραδείγματα
│   │── eslint.config.js
│   │── index.html          # HTML entry
│   │── package-lock.json
│   │── package.json
│   │── README.md           # Frontend docs (optional)
│   │── tsconfig.app.json
│   │── tsconfig.json
│   │── tsconfig.node.json
│   │── vite.config.ts      # Vite configuration
│
│── README.md               # Main project documentation

API Documentation:

Swagger available at:
http://localhost:3000/api-docs

Testing:

cd backend
npm test








