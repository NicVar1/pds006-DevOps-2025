# tests.hurl
# Pruebas automáticas para la API Elysia del sistema de ingreso de equipos médicos vía QR

# --- 1. Registrar un computador frecuente ---
POST http://localhost:3000/api/computers/frequent
Content-Type: multipart/form-data; boundary=WebKitFormBoundary123

# 👇 salto de línea vacío necesario
--WebKitFormBoundary123
Content-Disposition: form-data; name="brand"

Sony
--WebKitFormBoundary123
Content-Disposition: form-data; name="model"

VAIO
--WebKitFormBoundary123
Content-Disposition: form-data; name="ownerName"

Harry
--WebKitFormBoundary123
Content-Disposition: form-data; name="ownerId"

123456
--WebKitFormBoundary123
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--WebKitFormBoundary123--

HTTP/1.1 200
[Asserts]
jsonpath "$.device.id" exists


# --- 2. Listar computadores frecuentes ---
GET http://localhost:3000/api/computers/frequent
HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


# --- 3. Registrar equipo médico ---
POST http://localhost:3000/api/medicaldevices/checkin
Content-Type: multipart/form-data; boundary=WebKitFormBoundary123

--WebKitFormBoundary123
Content-Disposition: form-data; name="brand"

GE
--WebKitFormBoundary123
Content-Disposition: form-data; name="model"

ECG1000
--WebKitFormBoundary123
Content-Disposition: form-data; name="ownerName"

Dr. House
--WebKitFormBoundary123
Content-Disposition: form-data; name="ownerId"

123512464
--WebKitFormBoundary123
Content-Disposition: form-data; name="serial"

f48238r7y2r
--WebKitFormBoundary123
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--WebKitFormBoundary123--

HTTP/1.1 200
[Asserts]
jsonpath "$.id" exists


# --- 4. Listar equipos médicos ---
GET http://localhost:3000/api/medicaldevices
HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


# --- 5. Listar todos los dispositivos registrados ---
GET http://localhost:3000/api/devices/entered
HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0
