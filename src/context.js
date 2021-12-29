import {
  useState,
  createContext,
  useEffect
} from 'react'

import * as fcl from '@onflow/fcl';

fcl.config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://flow-wallet-testnet.blocto.app/authn');

export const FlowContext = createContext({});

const FlowProvider = ({ children }) => {
  const [account, setAccount] = useState();

  const connectWallet = () => {
    fcl.authenticate();
  };

  const logOut = () => {
    fcl.unauthenticate();
  };

  useEffect(() => {
    fcl.currentUser().subscribe(setAccount);
  }, []);

  return (
    <FlowContext.Provider value={{ account, connectWallet, fcl }}>
      {children}
    </FlowContext.Provider>
  )
}

export default FlowProvider
