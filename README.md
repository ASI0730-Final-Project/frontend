## Pasos

### Crear carpetas
Borrar todo lo de src
Crear estructura de carpetas

|_ server<br>
.....|_ db.json<br>
.....|_ routes.json<br>
.....|_ start.sh<br>
|_ src<br>
.....|_ locales<br>
..........|_ en.json<br>
..........|_ es.json<br>
.....|_ public<br>
..........|_ components<br>
................|_ footer-content.component.vue<br>
................|_ language-switcher.component.vue<br>
................|_ language-switcher.component.vue<br>
..........|_ pages<br>
................|_ home.component.vue<br>
................|_ content.component.vue<br>
.....|_ router<br>
..........|_ index.js<br>
.....|_ components<br>
|_ .env.development<br>
|_ .env.production<br>

### Instalar dependencias

1. Global<br>
npm install -g json-server@0.17.4

2. Crear + bootstrap con Vite<br>
npm init vite@latest mi-proyecto -- --template vue<br>
cd mi-proyecto<br>
npm install

3. Router<br>
npm install vue-router@4

4. i18n<br>
npm install vue-i18n@next

5. HTTP Client<br>
npm install axios

6. PrimeVue + estilos<br>
npm install primevue@latest primeicons primeflex @primeuix/themes

7. (Opcional) Linter / formateador <br>
npm install -D eslint prettier



json-server --watch server/db.json --routes server/routes.json