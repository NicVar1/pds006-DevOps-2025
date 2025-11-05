# tests.hurl
# Pruebas automáticas para la API Elysia del sistema de ingreso de equipos médicos vía QR

# --- 1. Registrar un computador frecuente ---

# tests.hurl
# Pruebas funcionales para la API Elysia (local)
# - Requisitos: el servidor debe correr en http://localhost:3000
# - Archivo de imagen de prueba: ./tests/test_images/test.jpg (se incluye en el repo como placeholder)

################################################################
# 1) Registrar un computador frecuente (multipart/form-data)
################################################################
POST http://localhost:3000/api/computers/frequent
[Multipart]
brand: Sony
model: VAIO
ownerName: Harry
ownerId: 123456
photo: file,tests/test_images/test.jpg; image/jpeg

HTTP/1.1 200
[Asserts]
jsonpath "$.device.id" exists
jsonpath "$.device.brand" == "Sony"


################################################################
# 2) Listar computadores frecuentes (espera >= 1 elemento)
################################################################
GET http://localhost:3000/api/computers/frequent

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 3) Registrar equipo médico (multipart/form-data)
################################################################
POST http://localhost:3000/api/medicaldevices/checkin
[Multipart]
brand: GE
model: ECG1000
ownerName: Dr. House
ownerId: 123512464
serial: f48238r7y2r
photo: file,tests/test_images/test.jpg; image/jpeg

HTTP/1.1 200
[Asserts]
jsonpath "$.id" exists
jsonpath "$.brand" == "GE"


################################################################
# 4) Listar equipos médicos (espera >= 1 elemento)
################################################################
GET http://localhost:3000/api/medicaldevices

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 5) Listar todos los dispositivos registrados
################################################################
GET http://localhost:3000/api/devices/entered

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


# Notas:
# - Si tu API devuelve 201 en lugar de 200 para creaciones, ajusta los códigos esperados arriba.
# - Si necesitas encadenar (capturar IDs y reutilizarlos), se pueden añadir capturas con Hurl (ej: jsonpath capture),
#   pero lo dejé fuera por compatibilidad básica. Si quieres que añada capturas/cadenas, lo hago en la siguiente iteración.


# --- 2. Listar computadores frecuentes ---
GET http://localhost:3000/api/computers/frequent

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


# --- 3. Registrar equipo médico ---
POST http://localhost:3000/api/medicaldevices/checkin
Content-Type: multipart/form-data; boundary=WebKitFormBoundary123

# tests.hurl
# Pruebas funcionales para la API Elysia (local)
# - Requisitos: el servidor debe correr en http://localhost:3000
# - Archivo de imagen de prueba: ./tests/test_images/test.jpg (se incluye en el repo como placeholder)

################################################################
# 1) Registrar un computador frecuente (multipart/form-data)
################################################################
POST http://localhost:3000/api/computers/frequent
Content-Type: multipart/form-data; boundary=HURLBOUNDARY

--HURLBOUNDARY
Content-Disposition: form-data; name="brand"

Sony
--HURLBOUNDARY
Content-Disposition: form-data; name="model"

VAIO
--HURLBOUNDARY
Content-Disposition: form-data; name="ownerName"

Harry
--HURLBOUNDARY
Content-Disposition: form-data; name="ownerId"

123456
--HURLBOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--HURLBOUNDARY--

HTTP/1.1 200
[Asserts]
jsonpath "$.device.id" exists
jsonpath "$.device.brand" == "Sony"


################################################################
# 2) Listar computadores frecuentes (espera >= 1 elemento)
################################################################
GET http://localhost:3000/api/computers/frequent

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 3) Registrar equipo médico (multipart/form-data)
################################################################
POST http://localhost:3000/api/medicaldevices/checkin
Content-Type: multipart/form-data; boundary=HURLBOUNDARY

--HURLBOUNDARY
Content-Disposition: form-data; name="brand"

GE
--HURLBOUNDARY
Content-Disposition: form-data; name="model"

ECG1000
--HURLBOUNDARY
Content-Disposition: form-data; name="ownerName"

Dr. House
--HURLBOUNDARY
Content-Disposition: form-data; name="ownerId"

123512464
--HURLBOUNDARY
Content-Disposition: form-data; name="serial"

f48238r7y2r
--HURLBOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--HURLBOUNDARY--

HTTP/1.1 200
[Asserts]
jsonpath "$.id" exists
jsonpath "$.brand" == "GE"


################################################################
# 4) Listar equipos médicos (espera >= 1 elemento)
################################################################
GET http://localhost:3000/api/medicaldevices

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 5) Listar todos los dispositivos registrados
################################################################
GET http://localhost:3000/api/devices/entered

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


# Notas:
# - Si tu API devuelve 201 en lugar de 200 para creaciones, ajusta los códigos esperados arriba.
# - Si necesitas encadenar (capturar IDs y reutilizarlos), se pueden añadir capturas con Hurl (ej: jsonpath capture).
