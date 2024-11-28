import { blockchain, prop, proposals, proposalUtil, tok, token } from "../util.js"
import { initContracts } from "../setup.js"
import { Name } from "@greymass/eosio"
import { expectToThrow, nameToBigInt } from "@eosnetwork/vert"
import { constructActionParams, ProposalsFactory } from "../proposalUtil.js"
import { expect } from "chai"
import { describe, it, beforeEach } from "mocha"

beforeEach(async () => {
  blockchain.resetTables()
  await initContracts()
})

describe("Proposal Tests", () => {
  it("account with balance can create a main proposal", async () => {
    const creator = "alice"
    const minStake = proposalUtil.getConfig("main", "minstake")[1]
    await tok("transfer", { from: "eosio.token", to: creator, quantity: minStake, memo: "" })
    const proposal = ProposalsFactory.createMainWithDefaults({ creator })
    const params = proposal.getActionParams()
    await prop("create", params, creator)
    const proposalsTable = proposals.tables.proposals(nameToBigInt("proposals")).getTableRows()
    expect(proposalsTable).length(1)
  })
  it("account with no or not enough balance can't create a main proposal", async () => {
    const creator = "alice"
    const minStake = proposalUtil.getConfig("main", "minstake")[1]
    const proposal = ProposalsFactory.createMainWithDefaults({ creator })
    const params = proposal.getActionParams()
    await expectToThrow(prop("create", params, creator), "eosio_assert: no balance object found for account alice")
    await tok("transfer", { from: "eosio.token", to: creator, quantity: "0.0001 EOS", memo: "" })
    await expectToThrow(prop("create", params, creator), "eosio_assert_message: the account alice has 0.0001 EOS, minimum required balance to create this proposal is 10.0000 EOS")
  })
})

nameToBigInt("this.name")
