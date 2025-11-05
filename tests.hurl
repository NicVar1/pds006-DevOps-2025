# tests_alt.hurl
# Pruebas funcionales (forma segura, sin boundaries manuales)
# Uso: hurl tests_alt.hurl --test --variable PORT=3000
# Requisito: ./tests/test_images/test.jpg existe

#######################################################################
# 1) Registrar un computador frecuente (multipart/form-data)
#######################################################################
POST http://localhost:{{PORT}}/api/computers/frequent
[Form]
brand=Sony
model=VAIO
ownerName=Harry
ownerId=123456
photo@./tests/test_images/test.jpg;type=image/jpeg

HTTP/1.1 200
[Asserts]
jsonpath "$.device.id" exists
jsonpath "$.device.brand" == "Sony"


#######################################################################
# 2) Listar computadores frecuentes
#######################################################################
GET http://localhost:{{PORT}}/api/computers/frequent

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


#######################################################################
# 3) Registrar equipo médico (multipart/form-data)
#######################################################################
POST http://localhost:{{PORT}}/api/medicaldevices/checkin
[Form]
brand=GE
model=ECG1000
ownerName=Dr. House
ownerId=123512464
serial=f48238r7y2r
photo@./tests/test_images/test.jpg;type=image/jpeg

HTTP/1.1 200
[Asserts]
jsonpath "$.id" exists
jsonpath "$.brand" == "GE"


#######################################################################
# 4) Listar equipos médicos
#######################################################################
GET http://localhost:{{PORT}}/api/medicaldevices

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0


#######################################################################
# 5) Listar todos los dispositivos registrados
#######################################################################
GET http://localhost:{{PORT}}/api/devices/entered

HTTP/1.1 200
[Asserts]
jsonpath "$" count > 0
