# Contexto: 
Es un CRM Veterinario que permita tener diferentes roles dentro del programa, donde cada quien tendrá un apartado especial donde podrá trabajar en base a su rol, dando un servicio especializado según su rol, por ejemplo:
-Los usuarios, podrán registrarse, inscribir a sus mascotas, agendar citas de peluquería, paseo o veterinaria, pero además, podrán ver las historías clínicas y los resultados de la peluquería
-Los veterinarios, así como los peluqueros y los paseadores, podrán ver sus citas pendientes que fueron agendadas previamente por los usuarios
-Los veterinarios podrán crear una historia clínica básica que se guardará en la base de datos, y que los usuarios podrán acceder a ella para recordar cómo le fue en la consulta.
**nota:** La peluqueria no tiene muchas funciones ya que las imágenes deben subirse a una plataforma espcial, cuyas funcionalidades en el corto plazo, no podrán ser implementadas 

# Requerimientos funcionales:
|ID|	Nombre|	Descripción|
|---|---|---|
|RF-001	|Registro de usuario. |El sistema deberá permitir que el usuario se registre con un usuario, correo y contraseña.|
|RF-002	|Registro de mascota.	|El sistema deberá permitir que el usuario registre a su mascota con nombre, especie, raza, sexo, |fecha de nacimiento, peso, color, fotografía y observaciones de la mascota.|
|RF-003	|Recuperación de contraseña.	|El sistema deberá permitir al usuario recuperar la contraseña en caso de olvidarla.|
|RF-004	|Registro de veterinario.	|El sistema deberá permitir al veterinario registrarse con nombre, correo, identificación y licencia de veterinario.|
|RF-005	|Realizar historia clínica.	|El sistema deberá permitir al veterinario crear una historia clínica de la mascota.|
|RF-006	|Registro de peluquero.	|El sistema deberá permitir al peluquero registrarse con nombre, correo e identificación.|
|RF-007	|Registro de paseador canino.	|El sistema deberá permitir al paseador registrarse con nombre, correo e identificación.|
|RF-008	|Visualización de pendientes.	|El sistema deberá permitir al trabajador ver sus citas pendientes.|
|RF-010	|Inicio de Sesión.	|El sistema deberá permitir que solo los usuarios registrados puedan iniciar sesión con usuario y contraseña.|
|RF-011	|Gestión de Roles.	|El sistema deberá identificar el rol del usuario y mostrar las funcionalidades disponibles/habilitadas que le correspondan.|
|RF-012	|Actualización de perfil.	|El sistema deberá permitir que los usuarios actualicen su información personal y datos de contacto.|
|RF-013	|Asociación Mascota-Propietario.	|El sistema deberá permitir asociar una o más mascotas a un propietario.|
|RF-014	|Agendamiento de Citas.	|El sistema deberá permitir al propietario solicitar una cita veterinaria, de paseo o peluquería.|
|RF-015	|Disponibilidad de Profesionales.	|El sistema deberá mostrar los horarios disponibles de los profesionales antes de agendar una cita.|
|RF-016	|Reprogramación de citas.	|El sistema deberá permitir reprogramar una cita previamente registrada.|
|RF-017	|Cancelación de citas.	|El sistema deberá permitir cancelar una cita y registrar su estado.|
|RF-018	|Recordatorio de citas.	|El sistema deberá enviar recordatorios al propietario antes de una cita programada.|

---

# Requerimientos no funcionales:
|ID|	Nombre|	Descripción|
|---|---|---|
|RNF-001|	Compatibilidad con cualquier dispositivo.|	El sistema deberá funcionar en cualquier dispositivo, ya sea computador de mesa, laptop, teléfono móvil o tableta.|
|RNF-002|	Responsive web design.|	El sistema deberá tener responsive web design para garantizar una buena visualización de la interfaz sin importar la resolución de la pantalla.|
|RNF-003|	Idioma español.|	El sistema deberá estar escrito el idioma español como lenguaje principal.|
|RNF-004|	Tiempo de actividad.|	El sistema deberá estar disponible el 95% del tiempo.|
|RNF-005|	Compatibilidad con otros navegadores.|	El sistema deberá ser compatible con los navegadores más usados (Chrome, Edge, Firefox, Opera, Brave).|
|RNF-006|	Interfaz simple e intuitiva.|	El sistema deberá tener una interfaz simple de usar tanto para usuarios, como para los que trabajan con las mascotas.|
|RNF-007|	Datos protegidos.|	El sistema deberá proteger los datos de los usuarios, mascotas y los trabajadores.|
|RNF-008|	Base de datos segura.|	El sistema no deberá guardar credenciales de acceso en comentarios o código para proteger la base de datos.|
|RNF-009|	Tiempo de reacción de los inputs.|	El sistema no deberá tardar en promedio más de 3 segundos en procesar una solicitud.|
|RNF-010|	Documentación y organización.|	El sistema deberá estar debidamente documentado y organizado en caso de que se siga expandiendo el proyecto.|

---