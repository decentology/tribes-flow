import IHyperverseComposable from "./IHyperverseComposable.cdc"
import HyperverseModule from "./HyperverseModule.cdc"

pub contract Tribes: IHyperverseComposable {

    /**************************************** FUNCTIONALITY ****************************************/

    pub event TribesContractInitialized()

    pub let AdminStoragePath: StoragePath
    pub resource Admin {
        pub let tenant: Address
        pub fun addNewTribe(newTribeName: String, ipfsHash: String, description: String) {
            let state = Tribes.getTenant(self.tenant)!
            state.tribes[newTribeName] = TribeData(_name: newTribeName, _ipfsHash: ipfsHash, _description: description)
        }

        init(_ tenant: Address) {
            self.tenant = tenant
        }
    }

    pub resource interface IdentityPublic {
        pub fun currentTribeName(_ tenant: Address): String?
    }

    pub struct IdentityData {
        pub(set) var currentTribeName: String?
        init() { 
            self.currentTribeName = nil 
        }
    }

    pub let IdentityStoragePath: StoragePath
    pub let IdentityPublicPath: PublicPath
    pub resource Identity: IdentityPublic {
        access(contract) var datas: {Address: IdentityData}
        access(contract) fun getData(_ tenant: Address): &IdentityData {
            if self.datas[tenant] == nil { 
                self.datas[tenant] = IdentityData() 
            }
            return &self.datas[tenant] as &IdentityData 
        }

        pub fun joinTribe(_ tenant: Address, tribeName: String) {
            pre {
                Tribes.getAllTribes(tenant)[tribeName] != nil:
                    "This Tribe does not exist!"
            }
            let state = Tribes.getTenant(tenant)!
            let me = self.owner!.address

            assert(state.participants[me] == nil || !state.participants[me]!, message: "Member already belongs to a Tribe!")
            
            state.tribes[tribeName]!.addMember(member: me)
            state.participants[me] = true
            
            let data = self.getData(tenant)
            data.currentTribeName = tribeName
        }

        pub fun leaveTribe(_ tenant: Address) {
            let data = self.getData(tenant)
            let currentTribe = data.currentTribeName ?? panic("You don't belong to a Tribe.")
            let me = self.owner!.address
            let state = Tribes.getTenant(tenant)!

            assert(state.participants[me]!, message: "Member does not belong to a Tribe!")
            state.tribes[currentTribe]!.removeMember(member: me)
            state.participants[me] = false
            
            data.currentTribeName = nil
        }

        pub fun currentTribeName(_ tenant: Address): String? { 
            return self.getData(tenant).currentTribeName
        }

        init() {
            self.datas = {}
        }
    }

    pub fun createIdentity(): @Identity { 
        return <- create Identity() 
    }

    pub struct TribeData {
        pub let name: String
        pub let ipfsHash: String
        pub var description: String
        access(contract) var members: {Address: Bool}

        pub fun getMembers(): [Address] {
            return self.members.keys
        }

        access(contract) fun addMember(member: Address) {
            self.members[member] = true
        }

        access(contract) fun removeMember(member: Address) {
            self.members.remove(key: member)
        }

        init(_name: String, _ipfsHash: String, _description: String) {
            self.name = _name
            self.ipfsHash = _ipfsHash
            self.description = _description
            self.members = {}
        }
    }

    pub fun getAllTribes(_ tenant: Address): {String: TribeData} {
        return self.getTenant(tenant)!.tribes
    }

    pub fun getTribeData(_ tenant: Address, tribeName: String): TribeData {
        return self.getTenant(tenant)!.tribes[tribeName]!
    }

    /**************************************** TENANT ****************************************/

    pub var metadata: HyperverseModule.Metadata

    pub event TenantCreated(tenant: Address)
    access(contract) var tenants: @{Address: IHyperverseComposable.Tenant}
    access(contract) fun getTenant(_ tenant: Address): &Tenant? {
        if self.tenantExists(tenant) {
            let ref = &self.tenants[tenant] as auth &IHyperverseComposable.Tenant
            return ref as! &Tenant  
        }
        return nil
    }
    pub fun tenantExists(_ tenant: Address): Bool {
        return self.tenants[tenant] != nil
    }

    pub resource Tenant {
        pub var tenant: Address

        pub(set) var tribes: {String: TribeData}
        pub(set) var participants: {Address: Bool}

        init(_ tenant: Address) {
            self.tenant = tenant
            self.tribes = {}
            self.participants = {}
        }
    }

    pub fun createTenant(newTenant: AuthAccount) {
        let tenant = newTenant.address
        self.tenants[tenant] <-! create Tenant(tenant)
        emit TenantCreated(tenant: tenant)

        newTenant.save(<- create Admin(tenant), to: self.AdminStoragePath)
    }

    init() {
        self.tenants <- {}
        self.metadata = HyperverseModule.Metadata(
                            _identifier: self.getType().identifier,
                            _contractAddress: self.account.address,
                            _title: "Tribes", 
                            _authors: [HyperverseModule.Author(_address: 0x26a365de6d6237cd, _externalLink: "https://www.decentology.com/")], 
                            _version: "0.0.1", 
                            _publishedAt: getCurrentBlock().timestamp,
                            _externalUri: ""
                        )

        self.AdminStoragePath = /storage/TribesAdmin
        self.IdentityStoragePath = /storage/TribesIdentity
        self.IdentityPublicPath = /public/TribesIdentity

        emit TribesContractInitialized()
    }
}