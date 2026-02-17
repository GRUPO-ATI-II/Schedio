pipeline {
  agent any
  environment {
    FRONTEND_IMAGE = "frontend-app"
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
    stage('Build Frontend') {
      steps {
        sh 'docker build -f schedio-frontend/Dockerfile.build -t frontend-app:build schedio-frontend'
      }
    }
    stage('Frontend Production Image') {
      steps {
        sh "docker build -f frontend/Dockerfile.prod -t ${FRONTEND_IMAGE}:prod frontend"
      }
    }
    stage('Unit Tests') {
      steps {
        sh "docker run --rm ${FRONTEND_IMAGE}:build npm test -- --watchAll=false"
      }
    }
    stage('API Tests (Postman/Newman)') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            sh """
            docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
            docker run --rm ${API_TEST_IMAGE} newman run coleccion.postman_collection.json -e entorno.postman_environment.json
            """
          }
        }
      }
      post {
        unstable {
          echo 'AVISO: No se ejecutaron pruebas de API o los archivos no están presentes'
        }
      }
    }
    stage('E2E Tests') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            sh """
            docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE} tests/e2e
            docker run --rm ${E2E_IMAGE}
            """
          }
        }
      }
      post {
        unstable {
          echo 'AVISO: No se ejecutaron pruebas E2E o el contenedor de Cypress falló'
        }
      }
    }
    stage('Performance Tests') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            sh """
            docker build -f tests/performance/Dockerfile.performance -t ${PERF_IMAGE} tests/performance
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
    success {
      echo 'Pipeline finalizado: Proceso completado exitosamente'
    }
    failure {
      echo 'Pipeline finalizado: Error crítico en el proceso'
    }
    always {
      sh 'docker system prune -f'
    }
  }
}