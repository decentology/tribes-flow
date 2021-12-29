import Tribes from "../Tribes.cdc"

transaction() {

    prepare(signer: AuthAccount) {
        Tribes.createTenant(newTenant: signer)
    }

    execute {
        log("Create a new instance of a Tribes Tenant.")
    }
}
