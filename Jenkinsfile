pipeline {
  agent any
  environment {
    FRONTEND_IMAGE = "frontend-app"
    BACKEND_IMAGE   = "backend-app"
    API_TEST_IMAGE  = "api-tests"
    E2E_IMAGE      = "e2e-tests"
    PERF_IMAGE     = "perf-tests"
    QA_PROJECT     = "schedio-main-pipeline"
    QA_NETWORK     = "schedio-main-pipeline_default"
    QA_COMPOSE     = "docker-compose.qa.yml"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('DoD: Docker') {
      steps { sh 'docker version' }
    }
    stage('Unit Tests') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'docker build -f ./schedio-frontend/Dockerfile.test -t frontend-test ./schedio-frontend'
          sh 'docker run --rm frontend-test'
        }
      }
    }
    stage('Backend Unit Tests') {
      steps {
        script {
          sh 'docker rm -f schedio-mongo schedio-backend schedio-frontend 2>/dev/null || true'
          sh "docker compose -f docker-compose.yml -p ${QA_PROJECT} down --remove-orphans || true"
          sh "docker compose -f docker-compose.yml -p ${QA_PROJECT} up -d mongo"
          catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
            sh 'docker build -f ./backend/Dockerfile.test -t backend-test ./backend'
            sh "docker run --rm --network ${QA_NETWORK} backend-test"
          }
        }
      }
    }
    stage('Build') {
      parallel {
        stage('Build Frontend') {
          steps { sh "docker build -f ./schedio-frontend/Dockerfile.build -t ${FRONTEND_IMAGE}:build ./schedio-frontend" }
        }
        stage('Build Backend') {
          steps { sh "docker build -f ./backend/Dockerfile.build -t ${BACKEND_IMAGE}:build ./backend" }
        }
      }
    }
    stage('QA: API + E2E') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            sh """
              set -e
              echo "=== Limpieza y levantamiento QA ==="
              docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} down -v --remove-orphans || true
              DOCKER_BUILDKIT=1 docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} build --parallel
              docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} up -d
              docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} ps

              echo "=== Esperando frontend (200) y backend (400/201, no 500) ==="
              docker run --rm --network ${QA_NETWORK} curlimages/curl:latest sh -c '
                for i in \$(seq 1 25); do
                  F=\$(curl -s -o /dev/null -w "%{http_code}" http://frontend/es/ 2>/dev/null || echo "000")
                  B=\$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "{}" http://backend:3000/api/users/register 2>/dev/null || echo "000")
                  echo "  intento \$i: frontend=\$F backend=\$B"
                  if [ "\$F" = "200" ] && ( [ "\$B" = "400" ] || [ "\$B" = "201" ] ); then echo "  OK"; exit 0; fi
                  [ "\$B" = "500" ] && echo "  Backend 500, esperando..." || true
                  sleep 3
                done
                echo "  ERROR: timeout"; exit 1
              '

              echo "=== Pruebas API (Newman) ==="
              docker build -f tests/api/Dockerfile.test -t ${API_TEST_IMAGE} tests/api
              docker run --rm --network ${QA_NETWORK} ${API_TEST_IMAGE}

              echo "=== Pruebas E2E (Cypress) ==="
              docker build -f tests/e2e/Dockerfile.e2e -t ${E2E_IMAGE}:latest ./tests/e2e
              docker run --rm --network ${QA_NETWORK} -e CYPRESS_BASE_URL=http://frontend/es ${E2E_IMAGE}:latest
            """
          }
        }
      }
      post {
        failure {
          sh "docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} logs backend 2>/dev/null || true"
        }
        unstable {
          echo 'QA: API y/o E2E fallaron'
        }
      }
    }
    stage('Performance Tests (JMeter)') {
      steps {
        script {
          catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
            sh """
              docker build -f tests/performance/Dockerfile.perf -t ${PERF_IMAGE} .
              docker run --rm --network ${QA_NETWORK} ${PERF_IMAGE} \
                -n -t stress-test.jmx -l results.jtl \
                -Jhost=backend -Jport=3000 -Jusers=10 -JrampUp=5 -Jloops=1
            """
          }
        }
      }
      post {
        unstable { echo 'Performance: fallo o no disponible' }
      }
    }
  }
  post {
    success { echo 'Pipeline OK' }
    failure { echo 'Pipeline fallido' }
    always {
      sh "docker compose -f docker-compose.yml -p ${QA_PROJECT} down --remove-orphans || true"
      sh "docker compose -f ${QA_COMPOSE} -p ${QA_PROJECT} down --remove-orphans || true"
      sh 'docker system prune -f'
    }
  }
}
