import HyperverseModule from "./HyperverseModule.cdc"

pub contract interface IHyperverseComposable {

    pub var metadata: HyperverseModule.Metadata

    pub event TenantCreated(tenant: Address)
    access(contract) var tenants: @{Address: Tenant}
    access(contract) fun getTenant(_ tenant: Address): &Tenant?
    pub fun tenantExists(_ tenant: Address): Bool

    pub resource Tenant {
        pub var tenant: Address
    }
    pub fun createTenant(newTenant: AuthAccount)
}
