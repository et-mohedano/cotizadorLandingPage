# Cotizador de Landing Page

Este proyecto es un cotizador de landing pages que permite a los usuarios obtener una estimación de los costos asociados con el desarrollo de una landing page personalizada. El cotizador toma en cuenta varios servicios y funcionalidades adicionales que los usuarios pueden seleccionar para personalizar su cotización.

## Características

- **Selección de Servicios**: Los usuarios pueden seleccionar servicios como diseño web, desarrollo, marketing y más.
- **Adición de Secciones Adicionales**: Permite añadir secciones adicionales como "Quiénes Somos", "Servicios", entre otros.
- **Funcionalidades Adicionales**: Opciones para agregar funcionalidades como blogs, SEO, chat en vivo, etc.
- **Calculadora Dinámica**: Los costos se calculan automáticamente basados en la selección del usuario.
- **Interfaz Responsiva**: Implementado con Bootstrap para una buena experiencia en dispositivos móviles y de escritorio.

## Tecnologías Utilizadas

- HTML
- CSS
- JavaScript
- Bootstrap 5.2

## Configuración y Personalización

El proyecto está diseñado para ser fácilmente modificable. A continuación se describen algunos de los ajustes que puedes hacer:

### Modificar Costos y Tarifas

Los costos y tarifas están definidos en el archivo `quoteCalculator.js`. Aquí puedes ajustar los precios por hora para diferentes roles y servicios, así como los costos fijos como el hosting o dominio.

```javascript
const hourlyRates = {
    designer: 120,  // Costo por hora del diseñador
    developer: 150,  // Costo por hora del desarrollador
    business_developer: 140,  // Costo por hora del desarrollador de negocios
    other: 135  // Costo por hora para otros servicios
};

const hostingCostPerYear = 1200; // Costo anual del hosting
const domainCost = 800; // Costo anual del dominio
const corporateEmailCostPerYear = 500; // Costo anual de correos corporativos
```
### Añadir o Modificar Servicios y Funcionalidades
Puedes añadir o modificar servicios y funcionalidades editando las estructuras de datos en quoteCalculator.js. Por ejemplo, para añadir un nuevo servicio, modifica el objeto serviceHours.

```javascript
const serviceHours = {
    design: 10, // Horas estimadas para diseño
    development: 16, // Horas estimadas para desarrollo
    // Añade nuevos servicios aquí
};
```
### Cambios en el Estilo
Los estilos se pueden modificar en el archivo style.css. Este archivo incluye estilos para el gradiente de fondo, botones, y más, usando variables CSS para facilitar la personalización de colores y otros estilos visuales.
```css
:root {
    --first-color: #9147fb;  // Color principal
    --second-color: #cdfb4f;  // Color secundario
    // Define más colores o estilos aquí
}
```
## Contribuir
Las contribuciones son bienvenidas. Si deseas contribuir al proyecto, por favor haz un fork del repositorio y envía un pull request con tus cambios.

## Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.


