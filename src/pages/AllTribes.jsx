import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlowContext } from '../context.js'
// import { Tenant } from '../shared'
import '../styles/Tribes.css'
import Nav from '../components/Nav.jsx'
import Loader from '../components/Loader'

import * as t from "@onflow/types";

const AllTribes = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Processing...')
  const [allTribes, setAllTribes] = useState([])
  const { account, connectWallet, fcl } = useContext(FlowContext)

  /*
  const joinTribe = async (tribeName) => {
    try {
      setIsLoading(true)
      setLoaderMessage('Intitializing Transaction...')
      const transactionId = await fcl.send([
        fcl.transaction(`
        import Tribes from 0x1960ff14acc51991

        transaction(tenantOwner: Address, tribeName: String) {

            let TribesIdentity: &Tribes.Identity

            prepare(signer: AuthAccount) {
                if signer.borrow<&Tribes.Identity>(from: Tribes.IdentityStoragePath) == nil {
                    signer.save(<- Tribes.createIdentity(), to: Tribes.IdentityStoragePath)
                    signer.link<&Tribes.Identity{Tribes.IdentityPublic}>(Tribes.IdentityPublicPath, target: Tribes.IdentityStoragePath)
                }
                
                self.TribesIdentity = signer.borrow<&Tribes.Identity>(from: Tribes.IdentityStoragePath)
                                        ?? panic("Could not borrow the Tribes.Identity")
            }

            execute {
                self.TribesIdentity.joinTribe(tenantOwner, tribeName: tribeName)
                log("This signer joined a Tribe.")
            }
        }
        `),
        fcl.args([
          fcl.arg(Tenant, t.Address),
          fcl.arg(tribeName, t.String)
        ]),
        fcl.proposer(fcl.authz),
        fcl.payer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(999)
      ]).then(fcl.decode);

      console.log(transactionId)

      setLoaderMessage('Joining Tribe...')

      await fcl.tx(transactionId).onceSealed();
      setIsLoading(false)
      navigate('/my-tribe')
    } catch { }
  }
  */

  /*
  useEffect(() => {
    if (!account) connectWallet()
    const getAllTribes = async () => {
      try {
        setIsLoading(true)
        setLoaderMessage('')
        const tribes = await fcl.send([
          fcl.script(`
          import Tribes from 0x1960ff14acc51991
          
          pub fun main(tenantOwner: Address): [Tribes.TribeData] {
              return Tribes.getAllTribes(tenantOwner).values
          }
          `),
          fcl.args([
            fcl.arg(Tenant, t.Address)
          ])
        ]).then(fcl.decode);

        let allTribes = []
        for (let i = 0; i < Object.keys(tribes).length; i++) {
          let data = tribes[i];
          allTribes.push({
            id: i,
            name: data.name,
            image: data.ipfsHash,
            description: data.description,
          })
        }
        setAllTribes(allTribes)
        setIsLoading(false)
      } catch { }
    }
    getAllTribes()
  }, [account, connectWallet])
  */

  const joinTribe = () => { };

  return (
    <main>
      <Nav />
      {isLoading ? (
        <Loader loaderMessage={loaderMessage} />
      ) : (
        <div className="container">
          <h1>Tribes</h1>
          {!allTribes ? (
            <>
              <h5>There are currently no existing tribes.</h5>
              <a href="/">Go back home</a>
            </>
          ) : (
            account && (
              <>
                <h5>Select Your Tribe</h5>
                <div className="all-tribes">
                  {allTribes.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        joinTribe(item.name)
                      }}
                    >
                      <img
                        className="cards"
                        src={`https://ipfs.infura.io/ipfs/${item.image}/`}
                        alt={item.name}
                      />
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>
      )}
    </main>
  )
}

export { AllTribes };
