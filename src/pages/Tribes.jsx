import { useState, useContext, useEffect } from 'react';

import Nav from '../components/Nav.jsx';

function Tribes(props) {
  const [currentTribe, setCurrentTribe] = useState()
  const navigate = useNavigate()
  const { account, connectWallet, fcl } = useContext(FlowContext)

  /*
  useEffect(() => {
    if (!account) {
      connectWallet()
    }
    const getCurrentTribe = async () => {
      try {
        const data = await fcl.send([
          fcl.script(`
          import Tribes from 0x1960ff14acc51991
          
          pub fun main(account: Address, tenantOwner: Address): {String: String}? {
                                  
              let identity = getAccount(account).getCapability(Tribes.IdentityPublicPath)
                                          .borrow<&Tribes.Identity{Tribes.IdentityPublic}>()
                                          ?? panic("Could not get the Identity.")
          
              let tribe = identity.currentTribeName(tenantOwner)
          
              if tribe == nil {
                  return nil
              }
          
              let returnObject: {String: String} = {}
              let tenantData = Tribes.getTribeData(tenantOwner, tribeName: tribe!)
              returnObject["name"] = tribe
              returnObject["ipfsHash"] = tenantData.ipfsHash
              returnObject["description"] = tenantData.description
          
              return returnObject
          }`),
          fcl.args([
            fcl.arg(account.addr, t.Address),
            fcl.arg(Tenant, t.Address)
          ])
        ]).then(fcl.decode);
        setCurrentTribe(data)
      } catch { }
    }
    getCurrentTribe()
  }, [account, connectWallet])
  */

  return (
    <main>
      <Nav />
      <div className="hero">
        <div className="header">
          <h1> Tribes</h1>
          {account ? (
            !currentTribe ? (
              <button
                className="join"
                onClick={() => {
                  navigate('/all-tribes')
                }}
              >
                Join A Tribe
              </button>
            ) : (
              <button className="join" onClick={() => navigate('/my-tribe')}>
                View Your Tribe
              </button>
            )
          ) : null}
        </div>
      </div>
    </main>
  );
}

export { Tribes };