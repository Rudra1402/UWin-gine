# UWingine

UWingine is an AI-powered chatbot platform designed to simplify and enhance the academic experience for students. This solution automates the retrieval of academic information, such as policies, course details, and procedures, providing quick and accurate responses with references to original documents. UWingine leverages web scraping, cloud-based storage, and a large language model (LLM) to deliver relevant information efficiently. [Visit](http://uwingine.s3-website-us-east-1.amazonaws.com/)

---

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

---

## 📖 Project Overview

UWingine aims to improve access to academic resources by providing a chatbot interface for students. The chatbot reduces time spent searching through extensive documents by offering direct, contextually relevant responses. Using a combination of cloud infrastructure, machine learning, and real-time processing, UWingine is a scalable, accessible, and reliable solution for addressing student queries.

## 📉 Problem Statement

Students at the University of Windsor often struggle to find specific academic information due to the vast number of documents, policies, and calendars that must be manually sifted through. This time-consuming process creates challenges in understanding course requirements, university policies, and critical academic deadlines. New and incoming students, in particular, find it difficult to navigate these resources, leading to frustration, missed opportunities, and even academic setbacks.

Additionally, university staff frequently handle repetitive queries that add to their workload, limiting their capacity to focus on more complex, value-added tasks. This problem highlights a need for a solution that can effectively and efficiently streamline information access for both students and staff, enhancing productivity and academic support.

## 💡 Proposed Solution

UWingine addresses these issues by offering a scalable, LLM-based chatbot capable of delivering quick, accurate, and reference-backed answers to student queries. This system integrates:
- **Data Scraping and Storage**: Academic calendars, policies, and bylaws are gathered and stored in an Amazon S3 bucket, while metadata is maintained in DynamoDB to provide document references.
- **Robust Architecture**: The solution is built on a Dockerized architecture using AWS services (EC2, S3, DynamoDB, and Lambda) to handle high traffic with low latency.
- **User-Friendly Interface**: A Next.js frontend and FastAPI backend make UWingine accessible and responsive across devices, ensuring seamless access to information.
  
By combining automated query handling with reliable data sourcing, UWingine offers a realistic and practical solution to the challenges faced by students and staff, ensuring better access to critical academic resources and reducing administrative workload.

## 🎯 Project Architecture

### 1. Data Collection & Storage
- **Web Scraping**: A Python-Selenium script scrapes and stores academic documents in Amazon S3, while metadata is saved in DynamoDB for future reference.
- **Dockerized Environment**: The scraping process is containerized for consistency and easy deployment across environments.

### 2. Data Processing
- **Embedding Generation**: An AWS Lambda function processes document content, generating vector embeddings stored in a PostgreSQL vector database on Amazon EC2.
  
### 3. Backend Development
- **FastAPI Framework**: Provides APIs for user authentication, chat handling, and embedding management.
- **Security**: Implements JWT-based token authentication for secure user access.

### 4. LLM Model Implementation
- **Embedding and Model Training**: A custom LLM model is trained to convert documents into embeddings and respond accurately to user queries.
  
### 5. Frontend Development
- **Next.js and Tailwind CSS**: Delivers a responsive, mobile-friendly interface, enhancing accessibility across devices.
- **Interactive Chat Interface**: Allows users to interact with UWingine, providing an engaging and informative experience.

## 🛠️ Technologies Used

- **Backend**: FastAPI, Python, Selenium, Docker
- **Frontend**: Next.js, Tailwind CSS
- **Cloud Services**: Amazon S3, DynamoDB, Lambda, EC2
- **Database**: PostgreSQL (for vector storage)
- **Other Tools**: AWS CodeBuild (for CI/CD automation), JWT (for authentication)

## 🚀 Installation

### Prerequisites
- [Python 3.12.0](https://www.python.org/downloads/release/python-3120/) or higher
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js 18.18.0](https://nodejs.org/en/blog/release/v18.20.4) or higher
- [AWS account](https://aws.amazon.com/console/) with necessary permissions

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Rudra1402/UWingine.git
   cd UWingine

2. **Go to the Server Directory**
   ```bash
   cd server

3. **Setup and Activate Virtual Environment (Windows)**
   ```bash
   python -m venv venv
   venv/Scripts/activate

4. **Build the Docker Image and Run the Container**
   ```bash
   docker build -t uwingine-image .
   docker run -p 8000:8000 --name uwingine-container uwingine-image

5. **Go to the Client Directory**
   ```bash
   cd client

6. **Install the Dependencies and Run the Server**
   ```bash
   npm install -f
   npm run dev

## 📘 Usage

### Accessing the Chat Interface
Visit the homepage at http://localhost:3000 to interact with UWingine.

### Querying Information
Enter questions related to academic calendars, senate policies and bylaws, course selection, important dates, or other information. The chatbot will fetch and display the most relevant answers with appropriate sources or references.

### User Registration and Authentication
Users can sign up and log in to:
- save chat history
- handle multiple chats
- personalize their experience.
