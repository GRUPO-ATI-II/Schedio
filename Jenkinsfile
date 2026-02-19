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
    stage('Unit Tests') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          // Construir la imagen de test
          sh 'docker build -f ./schedio-frontend/Dockerfile.test -t frontend-test ./schedio-frontend'
          // Ejecutar los tests
          sh 'docker run --rm frontend-test'
        }
      }
    }
    stage('Backend Unit Tests') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          // Construir la imagen de test
          sh 'docker build -f ./backend/Dockerfile.test -t backend-test ./backend'
          // Ejecutar los tests
          sh 'docker run --rm backend-test'
        }
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