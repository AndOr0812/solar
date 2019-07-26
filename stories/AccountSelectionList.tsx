import React from "react"
import { storiesOf } from "@storybook/react"
import AccountSelectionList from "../src/components/Account/AccountSelectionList"

const accounts = [
  {
    id: "testid1",
    name: "My Testnet Account #1",
    publicKey: "GBPBFWVBADSESGADWEGC7SGTHE3535FWK4BS6UW3WMHX26PHGIH5NF4W",
    requiresPassword: false,
    testnet: true,
    getPrivateKey: (password: string) => Promise.resolve(password)
  },
  {
    id: "testid2",
    name: "My Testnet Account #2",
    publicKey: "GDNVDG37WMKPEIXSJRBAQAVPO5WGOPKZRZZBPLWXULSX6NQNLNQP6CFF",
    requiresPassword: false,
    testnet: true,
    getPrivateKey: (password: string) => Promise.resolve(password)
  }
]

storiesOf("AccountSelection", module)
  .add("AccountSelectionList", () => (
    <AccountSelectionList accounts={accounts} showAccounts="all" testnet={accounts[0].testnet} />
  ))
  .add("AccountSelectionList disabled", () => (
    <AccountSelectionList accounts={accounts} disabled={true} showAccounts="all" testnet={accounts[0].testnet} />
  ))
