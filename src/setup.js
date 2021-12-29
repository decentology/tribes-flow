import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/Tribes.css'
import { Tenant } from './shared'
import { FlowContext } from './context'
import Loader from './components/Loader'

const Setup = () => {
  const navigate = useNavigate()
  const { account, connectWallet } = useContext(FlowContext)
  const [instance, setInstance] = useState < Boolean > (false)
  const [isLoading, setIsLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Processing...')
  // const [imageFile, setImageFile] = useState()
  const [formInput, updateInput] = useState({
    name: '',
    description: '',
  })

  const createInstance = async () => {
    if (!account) connectWallet()
    try {
      setIsLoading(true)
      setLoaderMessage('Intitiaing Transaction...')
      // const instanceTxn = await tribesContract.createInstance()
      setLoaderMessage('Processing Transaction...')
      // await instanceTxn.wait()
      setInstance(true)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const addNewTribe = async () => {
    // if (!account) connectWallet()
    // try {
    //   setIsLoading(true)
    //   setLoaderMessage('Uploading image...')
    //   const data = JSON.stringify({
    //     name: formInput.name,
    //     description: formInput.description,
    //     image: skylink.replace('sia://', ''),
    //   })
    //   setLoaderMessage('Uploading Metadata...')

    //   try {
    //     setLoaderMessage('Intiating Transaction...')
    //     // const addTxn = await tribesContract.addNewTribe(
    //     //   file.replace('sia://', ''),
    //     // )
    //     // console.log(addTxn)
    //     // setLoaderMessage('Processing Transaction...')
    //     // await addTxn.wait()
    //     // setIsLoading(false)
    //   } catch { }
    // } catch { }
  }

  return (
    <main>
      {isLoading ? (
        <Loader loaderMessage={loaderMessage} />
      ) : (
        <div className="hero">
          {!instance && (
            <>
              <button className="join" type="submit" onClick={createInstance}>
                Create Instance
              </button>
              <p className="error">
                If you creater instance, change the Tenant in shared.ts to the
                signer address.
              </p>
            </>
          )}

          {!account ? (
            <div className="container-2">
              <button className="connect" type="submit" onClick={connectWallet}>
                Connect Wallet
              </button>
            </div>
          ) : account?.toLowerCase() === Tenant.toLowerCase() ? (
            <div className="container-2">
              <input
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updateInput({ ...formInput, name: e.target.value })
                }
              />
              <input
                type="file"
                id="tribe-image"
                name="tribe image"
                accept="image/*, .jpg"
              // onChange={(e) => setImageFile(e.target.files[0])}
              />
              <input
                type="text"
                placeholder="Description"
                onChange={(e) =>
                  updateInput({ ...formInput, description: e.target.value })
                }
              />
              <button className="join" type="submit" onClick={addNewTribe}>
                Add Tribe
              </button>
            </div>
          ) : (
            <div className="container-2">
              <h4 className="error">You are not the owner of this project.</h4>
              <h4 className="error">
                If you are, please use the right tenant address for this
                project.
              </h4>
            </div>
          )}
          <button
            className="connect"
            type="submit"
            onClick={() => navigate('/')}
          >
            Home
          </button>
        </div>
      )}
    </main>
  )
}
export default Setup
