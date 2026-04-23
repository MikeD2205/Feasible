# Feasible — Guía de despliegue

## Estructura de archivos
```
feasible/
├── server.js          ← backend (Node.js)
├── package.json       ← dependencias
└── public/
    └── index.html     ← frontend
```

## Cómo desplegarlo en Render.com (gratis, 15 minutos)

### Paso 1 — Subir el código a GitHub
1. Ve a github.com y crea una cuenta gratuita si no tienes
2. Crea un nuevo repositorio llamado "feasible" (público)
3. Sube los tres archivos respetando la estructura de carpetas

### Paso 2 — Crear cuenta en Render.com
1. Ve a render.com
2. Regístrate con tu cuenta de GitHub (un clic)

### Paso 3 — Crear el servicio
1. En Render, haz clic en "New +" → "Web Service"
2. Conecta tu repositorio "feasible"
3. Configura:
   - Name: feasible
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
4. En "Environment Variables" añade:
   - Key: ANTHROPIC_API_KEY
   - Value: [tu API key de Anthropic]
5. Haz clic en "Create Web Service"

### Paso 4 — En línea
En 2-3 minutos Render te da una URL tipo:
https://feasible.onrender.com

¡Listo! Tu web funciona.

## Coste
- Render.com: GRATIS (plan free)
- Anthropic API: ~€0.003 por análisis (prácticamente gratis)

## Dominio personalizado (opcional)
Una vez funcionando, puedes comprar feasible.es o similar en namecheap.com (~€10/año)
y vincularlo desde el panel de Render en "Custom Domain".
