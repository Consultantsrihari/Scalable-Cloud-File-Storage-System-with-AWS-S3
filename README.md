# Scalable-Cloud-File-Storage-System-with-AWS-S3
Scalable Cloud File Storage System with AWS S3

cloudvault-monorepo/
├── .github/              # (Optional) For GitHub Actions CI/CD workflows
│   └── workflows/
├── backend/              # All backend code (Serverless Framework)
│   ├── .gitignore
│   ├── handler.js
│   ├── package.json
│   └── serverless.yml
├── frontend/             # All frontend code (Create React App)
│   ├── .gitignore
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── FileManager.js
│   │   └── index.js
│   └── package.json
├── .gitignore            # Top-level gitignore for the whole project
└── README.md             # The main project documentation
Use code with caution.
Top-Level .gitignore File
Create a .gitignore file in the root of your project. This single file will handle ignore rules for both the frontend and backend, keeping your repository clean.
Generated gitignore
# General
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Backend specific (Serverless Framework)
backend/.serverless/
backend/node_modules/

# Frontend specific (React)
frontend/node_modules/
frontend/build/
frontend/.amplify/
frontend/src/aws-exports.js

# Amplify CLI
amplify/.config/local-*
amplify/mock-data
amplify/backend/amplify-meta.json
amplify/backend/awscloudformation/
Use code with caution.
Gitignore
Top-Level README.md (The Master Guide)
This is the most important file in your monorepo. It serves as the entry point for anyone visiting your GitHub page. It should explain the project as a whole and guide users on how to set up, run, and deploy both parts.
Copy the following template into the README.md file in the root of your repository.
Generated markdown
# CloudVault: A Secure Cloud File Storage System (Monorepo)

This repository contains the complete source code for CloudVault, a full-stack web application that provides secure, user-isolated file storage, similar to Google Drive or Dropbox. The project is built on a serverless AWS architecture.

This is a monorepo containing both the backend API and the frontend client.

### Core Architecture: Secure Presigned URLs

The system is built on a modern, secure, and scalable architecture. The user's browser does **not** stream files through our backend server. Instead, the backend's only job is to authorize requests and provide the frontend with a temporary, secure **presigned URL**. The browser then uses this URL to upload or download the file directly to/from Amazon S3.

 <!-- Or host your own diagram image -->

### Monorepo Structure

-   `/backend`: A serverless application built with the **Serverless Framework**. It contains the AWS Lambda functions and API Gateway configuration for our API.
-   `/frontend`: A **React** single-page application built with Create React App and integrated with AWS Amplify for authentication and deployment.

---

### Technology Stack

| Component     | Technology                                 |
| :------------ | :----------------------------------------- |
| **Frontend**  | **React.js** with **AWS Amplify UI**       |
| **Backend**   | **Node.js** + **AWS Lambda**               |
| **API**       | **Amazon API Gateway**                     |
| **Storage**   | **Amazon S3**                              |
| **Auth**      | **Amazon Cognito**                         |
| **Permissions** | **AWS IAM**                                |
| **Deployment**  | **Serverless Framework** (Backend) & **AWS Amplify Hosting** (Frontend) |

---

### Prerequisites

Before you begin, ensure you have the following installed and configured:
-   [Node.js](https://nodejs.org/) (v18.x or later)
-   An [AWS Account](https://aws.amazon.com/free/)
-   [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials (`aws configure`)
-   [Serverless Framework](https://www.serverless.com/framework/docs/getting-started): `npm install -g serverless`
-   [AWS Amplify CLI](https://docs.amplify.aws/cli/start/install/): `npm install -g @aws-amplify/cli`

---

### Setup & Installation

Follow these steps to set up the project locally. **You must set up the backend first.**

#### Part 1: Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Backend Files:**
    -   In `serverless.yml`, replace all placeholders (`[YOUR_AWS_ACCOUNT_ID]`, `[YOUR_COGNITO_USER_POOL_ID]`, etc.) with your actual AWS resource values created during Phase 1 of the project plan.
    -   In `handler.js`, replace `[YOUR_S3_BUCKET_NAME]` with your S3 bucket's name.

#### Part 2: Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend  # Go back to root, then into frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Initialize Amplify and Import Auth:**
    Connect the project to your AWS backend services. This will generate the `src/aws-exports.js` file, which is required for the app to run.

    ```bash
    # Configure Amplify with your AWS profile
    amplify configure

    # Initialize Amplify in the frontend project
    amplify init

    # Import the Cognito User Pool you created for the backend
    amplify import auth
    ```
    Follow the command-line prompts, selecting the Cognito User Pool you created in Phase 1.

---

### Running Locally for Development

You will need two separate terminal windows to run both the backend and frontend concurrently.

**Terminal 1: Run the Backend API**
```bash
cd backend

# Install the serverless-offline plugin if you haven't already
sls plugin install -n serverless-offline

# Start the local server on http://localhost:3000
sls offline start
```

**Terminal 2: Run the Frontend App**
```bash
cd frontend

# Start the React development server on http://localhost:3000 (will ask to use another port, say yes)
npm start
```
Your application will now be running, typically on `http://localhost:3001`.

---

### Deployment to AWS

Deployment is a two-step process.

#### Step 1: Deploy the Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Deploy using the Serverless Framework:
    ```bash
    sls deploy
    ```
3.  After deployment completes, **copy the output API Gateway endpoint URL**. It will look something like `https://xxxxxx.execute-api.us-east-1.amazonaws.com/dev`.

#### Step 2: Deploy the Frontend

We will use AWS Amplify Hosting, which connects directly to your GitHub repository.

1.  **Push your monorepo code to GitHub.**

2.  **Log in to the AWS Amplify Console** and click **"Connect app"**.

3.  Select GitHub, then choose your `cloudvault-monorepo` repository and branch.

4.  **Configure Build Settings:** This is the most important step for a monorepo.
    -   Amplify will ask if your project is a monorepo. Check the box **"This is a monorepo"**.
    -   It will then ask for the folder for your app. Select `/frontend` from the dropdown.
    -   Amplify will show you the build settings (`amplify.yml`). Edit them to look like this:

    ```yaml
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: frontend/build
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
    ```

5.  **Add Environment Variables:**
    -   Before deploying, go to **Environment variables** in the Amplify console.
    -   Add a variable:
        -   **Variable:** `REACT_APP_API_URL`
        -   **Value:** Paste the API Gateway URL you copied from the backend deployment.
    -   Your React code must be updated to use this: `const API_URL = process.env.REACT_APP_API_URL;`

6.  **Save and Deploy.** Amplify will now build and deploy only the frontend part of your repository to a global CDN.

---
