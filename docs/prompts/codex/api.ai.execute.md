# Tareas

## Tarea 1: modifica endpoint api/ai/execute
- el objeto request tendra una propiedad adicional: auth_code que es un string y obligatorio
- agregar las validaciones y mensajes de error necesarios

## Tarea 2: modifica funcion aiAgentAction
1. agregar a la funcion el parametro authCod: string y opcional, por defecto es null
2. en la funcion, define una variable companyId: string que servirá para guardar la compañia del cliente.
3. la llamada a checkAuthenticationAndPermission y sus validaciones posteriores solo se ejecutan si authCode == null. Si no hay error: asignar a companyId el valor obtenido en authResult.company.id
4. si authCode != null, realizar los siguientes pasos:

4.1 llamar a userGetByColumnCached para determinar el usuario, envia como parametros: column = "phone" y value = authCode
4.2 si no se encontro hacer resp.message = el mensaje de error obtenido y return resp.
4.3 si encontró el usuario llamar a companyGetByUserCached con parametros: el userId obtenido en el punto 4.1 y role = ""
4.4. si no se encontro hacer resp.message = el mensaje de error obtenido y return resp.
4.5. si lo encontro hacer companyId = company.id obtenido

5. Seguir con el flujo de la funcion. NO modificar nada mas