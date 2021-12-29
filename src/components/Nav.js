import "../styles/Tribes.css"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { FlowContext } from '../context'
const Nav = () => {
  const { account, connectWallet } = useContext(FlowContext)

  return (
    <nav>
      <Link to="/" className="logo">
        T
      </Link>
      <div className="right-nav">

        <a href="https://docs-hyperhack.decentology.com/learn-with-examples" target="_blank" rel="noreferrer" >About</a>

        {!account ? (<button className="connect" onClick={connectWallet}>
          Connect Wallet
        </button>)
          : (
            <button className="connect">
              {account.addr.slice(0, 5) + "..." + account.addr.slice(account.addr.length - 5, account.addr.length)}
            </button>
          )}
      </div>
    </nav>
  )
}

export default Nav
