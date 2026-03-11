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
          script {
              // Red fija para que backend-test pueda usar --network schedio-main-pipeline_default
              sh 'docker compose -f docker-compose.yml -p schedio-main-pipeline down --remove-orphans || true'
              sh 'docker compose -f docker-compose.yml -p schedio-main-pipeline up -d mongo'

              catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                  sh 'docker build -f ./backend/Dockerfile.test -t backend-test ./backend'

                  // Conectar el test a la red que Jenkins acaba de crear
                  sh 'docker run --rm --network schedio-main-pipeline_default backend-test'
              }
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
                    docker compose -f docker-compose.qa.yml -p schedio-main-pipeline down -v --remove-orphans || true
                    docker compose -f docker-compose.qa.yml -p schedio-main-pipeline up -d backend mongo
                    echo "⏳ Esperando estabilización completa (15s)..."
                    sleep 15
                    docker compose -f docker-compose.qa.yml -p schedio-main-pipeline logs backend
                    docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
                    docker run --rm --network schedio-main-pipeline_default ${API_TEST_IMAGE}
                    """
                }
            }
        }
        post {
            failure {
                sh "docker compose -f docker-compose.qa.yml -p schedio-main-pipeline logs backend"
            }
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
                    docker build -f tests/performance/Dockerfile.perf -t ${PERF_IMAGE} .
                    docker run --rm --network schedio-main-pipeline_default ${PERF_IMAGE} \
                      -n -t stress-test.jmx \
                      -l results.jtl \
                      -Jhost=backend -Jport=3000 -Jusers=10 -JrampUp=5 -Jloops=1
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
  stage('E2E Tests') {
  steps {
    script {
      catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
        sh """
          set -e

          echo "🔹 Levantando servicios con docker compose..."
          docker compose -f docker-compose.qa.yml -p schedio-main-pipeline down -v --remove-orphans || true
          docker compose -f docker-compose.qa.yml -p schedio-main-pipeline up -d
          docker compose -f docker-compose.qa.yml -p schedio-main-pipeline ps

          echo "⏳ Esperando a que frontend y backend respondan..."
          docker run --rm --network schedio-main-pipeline_default curlimages/curl:latest sh -c '
            code=000;
            for i in $(seq 1 45); do
              code=$$(curl -s -o /dev/null -w "%{http_code}" http://frontend/es/ 2>/dev/null || echo "000");
              if [ "$$code" = "200" ]; then echo "Frontend OK"; break; fi;
              echo "Frontend wait $$i/45 ($$code)"; sleep 2;
            done;
            if [ "$$code" != "200" ]; then echo "Frontend no respondio 200"; exit 1; fi;
            for i in $(seq 1 30); do
              code=$$(curl -s -o /dev/null -w "%{http_code}" http://backend:3000/api/users/register -X POST -H "Content-Type: application/json" -d "{}" 2>/dev/null || echo "000");
              if [ "$$code" = "400" ] || [ "$$code" = "201" ] || [ "$$code" = "500" ]; then echo "Backend OK ($$code)"; exit 0; fi;
              echo "Backend wait $$i/30 ($$code)"; sleep 2;
            done;
            echo "Backend no respondio"; exit 1
          '
          docker compose -f docker-compose.qa.yml -p schedio-main-pipeline logs backend

          echo "🔹 Construyendo imagen E2E..."
          docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE}:latest ./tests/e2e

          #echo "🔹 Detectando red docker-compose..."

          echo "🔹 Ejecutando Cypress..."
          docker run --rm \
            --network schedio-main-pipeline_default \
            -e CYPRESS_BASE_URL=http://frontend/es \
            ${E2E_IMAGE}:latest
        """
      }
    }
  }
    post {
      failure {
          sh "docker compose -f docker-compose.qa.yml -p schedio-main-pipeline logs backend"
      }
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
      sh 'docker compose -f docker-compose.yml -p schedio-main-pipeline down --remove-orphans || true'
      sh 'docker compose -f docker-compose.qa.yml -p schedio-main-pipeline down --remove-orphans || true'
      sh 'docker system prune -f'
    }
  }
}
