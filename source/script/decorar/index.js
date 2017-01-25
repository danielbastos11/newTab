import tFlux              from 'tFlux'
import tFluxReact         from 'tFluxReact'
import MemorizerContainer from './container.jsx'
import MemorizerStore     from './store.js'

tFlux.use(tFluxReact);

let Memorizer = tFlux.bind(MemorizerContainer, MemorizerStore);

export default Memorizer;
