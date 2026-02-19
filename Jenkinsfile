pipeline {
  agent any
  environment {
    FRONTEND_IMAGE = "frontend-app"
    BACKEND_IMAGE  = "backend-app"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps {
            // Usa el Dockerfile.build para compilar el frontend
            sh 'docker build -f ./schedio-frontend/Dockerfile.build -t ${FRONTEND_IMAGE}:build ./schedio-frontend'
          }
        }
        stage('Build Backend') {
          steps {
            // Usa el Dockerfile.build para compilar el backend
            sh 'docker build -f ./backend/Dockerfile.build -t ${BACKEND_IMAGE}:build ./backend'
          }
        }
      }
    }
  }
  post {
    always {
      // Limpieza de imágenes intermedias para ahorrar espacio
      sh 'docker system prune -f'
    }
  }
}