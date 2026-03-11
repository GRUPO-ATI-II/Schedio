Write-Host "========================================"
Write-Host "Iniciando Prueba de Rendimiento: Gestión de Eventos"
Write-Host "========================================"
Write-Host ""

# Limpiar ejecuciones anteriores
Write-Host "[1/4] Limpiando reportes anteriores..."
if (Test-Path "$PSScriptRoot\results-events.jtl") { Remove-Item "$PSScriptRoot\results-events.jtl" -Force }
if (Test-Path "$PSScriptRoot\report-events") { Remove-Item -Recurse -Force "$PSScriptRoot\report-events" }

# Paso 2: Ejecutar JMeter (Solo carga, sin generar reporte)
Write-Host "[2/4] Ejecutando carga con JMeter..."
docker run --rm `
  --network="schedio_default" `
  -v "${PSScriptRoot}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -n -t performance-test-events.jmx `
  -l results-events.jtl `
  "-Jhost=host.docker.internal" `
  "-Jport=3000" `
  "-Jusers=10" `
  "-JrampUp=5" `
  "-Jduration=60" `
  "-JtargetTps=30"

# Paso 3: Generar el reporte HTML desde el archivo .jtl ya creado
Write-Host "[3/4] Generando reporte visual..."
docker run --rm `
  -v "${PSScriptRoot}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -g results-events.jtl -o report-events

Write-Host ""
Write-Host "========================================"
Write-Host "[4/4] Pruebas Finalizadas."
Write-Host "========================================"
Write-Host "--> Los resultados en CSV están en: $PSScriptRoot\results-events.jtl"
Write-Host "--> El reporte visual HTML está en: $PSScriptRoot\report-events\index.html"
Write-Host "Abre el archivo 'index.html' en tu navegador para ver las gráficas."