# **Prueba Técnica — Full Stack (Frontend + Serverless en AWS)** 

**Puesto:** Full Stack Senior Developer **Duración sugerida:** 3 a 5 días (entrega asíncrona) 

## **1. Objetivo** 

Construir y **desplegar en AWS** una pequeña aplicación **completamente operativa** que gestione un **catálogo** mediante un **CRUD** sobre una arquitectura **serverless** , y publicar el **frontend** en una **URL pública** . 

El entregable principal es un **enlace que abra y funcione en el navegador** . Si el enlace no abre o el catálogo no opera contra la nube, la prueba se considera no superada. 

## **2. Qué vas a construir** 

Un **catálogo de productos** (o artículos) con imágenes. Desde el navegador se debe poder: 

**Crear** un producto (nombre, descripción, precio/categoría y **al menos una imagen** ). 

- **Listar** el catálogo mostrando las imágenes y ver el **detalle** de un producto. 

- **Editar** un producto existente. 

**Eliminar** un producto (con confirmación). 

Los datos y las imágenes deben **persistir** (si recargas la página siguen ahí; si otra persona abre la URL, ve el mismo catálogo). 

La forma de almacenar y servir las imágenes es **decisión tuya** : queremos ver cómo resuelves ese problema en un entorno serverless. 

### **Multi-tenant (varias marcas)** 

La aplicación debe ser **multi-tenant** : manejar varias **marcas (tenants)** , cada una con su **catálogo totalmente independiente** . 

- El frontend debe incluir un **selector de marca (tenant)** . 

- Al seleccionar una marca, se muestra **únicamente** el catálogo de esa marca, y debe **funcionar realmente** (cambio de marca → cambio de catálogo). 

- Los datos de cada tenant deben estar **aislados** : las operaciones (crear/editar/eliminar) de una marca **no** afectan ni exponen el catálogo de otra. 

Debe haber al menos **2 o 3 marcas** cargadas para poder demostrar el aislamiento. 

Cómo modelas y aíslas los datos por tenant es **decisión tuya** : es una parte importante de lo que evaluamos. 

## **3. Arquitectura obligatoria (Serverless en AWS)** 

- **Backend serverless en AWS** para el CRUD (funciones **Lambda** , expuesto por **API Gateway** , con persistencia en **DynamoDB** ). 

- **Frontend en Vue.js 3 + TypeScript** (se recomienda **Composition API** con `<script setup>` y **Vite** ), desplegado como sitio en **S3 + CloudFront o** en **AWS Amplify Hosting** . 

El frontend debe consumir la API real (nada de datos mockeados/hardcodeados). 

- **La infraestructura debe definirse con AWS CDK en TypeScript** (infraestructura como código, no configuración manual por consola). Todo el aprovisionamiento (Lambda, API Gateway, DynamoDB, almacenamiento de imágenes y hosting del frontend) debe quedar declarado en el código CDK. 

## **4. Sobre la API** 

No te decimos cómo diseñar la API. Queremos ver **cómo piensas** y qué buenas prácticas aplicas por tu cuenta. La API debe: 

- Seguir **estándares y buenas prácticas** de diseño (organización de recursos, uso correcto de los métodos y códigos de estado HTTP, respuestas coherentes en JSON, manejo de errores claro). 

- Estar **bien estructurada, predecible y consistente** . 

**Validar** los datos de entrada en el backend (no confiar solo en el frontend). 

Tener **CORS** correctamente configurado. 

Parte de la evaluación es observar el **criterio** con el que diseñas la API sin que te den la solución. 

## **5. Requisitos del Frontend (Vue.js)** 

El frontend debe demostrar que sabes construir una interfaz sólida y usable: 

- ☐ **Vue.js 3 + TypeScript** (Composition API, tipado real, sin `any` por todos lados). 

- ☐ **Selector de marca (tenant)** funcional: al cambiar de marca se muestra el catálogo correspondiente y **aislado** de esa marca. 

- ☐ Diseño **responsive** (se ve bien en móvil y escritorio). 

- ☐ Catálogo con **imágenes** mostradas correctamente (grid/tarjetas y vista de detalle). 

- ☐ **Estados de carga** (loading / skeletons / spinners) mientras se consultan los datos. 

- ☐ **Manejo de errores** visible para el usuario (ej. "No se pudo guardar, intenta de nuevo"). 

- ☐ **Validación de formularios** (campos requeridos, mensajes claros). 

- ☐ **Feedback al usuario** al crear/editar/eliminar (toast, mensaje de éxito, etc.). 

- ☐ **Confirmación** antes de eliminar. 

