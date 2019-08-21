import React from "react"
import { Keypair } from "stellar-sdk"
import { Dialog } from "@material-ui/core"
import Slide from "@material-ui/core/Slide"
import { useRouter, useIsSmallMobile } from "../hooks"
import * as routes from "../routes"
import { Section } from "../components/Layout/Page"
import AccountCreationForm, { AccountCreationValues } from "../components/Form/CreateAccount"
import ExportKeyDialog from "../components/AccountSettings/ExportKeyDialog"
import { AccountsContext, Account } from "../context/accounts"
import { trackError } from "../context/notifications"

const DialogSidewaysTransition = (props: any) => <Slide {...props} direction="left" />

interface Props {
  importedSecretKey?: string
  testnet: boolean
  onClose?: () => void
}

function CreateAccountPage(props: Props) {
  const { accounts, createAccount } = React.useContext(AccountsContext)
  const [createdAccount, setCreatedAccount] = React.useState<Account | null>(null)
  const router = useRouter()
  const isTinyScreen = useIsSmallMobile()

  const onClose = props.onClose || (() => router.history.push(routes.allAccounts()))

  const closeBackupDialog = React.useCallback(
    () => {
      if (createdAccount) {
        router.history.push(routes.account(createdAccount.id))
      }

      onClose()
    },
    [createdAccount]
  )

  const onCreateAccount = async (formValues: AccountCreationValues) => {
    try {
      const account = await createAccount({
        name: formValues.name,
        keypair: Keypair.fromSecret(formValues.privateKey),
        password: formValues.setPassword ? formValues.password : null,
        testnet: props.testnet
      })

      if (!props.testnet && (props.importedSecretKey || formValues.createNewKey)) {
        setCreatedAccount(account)
      } else {
        router.history.push(routes.account(account.id))
        onClose()
      }
    } catch (error) {
      trackError(error)
    }
  }

  return (
    <Section top bottom pageInset={!isTinyScreen}>
      <AccountCreationForm
        accounts={accounts}
        importedSecretKey={props.importedSecretKey}
        onCancel={onClose}
        onSubmit={onCreateAccount}
        testnet={props.testnet}
      />
      <Dialog
        fullScreen
        open={createdAccount !== null}
        onClose={closeBackupDialog}
        TransitionComponent={DialogSidewaysTransition}
      >
        <ExportKeyDialog account={createdAccount!} onConfirm={closeBackupDialog} variant="initial-backup" />
      </Dialog>
    </Section>
  )
}

export default CreateAccountPage
