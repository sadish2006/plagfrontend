🧠 AI Content Analyzer – Humanizer, Plagiarism Checker, and AI Detector

Welcome to the **AI Content Analyzer**, a full-stack web application that empowers users to:

- 🧠 **Humanize AI-generated text**
- 📚 **Detect plagiarism**
- 🤖 **Identify AI-written content**

This project seamlessly integrates a modern React frontend with powerful serverless backend processing using **AWS Lambda** and **Amazon Bedrock's Claude 3 Sonnet model**. It's designed for high performance, low cost, and easy scalability—built entirely on the cloud.

---

🎥 Demo Video

[![Watch the demo](https://youtu.be/NrxOroxCMdk?si=fxiua4SPdgRkoCF_)](https://youtu.be/NrxOroxCMdk?si=fxiua4SPdgRkoCF_)



---

 📌 Project Overview

The goal of this project is to enhance the trustworthiness and readability of AI-generated content. The app offers three core features:

- ✅ **Text Humanizer** – Rewrites robotic or generic AI text into natural, human-like language.
- ✅ **Plagiarism Checker** – Identifies duplicate or copied content patterns.
- ✅ **AI Detector** – Evaluates whether a piece of text is likely written by an AI model.

All these features are powered by **Claude 3 Sonnet** via **Amazon Bedrock**, called securely from Lambda functions exposed through **Amazon API Gateway**.

---

🧱 System Architecture

![AI Content Analyzer Architecture] ![Architecture Diagram](https://github.com/user-attachments/assets/8092928a-93f0-4874-b88a-ef945e0725f5)


Components:

1. **React Frontend**  
   Provides a clean, interactive UI for users to input text and view results.

2. **Amazon API Gateway**  
   Exposes RESTful HTTP endpoints (`/humanize`, `/detect`, `/plagiarism`) securely to the frontend.

3. **AWS Lambda Functions**  
   Stateless functions that process each feature request and invoke the Bedrock model accordingly.

4. **Amazon Bedrock (Claude 3 Sonnet)**  
   The core AI model used for content rewriting, AI detection, and plagiarism detection.

---

 💻 Tech Stack

| Layer          | Technology                                  |
|----------------|----------------------------------------------|
| Frontend       | React, Vite, Tailwind CSS                    |
| Backend        | Node.js on AWS Lambda                        |
| Cloud Services | Amazon API Gateway, AWS Lambda, Amazon Bedrock |
| AI Model       | Claude 3 Sonnet                              |


---

🚀 Features & Workflow

 1. Text Humanization
Users paste text that sounds robotic or overly formal. With one click, the system rewrites it using Claude 3 Sonnet to sound more natural and human-like.

2. AI Content Detection
This feature uses prompt engineering to evaluate whether the input text was likely written by a human or an AI model.

3. Plagiarism Detection
Content is analyzed for repetition, duplication, or copying using intelligent comparison logic implemented through Claude's prompt-based reasoning.

---

🔗 API Endpoints


| Endpoint       | Description                | Request Body Example         |
|----------------|----------------------------|------------------------------|
| `/humanize`    | Returns humanized content  | `{ "text": "..." }`         |
| `/detect`      | Detects AI content         | `{ "text": "..." }`         |
| `/plagiarism`  | Checks for plagiarism      | `{ "text": "..." }`         |

All endpoints accept a `POST` request with a JSON body containing the `"text"` field.

---

🧠 How It Works (Request Flow)

User (React UI)
   ↓
Amazon API Gateway
   ↓
AWS Lambda Function (Node.js)
   ↓
Amazon Bedrock (Claude 3 Sonnet)
   ↓
Response → Lambda → API Gateway → UI (React)
