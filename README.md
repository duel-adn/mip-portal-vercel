# Prototipo del portale Muoversi in Piemonte

Prototipo del portale [Muoversi in piemonte] commissionato da [5T]
## Stack tecnologico

| Componente | Descrizione | 
| ---------- | ----------- |
| [NVM.js] | Node version manager |
| [Node.js] | Node Javascript runtime |
| [NPM.js] | Node package manager |
| [Next.js] | React framework |
| [Leaflet] | Leaflet map library |
| [Headless UI] | Libreria di componenti headless |
| [React-select] | WAI-ARIA Compliant select component | 
| [mapbox/polyline] | Libreria per la conversione delle geometrie [Google]  |
| [next-translate] | Libreria internazionalizzazione per [Next.Js] | 
| [react-toastify] | Libreria per toaster (messaggi per l'utente non bloccanti) |

## Installazione ubuntu

1. Installare [NVM.js] seguendo le istruzioni sul sito;
1. Installare [Node.js] versione 14+;
```nvm install 14```
1. Creare applicazione nextjs
```npx create-next-app```
1. Installare sass
```npm install sass```
1. Installare il font Tittlium web [source]
```npm install @fontsource/titillium-web```
1. Installare `react-leaflet` e `leaflet`
```npm install react-leaflet```
```npm install leaflet```
1. Installare `headlessui/react`
```npm install @headlessui/react```
1. Installare `react-select`
```npm i --save react-select```
1. Installare `mapbox/polyline`
```npm install @mapbox/polyline```
1. Installare `next-translate`
```npm install next-translate```
1. Installare `react-toastify`
```npm install react-toastify```

[5T]:https://www.5t.torino.it
[Muoversi in piemonte]:https://www.muoversinpiemonte.it
[source]:https://npm.io/package/fontsource-titillium-web
[NVM.js]:https://github.com/nvm-sh
[Node.js]:https://nodejs.org/
[NPM.js]:https://www.npmjs.com/
[Next.js]:https://nextjs.org/
[Headless UI]:https://headlessui.dev/
[Leaflet]:https://leafletjs.com/
[Headless UI]:https://headlessui.dev/
[React-select]:https://react-select.com/
[mapbox/polyline]:https://github.com/mapbox/polyline
[Google]:https://developers.google.com/maps/documentation/utilities/polylinealgorithm
[next-translate]:https://github.com/vinissimus/next-translate
[react-toastify]:https://github.com/fkhadra/react-toastify#readme