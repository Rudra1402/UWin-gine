# UWingine

UWingine is an AI-powered chatbot platform designed to simplify and enhance the academic experience for students. This solution automates the retrieval of academic information, such as policies, course details, and procedures, providing quick and accurate responses with references to original documents. UWin-gine leverages web scraping, cloud-based storage, and a large language model (LLM) to deliver relevant information efficiently.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

UWin-gine aims to improve access to academic resources by providing a chatbot interface for students. The chatbot reduces time spent searching through extensive documents by offering direct, contextually relevant responses. Using a combination of cloud infrastructure, machine learning, and real-time processing, UWin-gine is a scalable, accessible, and reliable solution for addressing student queries.

## Features

- **Automated Data Collection**: Extracts academic calendars, Senate Policies, and Bylaws using a custom Python Selenium web scraper.
- **Secure Storage**: Stores files in Amazon S3 and relevant metadata in Amazon DynamoDB.
- **Quick Information Retrieval**: Processes and indexes document content as vector embeddings for rapid query matching.
- **LLM-Powered Responses**: Provides accurate, context-aware responses by leveraging embeddings and a fine-tuned language model.
- **User-Friendly Interface**: Engages users through a responsive Next.js frontend with a smooth chat experience.
- **Feedback & Monitoring**: Collects user feedback and monitors performance for continuous improvement.

## Project Architecture

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
- **Interactive Chat Interface**: Allows users to interact with UWin-gine, providing an engaging and informative experience.

## Technologies Used

- **Backend**: FastAPI, Python, Selenium, Docker
- **Frontend**: Next.js, Tailwind CSS
- **Cloud Services**: Amazon S3, DynamoDB, Lambda, EC2
- **Database**: PostgreSQL (for vector storage)
- **Other Tools**: AWS CodeBuild (for CI/CD automation), JWT (for authentication)

## Installation

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

# Usage
## Accessing the Chat Interface
Visit the homepage at http://localhost:3000 to interact with UWingine.

## Querying Information
Enter questions related to academic policies, course selection, or other information. The chatbot will fetch and display the most relevant answers.

## User Registration and Authentication
Users can sign up and log in to:
- save chat history
- access advanced features
- personalize their experience.

## Feedback Submission
Users can provide feedback on responses to help improve accuracy and relevance.

# Contributing
## Contributions are welcome! To contribute:

- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes.
- Submit a pull request.

Ensure your code follows best practices and includes relevant documentation.
