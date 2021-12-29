import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlowContext } from './context'
import './styles/Tribes.css'
import Nav from './components/Nav.js'
import Loader from './components/Loader'
import { Tenant } from './shared'

import * as t from '@onflow/types'

const TribesPage = () => {
  const navigate = useNavigate()
  const { account, connectWallet, fcl } = useContext(FlowContext)
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Processing...')
  const [currentTribe, setCurrentTribe] = useState({})

  const leaveTribe = async () => {
    try {
      setIsLoading(true)
      setLoaderMessage('Intitiaing Transaction...')
      const transactionId = await fcl
        .send([
          fcl.transaction(`
        import Tribes from 0x1960ff14acc51991

        transaction(tenantOwner: Address) {

            let TribesIdentity: &Tribes.Identity

            prepare(signer: AuthAccount) {
                self.TribesIdentity = signer.borrow<&Tribes.Identity>(from: Tribes.IdentityStoragePath)
                                        ?? panic("Could not borrow the Tribes.Identity")
            }

            execute {
                self.TribesIdentity.leaveTribe(tenantOwner)
                log("This signer left their Tribe.")
            }
        }
        `),
          fcl.args([fcl.arg(Tenant, t.Address)]),
          fcl.proposer(fcl.authz),
          fcl.payer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(999),
        ])
        .then(fcl.decode)
      setLoaderMessage('Leaving Tribe...')
      await fcl.tx(transactionId).onceSealed()
      setIsLoading(false)
      navigate('/')
    } catch {}
  }

  useEffect(() => {
    if (!account) {
      connectWallet()
    }

    const getCurrentTribe = async () => {
      try {
        setIsLoading(true)
        setLoaderMessage('')
        const data = await fcl
          .send([
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
              fcl.arg(Tenant, t.Address),
            ]),
          ])
          .then(fcl.decode)

        setCurrentTribe({
          name: data.name,
          image: data.ipfsHash,
          description: data.description,
        })
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    getCurrentTribe()
  }, [account, connectWallet])

  return (
    <main>
      <Nav />
      {isLoading ? (
        <Loader loaderMessage={loaderMessage} />
      ) : account && currentTribe ? (
        <div className="container-2">
          <div className="container-3">
            {currentTribe.image === 'N/A' ? (
              <div className="tribe-card">
                <h2>{currentTribe.name}</h2>
              </div>
            ) : (
              <img
                src={`https://ipfs.infura.io/ipfs/${currentTribe.image}/`}
                alt={currentTribe.name}
                className="tribe"
              />
            )}

            <div className="text">
              <h1>{currentTribe.name}</h1>
              <p className="description">{currentTribe.description}</p>
            </div>
          </div>
          <button className="join" onClick={leaveTribe}>
            Leave Tribe
          </button>
        </div>
      ) : (
        account && (
          <div className="container-2">
            <button className="join" onClick={() => navigate('/all-tribes')}>
              Join a Tribe
            </button>
          </div>
        )
      )}

      {!account && (
        <div className="container-2">
          <h1>Connect Wallet to view your tribe</h1>
        </div>
      )}
    </main>
  )
}

export default TribesPage
