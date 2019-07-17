# rrhhHorario

Agregar en el complemento JS:

```javascript
//V 3.1 2019-05-14 fix asistencias
var Dia = new Date();
var ticks = Dia.getTime();
var URL= window.location.pathname;
console.log(URL);
if ( (URL.includes("fichada"))) {
$.getScript("https://kity-linuxero.github.io/rrhhHorario/horario.js?"+ticks);
```
