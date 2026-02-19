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
    stage('DoD: Check Docker Permission'){
        steps {

            sh 'docker version'
        }
    }
    stage('Build Services') {
        parallel {
            stage('Build Frontend') {
                steps {
                    // Using the specific 'builder' target for the frontend
                    sh 'docker build --target builder -t ${FRONTEND_IMAGE}:build ./schedio-frontend'
                }
            }
            stage('Build Backend') {
                steps {
                    // Building the backend (defaults to the last stage, 'production')
                    sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
                }
            }
        }
    }
    stage('Frontend Production Image') {
        steps {
            // We target the 'production' stage for the final, slim image
            sh 'docker build --target production -t ${FRONTEND_IMAGE}:latest ./schedio-frontend'
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