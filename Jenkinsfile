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
    stage('API Tests (Postman/Newman)') {
        steps {
            script {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh """
                    docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
                    docker run --rm ${API_TEST_IMAGE}
                    """
                }
            }
        }
        post {
            unstable {
                echo 'AVISO: No se ejecutaron pruebas de API o fallo del contenedor Newman'
            }
        }
    }
    stage('Performance Tests (JMeter)') {
        steps {
            script {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh """
                    docker build -f tests/performance/Dockerfile.perf -t ${PERF_IMAGE} tests/performance
                    docker run --rm ${PERF_IMAGE}
                    """
                }
            }
        }
        post {
            unstable {
                echo 'AVISO: No se ejecutaron pruebas de Performance o los scripts de JMeter faltan'
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