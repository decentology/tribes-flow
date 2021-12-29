import Tribes from "../Tribes.cdc"

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

