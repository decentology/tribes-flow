import Tribes from "../Tribes.cdc"

transaction(newTribeName: String, ipfsHash: String, description: String) {

    let TribesAdmin: &Tribes.Admin

    prepare(tenantOwner: AuthAccount) {
        self.TribesAdmin = tenantOwner.borrow<&Tribes.Admin>(from: Tribes.AdminStoragePath)
                            ?? panic("Could not find the Tenant's admin")
    }

    execute {
        self.TribesAdmin.addNewTribe(newTribeName: newTribeName, ipfsHash: ipfsHash, description: description)
        log("This admin has added a new tribe to join.")
    }
}

