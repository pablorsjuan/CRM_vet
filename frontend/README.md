# crm-vet

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
cd crm-vet
npm run serve
ctrl + C para apagar
```

El frontend consume la API en `http://localhost:3000` por defecto. Para usar otra
dirección, configura `VUE_APP_API_URL` en el entorno antes de iniciar o compilar.
Las sesiones de autenticación se mantienen en `sessionStorage` y se cierran al salir.

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