- ☐ La lista se **actualiza automáticamente** tras crear/editar/eliminar (sin recargar a mano). 

- ☐ **Uso de cookies** aplicando buenas prácticas (por ejemplo, para recordar la **marca seleccionada** , preferencias del usuario o sesión; atributos apropiados como `Secure` , `HttpOnly` cuando corresponda, `SameSite` ). 

- ☐ Código organizado (componentes, separación de la capa de llamadas a la API, variables de entorno para la URL de la API — **no** URL quemada en el código). 

#### **Puntos extra (no obligatorios, suman):** 

Manejo de estado/datos con **Pinia** , **Vuex** o **TanStack Query for Vue** . 

- Paginación, búsqueda o filtros en el catálogo. 

- Pruebas (unit test con **Vitest / Vue Test Utils** ). 

- Accesibilidad básica (labels, foco, contraste, alt en imágenes). 

Buen uso de una librería de UI (Vuetify, Tailwind, etc.). 

## **6. Entregables** 

1. **URL pública del frontend operativa** (S3+CloudFront o Amplify). Debe abrir y operar el catálogo. _(Entregable principal.)_ 

2. **URL base de la API** — para poder probar el backend por separado. 

3. **Repositorio Git** (GitHub/GitLab/Bitbucket) con **todo el código** (frontend + backend/infraestructura como código). 

4. **README** que incluya: - Cómo está organizado el proyecto. - Cómo se despliega (pasos o comando). - Decisiones técnicas: por qué elegiste lo que elegiste (incluido cómo resolviste el almacenamiento de imágenes y el manejo de cookies). - Qué mejorarías si tuvieras más tiempo. 

5. **(Opcional) Video corto (2–4 min)** mostrando la app en funcionamiento y explicando la arquitectura. 

## **7. Criterios de evaluación (100 puntos)** 

|**Criterio**|**Peso**|
|---|---|
|**La aplicación opera correctamente**(URL abre + catálogo funcional +**multi-tenant real**contra AWS)|30|
|**Calidad del frontend en Vue.js**(UX, selector de marca, estados, errores, imágenes, responsive, TS, cookies)|25|
|**Diseño de la API y arquitectura serverless**(buenas prácticas,**aislamiento por tenant**, Lambda + API Gateway +<br>DynamoDB, IaC con**CDK en TS**)|20|
|**Calidad de código**(orden, tipado, buenas prácticas, sin secretos quemados)|15|
|**Documentación y comunicación**(README claro, decisiones justificadas)|10|
|**Extras**(tests, Pinia/TanStack Query, filtros, accesibilidad, etc.)|+10<br>bonus|



**Umbral para aprobar:** 70/100 **y** la URL del frontend debe funcionar (requisito eliminatorio). 

## **8. Reglas y notas** 

- **Nosotros te proporcionamos las credenciales de acceso a AWS** , que te enviaremos **por correo electrónico** . Debes usar **esa cuenta** para desplegar la prueba. 

- **Nunca subas las credenciales de AWS al repositorio** ni las dejes escritas en el código. Usa variables de entorno / perfiles locales. 

No se aceptan datos mockeados/estáticos: los datos deben venir de la nube a través de la API. 

El CRUD debe correr sobre **servicios serverless de AWS** (no Firebase, Supabase, Heroku, etc.). 

## **9. Preguntas que haremos en la revisión (para prepararte)** 

1. ¿Cómo diseñaste la API y por qué la estructuraste así? 

2. ¿Cómo modelaste el **aislamiento de datos entre marcas (tenants)** ? ¿Cómo evitas que una marca acceda al catálogo de otra? 

3. ¿Cómo resolviste el almacenamiento y la entrega de las imágenes? 

4. ¿Cómo y para qué usaste las cookies? ¿Qué atributos de seguridad aplicaste? 

5. ¿Cómo manejas los errores de la API en el frontend? 

6. ¿Cómo organizaste tu stack de **CDK en TypeScript** ? ¿Cómo separaste los recursos? 

7. ¿Cómo desplegaste el frontend y cómo publicas una nueva versión? 

8. Si el catálogo tuviera 100.000 productos, ¿qué cambiarías? 

**Resumen:** Queremos ver un enlace que **abra en el navegador** , con un **selector de marca (multi-tenant)** que muestre el **catálogo independiente** de cada marca, y que permita **crear / listar / editar / eliminar** productos con imágenes, sobre 

una arquitectura **serverless en AWS** , con un **frontend en Vue.js 3 + TypeScript** bien hecho, y el **código en un repositorio** con su README. Envíanos la **URL del frontend** para ver cómo quedó funcionando. 

