# 📖 Manual de Usuario - Aplicación Tómbola

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Ejecución Local](#instalación-y-ejecución-local)
3. [Cómo Adicionar Nuevos Premios](#cómo-adicionar-nuevos-premios)
4. [Despliegue en Vercel](#despliegue-en-vercel)
5. [Despliegue en IIS (Windows Server)](#despliegue-en-iis-windows-server)
6. [Uso de la Aplicación](#uso-de-la-aplicación)

---

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** versión 18 o superior
  - Descarga desde: https://nodejs.org/
  - Verifica la instalación: `node --version`
- **npm** (se instala automáticamente con Node.js)
  - Verifica la instalación: `npm --version`
- **Git** (opcional, pero recomendado)
  - Descarga desde: https://git-scm.com/

---

## 🚀 Instalación y Ejecución Local

### Paso 1: Instalar dependencias

Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:

```powershell
npm install
```

### Paso 2: Ejecutar en modo desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

### Paso 3: Detener el servidor

Presiona `Ctrl + C` en la terminal para detener el servidor.

---

## 🎁 Cómo Adicionar Nuevos Premios

### Método 1: Editar el archivo JSON

1. Navega a la carpeta: `public/data/`
2. Abre el archivo `prizes.json`
3. Agrega un nuevo premio siguiendo este formato:

```json
[
  {
    "id": "1000",
    "name": "Premio $1000",
    "imageUrl": "../1000.png"
  },
  {
    "id": "2000",
    "name": "Premio $2000",
    "imageUrl": "../2000.png"
  },
  {
    "id": "auto",
    "name": "Automóvil 2025",
    "imageUrl": "../auto.png"
  }
]
```

**Campos:**
- `id`: Identificador único del premio (puede ser texto o número)
- `name`: Nombre descriptivo del premio
- `imageUrl`: Ruta relativa a la imagen del premio

### Método 2: Agregar imágenes de premios

1. Coloca la imagen del premio en la carpeta `public/`
2. Los formatos soportados son: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`
3. Actualiza el archivo `prizes.json` con la ruta correcta

**Ejemplo de estructura:**
```
public/
├── data/
│   └── prizes.json
├── 1000.png
├── 2000.png
├── auto.png
└── viaje.jpg
```

**⚠️ Importante:**
- Las rutas en `imageUrl` deben ser relativas a la carpeta `public/`
- Si la imagen está en `public/`, usa `"../nombre.png"`
- Si está en una subcarpeta, ajusta la ruta: `"../premios/nombre.png"`

---

## ☁️ Despliegue en Vercel

### Opción A: Despliegue desde el navegador (Más fácil)

1. **Crear cuenta en Vercel**
   - Ve a: https://vercel.com/signup
   - Regístrate con GitHub, GitLab o email

2. **Subir tu proyecto a GitHub** (si aún no lo has hecho)
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/tombola-app.git
   git push -u origin main
   ```

3. **Importar proyecto en Vercel**
   - Haz clic en "Add New Project"
   - Selecciona tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite
   - Haz clic en "Deploy"

4. **¡Listo!** Tu aplicación estará disponible en:
   ```
   https://tombola-app.vercel.app
   ```

### Opción B: Despliegue desde la terminal

1. **Instalar Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Iniciar sesión**
   ```powershell
   vercel login
   ```

3. **Desplegar**
   ```powershell
   vercel --prod
   ```

4. **Actualizaciones futuras**
   ```powershell
   # Cada vez que hagas cambios:
   git add .
   git commit -m "Descripción de cambios"
   git push
   
   # Vercel desplegará automáticamente
   ```

### Configuración de Vercel (Opcional)

Si necesitas configuración personalizada, crea `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 🖥️ Despliegue en IIS (Windows Server)

### Paso 1: Generar archivos de producción

En la carpeta del proyecto, ejecuta:

```powershell
npm run build
```

Esto creará una carpeta `dist/` con todos los archivos optimizados.

### Paso 2: Instalar IIS (si no está instalado)

1. Abre **Panel de Control** → **Programas** → **Activar o desactivar las características de Windows**
2. Marca **Internet Information Services**
3. Expande y asegúrate de marcar:
   - ✅ Servicios World Wide Web
   - ✅ Características de desarrollo de aplicaciones
   - ✅ Características HTTP comunes
4. Haz clic en **Aceptar** y espera la instalación

### Paso 3: Configurar sitio en IIS

1. Abre **Administrador de IIS** (busca "IIS" en el menú inicio)

2. **Crear nueva carpeta para el sitio:**
   ```
   C:\inetpub\wwwroot\tombola-app\
   ```

3. **Copiar archivos de producción:**
   - Copia todo el contenido de la carpeta `dist/` a `C:\inetpub\wwwroot\tombola-app\`

4. **Crear nuevo sitio web:**
   - Clic derecho en **Sitios** → **Agregar sitio web**
   - **Nombre del sitio:** TombolaApp
   - **Ruta de acceso física:** `C:\inetpub\wwwroot\tombola-app`
   - **Puerto:** 80 (o el que prefieras, ej: 8080)
   - **Nombre de host:** (opcional) tombola.tudominio.com
   - Haz clic en **Aceptar**

### Paso 4: Configurar URL Rewrite (Importante para React/Vite)

1. **Instalar URL Rewrite Module:**
   - Descarga desde: https://www.iis.net/downloads/microsoft/url-rewrite
   - Instala el módulo

2. **Crear archivo web.config** en `C:\inetpub\wwwroot\tombola-app\`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="React Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <mimeMap fileExtension=".woff" mimeType="application/font-woff" />
      <mimeMap fileExtension=".woff2" mimeType="application/font-woff2" />
    </staticContent>
  </system.webServer>
</configuration>
```

### Paso 5: Verificar y probar

1. Abre el navegador y ve a:
   - `http://localhost` (o el puerto que configuraste)
   - Si configuraste un hostname: `http://tombola.tudominio.com`

2. Verifica que todas las imágenes carguen correctamente

### Paso 6: Actualizar la aplicación (cuando hagas cambios)

```powershell
# 1. Generar nueva versión
npm run build

# 2. Detener el sitio en IIS
# En el Administrador de IIS: clic derecho en el sitio → Detener

# 3. Copiar nuevos archivos
# Reemplaza todo en C:\inetpub\wwwroot\tombola-app\

# 4. Iniciar el sitio
# En el Administrador de IIS: clic derecho en el sitio → Iniciar
```

### Solución de problemas comunes en IIS

**Problema: Error 404 en las rutas**
- Solución: Verifica que web.config esté correctamente configurado con URL Rewrite

**Problema: Imágenes no cargan**
- Solución: Verifica que las rutas en `prizes.json` sean correctas
- Asegúrate de copiar todas las carpetas de `dist/`

**Problema: "Cannot GET /"**
- Solución: Verifica que `index.html` esté en la raíz de `C:\inetpub\wwwroot\tombola-app\`

---

## 🎮 Uso de la Aplicación

### 1. Pantalla de Configuración

1. **Ingresa el número ganador** (5 dígitos del 0-9)
2. **Selecciona un premio** del menú desplegable
3. Presiona el botón **OK** o presiona **Enter**

### 2. Pantalla de Inicio

- Aparecerá la imagen `start.png`
- Haz **clic** en la pantalla o presiona **Espacio/Enter** para iniciar

### 3. Animación de la Tómbola

- La tómbola animada (tombola.gif) se mostrará de fondo
- En el lado derecho verás:
  - Logo (loto.png)
  - Texto "Winner" (winner.png)
  - 5 esferas vacías
  - Los números aparecerán uno por uno cada segundo
  - Al finalizar, se mostrará el cuadrado con el premio

### 4. Pantalla Final de Ganador

Después de 5 segundos, se mostrará:
- Logo en la esquina superior derecha
- Imagen "Winner"
- Los 5 números en esferas
- Rectángulo con:
  - Imagen "Premio.png" (30% izquierdo)
  - Imagen del premio ganado (70% derecho)

---

## 📝 Notas Adicionales

### Personalización de Imágenes

Puedes reemplazar las siguientes imágenes en la carpeta `public/`:

- `tombola.gif` - Animación de fondo
- `start.png` - Pantalla de inicio
- `loto.png` - Logo superior
- `winner.png` - Imagen "Winner"
- `Esfera.png` - Esfera para números
- `Cuadrado.png` - Cuadro del premio (fase intermedia)
- `rectangulo.png` - Rectángulo de la pantalla final
- `Premio.png` - Icono de premio
- `logo.png` - Logo superior derecho (pantalla final)

**Recomendaciones:**
- Mantén los mismos nombres de archivo
- Usa formatos PNG para imágenes con transparencia
- Usa GIF para animaciones
- Tamaños recomendados: 1920x1080 para fondos, 500x500 para logos

### Soporte Técnico

Si encuentras problemas:
1. Verifica la consola del navegador (F12)
2. Revisa que todas las imágenes existan en `public/`
3. Asegúrate de que `prizes.json` tenga formato JSON válido
4. Limpia la caché del navegador (Ctrl + Shift + Delete)

---

## 🔄 Comandos Rápidos de Referencia

```powershell
# Desarrollo local
npm install          # Instalar dependencias
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Generar archivos de producción
npm run preview      # Vista previa de la versión de producción

# Vercel
vercel               # Desplegar en Vercel
vercel --prod        # Desplegar a producción
vercel login         # Iniciar sesión

# Git (para actualizaciones)
git add .
git commit -m "Descripción de cambios"
git push
```

---

**Versión del Manual:** 1.0  
**Última actualización:** Noviembre 2025
