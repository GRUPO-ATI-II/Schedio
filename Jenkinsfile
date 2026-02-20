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
//    stage('Unit Tests') {
//      steps {
//        sh "docker run --rm ${FRONTEND_IMAGE}:build npm test -- --watchAll=false"
//      }
//    }
//    stage('API Tests (Postman/Newman)') {
//      steps {
//        script {
//          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
//            sh """
//            docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
//            docker run --rm ${API_TEST_IMAGE} newman run coleccion.postman_collection.json -e entorno.postman_environment.json
//            """
//          }
//        }
//      }
//      post {
//        unstable {
//          echo 'AVISO: No se ejecutaron pruebas de API o los archivos no están presentes'
//        }
//      }
//    }
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
          //docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE}:latest tests/e2e
          docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE}:latest .

          echo "🔹 Detectando red docker-compose..."
          NET=schedio-main-pipeline_default

              echo "🔹 Ejecutando Cypress..."
          docker run --rm \
            --network "\$NET" \
            //${E2E_IMAGE}:latest
            docker run --rm --network host ${E2E_IMAGE}:latest
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
//    stage('Performance Tests') {
//      steps {
//        script {
//          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
//            sh """
//            docker build -f tests/performance/Dockerfile.performance -t ${PERF_IMAGE} tests/performance
//            docker run --rm ${PERF_IMAGE}
//            """
//          }
//        }
//      }
//      post {
//        unstable {
//          echo 'AVISO: No se ejecutaron pruebas de Performance o los scripts de JMeter faltan'
//        }
//      }
//    }
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