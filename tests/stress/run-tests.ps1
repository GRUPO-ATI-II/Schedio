Write-Host "========================================"
Write-Host "Iniciando Pruebas de Estrés con JMeter"
Write-Host "========================================"
Write-Host ""

# Limpiar ejecuciones anteriores
Write-Host "[1/3] Limpiando reportes anteriores..."
if (Test-Path "results.jtl") { Remove-Item "results.jtl" -Force }
if (Test-Path "report") { Remove-Item -Recurse -Force "report" }

# Ejecutar Docker
Write-Host "[2/3] Descargando y ejecutando JMeter via Docker (puede tardar la primera vez)..."
Write-Host "      - 500 Usuarios Virtuales"
Write-Host "      - 30 segundos de Ramp-Up"
Write-Host ""

# Usamos host.docker.internal para alcanzar el localhost de Windows desde el contenedor
docker run --rm `
  -v "${PWD}:/tests" `
  -w /tests `
  justb4/jmeter:5.5 `
  -n -t stress-test.jmx `
  -l results.jtl `
  -e -o report `
  "-Jhost=host.docker.internal" `
  "-Jport=3000" `
  "-Jusers=500" `
  "-JrampUp=30" `
  "-Jloops=1"

Write-Host ""
Write-Host "========================================"
Write-Host "[3/3] Pruebas Finalizadas."
Write-Host "========================================"
Write-Host "--> Los resultados en CSV están en: tests\stress\results.jtl"
Write-Host "--> El reporte visual HTML está en: tests\stress\report\index.html"
Write-Host "Abre el archivo 'index.html' en tu navegador para ver las gráficas y estadísticas."
