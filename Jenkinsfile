pipeline {
  agent any
  environment {
    FRONTEND_IMAGE = "frontend-app"
    BACKEND_IMAGE  = "backend-app"
    API_TEST_IMAGE = "api-tests"
    E2E_IMAGE      = "e2e-tests"
    PERF_IMAGE     = "perf-tests"
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
  stage('E2E Tests') {
  steps {
    script {
      catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
        sh """
          set -e

          echo "🔹 Levantando servicios con docker compose..."
          docker compose -f docker-compose.qa.yml up -d
          docker compose -f docker-compose.qa.yml ps

          echo "⏳ Esperando a que Angular levante..."
          sleep 20

          echo "🔹 Construyendo imagen E2E..."
          docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE}:latest ./tests/e2e

          #echo "🔹 Detectando red docker-compose..."

          echo "🔹 Ejecutando Cypress..."
          docker run --rm \
            --network schedio-main-pipeline_default \
            -e CYPRESS_BASE_URL=http://frontend:4000 \
            ${E2E_IMAGE}:latest
        """
      }
    }
  }
  post {
    unstable {
      echo 'AVISO: Pruebas E2E fallaron o el contenedor Cypress tuvo errores'
    }
  }
}
  }
  post {
    success {
      echo 'Pipeline finalizado: Proceso completado exitosamente'
    }
    failure {
      echo 'Pipeline finalizado: Error crítico en el proceso'
    }
    always {
      sh 'docker compose -f docker-compose.yml down --remove-orphans || true'
      sh 'docker system prune -f'
    }
  }
}