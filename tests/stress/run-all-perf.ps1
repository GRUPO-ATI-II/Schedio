Write-Host "========================================"
Write-Host "Iniciando Batería Completa de Pruebas: Estrés + Carga"
Write-Host "========================================"
Write-Host ""

# Limpiar ejecuciones anteriores
Write-Host "[1/4] Limpiando archivos previos..."
if (Test-Path "results-all.jtl") { Remove-Item "results-all.jtl" -Force }
if (Test-Path "report-all") { Remove-Item -Recurse -Force "report-all" }

# 1. Ejecutar Stress Test (Login/Registro)
Write-Host "[2/4] Ejecutando Prueba de Estrés (Login/Registro)..."
docker run --rm `
  --network="schedio_default" `
  -v "${PWD}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -n -t stress-test.jmx `
  -l results-all.jtl `
  "-Jhost=host.docker.internal" `
  "-Jport=3000" `
  "-Jusers=500" `
  "-JrampUp=30" `
  "-Jloops=1"

# 2. Ejecutar Load Test (Creación de Tareas)
Write-Host "[3/4] Ejecutando Prueba de Carga (Tareas)..."
docker run --rm `
  --network="schedio_default" `
  -v "${PWD}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -n -t load-test-tasks.jmx `
  -l results-all.jtl `
  "-Jhost=host.docker.internal" `
  "-Jport=3000" `
  "-Jusers=10" `
  "-JrampUp=5" `
  "-Jduration=60" `
  "-JtargetTps=50"

# 3. Generar Reporte Unificado
Write-Host "[4/4] Generando Reporte HTML Unificado..."
docker run --rm `
  --network="schedio_default" `
  -v "${PWD}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -g results-all.jtl -o report-all

Write-Host ""
Write-Host "========================================"
Write-Host "Proceso Finalizado."
Write-Host "========================================"
Write-Host "--> Resultados combinados en: tests\stress\results-all.jtl"
Write-Host "--> Reporte visual unificado en: tests\stress\report-all\index.html"
Write-Host "Abre el archivo 'index.html' en tu navegador para ver las estadísticas globales."
