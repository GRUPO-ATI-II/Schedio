Write-Host "========================================"
Write-Host "Iniciando Prueba de Carga: Creación de Tareas"
Write-Host "========================================"
Write-Host ""

# Limpiar ejecuciones anteriores
Write-Host "[1/3] Limpiando reportes anteriores..."
if (Test-Path "results-load.jtl") { Remove-Item "results-load.jtl" -Force }
if (Test-Path "report-load") { Remove-Item -Recurse -Force "report-load" }

# Ejecutar Docker
Write-Host "[2/3] Ejecutando JMeter via Docker..."
Write-Host "      - Objetivo: 50 creaciones por segundo"
Write-Host "      - Duración: 60 segundos"
Write-Host ""

# Usamos host.docker.internal para alcanzar el localhost de Windows desde el contenedor
docker run --rm `
  --network="schedio_default" `
  -v "${PWD}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -n -t load-test-tasks.jmx `
  -l results-load.jtl `
  -e -o report-load `
  "-Jhost=host.docker.internal" `
  "-Jport=3000" `
  "-Jusers=10" `
  "-JrampUp=5" `
  "-Jduration=60" `
  "-JtargetTps=50"

Write-Host ""
Write-Host "========================================"
Write-Host "[3/3] Pruebas Finalizadas."
Write-Host "========================================"
Write-Host "--> Los resultados en CSV están en: tests\stress\results-load.jtl"
Write-Host "--> El reporte visual HTML está en: tests\stress\report-load\index.html"
Write-Host "Abre el archivo 'index.html' en tu navegador para ver las gráficas y estadísticas."
