import './styles/Tribes.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import * as Hyperverse from "@decentology/hyperverse";
import * as HyperverseFlow from '@decentology/hyperverse-flow';
import * as Tribes from '@decentology/hyperverse-flow-tribes';

import * as Pages from './pages';

const hyperversePromise = Hyperverse.initialize({
  blockchain: HyperverseFlow,
  network: Hyperverse.networks.TestNet,
  modules: [
    { bundle: Tribes, tenantID: '0x1960ff14acc51991' }
  ]
});

const App = (props) => {
  const flow = HyperverseFlow.useFlow();
  console.log(flow);
  return (
    <Routes>
      <Route path="/" element={<Pages.Tribes />} />
      {/* <Route path="/setup" element={<Pages.Setup />} /> */}
      <Route path="/all-tribes" element={<Pages.AllTribes />} />
      <Route path="/my-tribe" element={<Pages.MyTribe />} />
    </Routes>
  )
}

function WrappedApp(props) {
  return (
    <BrowserRouter>
      <Hyperverse.Provider Hyperverse={hyperversePromise}>
        <App />
      </Hyperverse.Provider>
    </BrowserRouter>
  );
}

export default WrappedApp;
