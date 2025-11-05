# tests.hurl
# Pruebas funcionales para la API Elysia (local)
# - El servidor debe correr en http://localhost:3000
# - Imagen de prueba: ./tests/test_images/test.jpg

################################################################
# 1) Registrar un computador frecuente
################################################################
POST http://localhost:{{PORT}}/api/computers/frequent
Content-Type: multipart/form-data; boundary=BOUNDARY

--BOUNDARY
Content-Disposition: form-data; name="brand"

Sony
--BOUNDARY
Content-Disposition: form-data; name="model"

VAIO
--BOUNDARY
Content-Disposition: form-data; name="ownerName"

Harry
--BOUNDARY
Content-Disposition: form-data; name="ownerId"

123456
--BOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--BOUNDARY--

HTTP/1.1 200
[Asserts]
jsonpath "$.device.id" exists
jsonpath "$.device.brand" == "Sony"


################################################################
# 2) Listar computadores frecuentes
################################################################
GET http://localhost:{{PORT}}/api/computers/frequent

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 3) Registrar equipo médico
################################################################
POST http://localhost:{{PORT}}/api/medicaldevices/checkin
Content-Type: multipart/form-data; boundary=BOUNDARY

--BOUNDARY
Content-Disposition: form-data; name="brand"

GE
--BOUNDARY
Content-Disposition: form-data; name="model"

ECG1000
--BOUNDARY
Content-Disposition: form-data; name="ownerName"

Dr. House
--BOUNDARY
Content-Disposition: form-data; name="ownerId"

123512464
--BOUNDARY
Content-Disposition: form-data; name="serial"

f48238r7y2r
--BOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.jpg"
Content-Type: image/jpeg

< ./tests/test_images/test.jpg
--BOUNDARY--

HTTP/1.1 200
[Asserts]
jsonpath "$.id" exists
jsonpath "$.brand" == "GE"


################################################################
# 4) Listar equipos médicos
################################################################
GET http://localhost:{{PORT}}/api/medicaldevices

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


################################################################
# 5) Listar todos los dispositivos registrados
################################################################
GET http://localhost:{{PORT}}/api/devices/entered

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0
