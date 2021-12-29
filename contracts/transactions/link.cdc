import Tribes from "../Tribes.cdc"

        transaction() {

          

            prepare(signer: AuthAccount) {
                
                    signer.link<&Tribes.Identity{Tribes.IdentityPublic}>(Tribes.IdentityPublicPath, target: Tribes.IdentityStoragePath)
                
          
            }

            execute {
            
            }
        }