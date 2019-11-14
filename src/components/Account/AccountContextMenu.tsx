import React from "react"
import Divider from "@material-ui/core/Divider"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import MenuItem from "@material-ui/core/MenuItem"
import CallMadeIcon from "@material-ui/icons/CallMade"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import SettingsIcon from "@material-ui/icons/Settings"
import SwapHorizIcon from "@material-ui/icons/SwapHoriz"
import { Account } from "../../context/accounts"
import { SettingsContextType } from "../../context/settings"
import { useIsMobile } from "../../hooks/userinterface"
import ContextMenu, { AnchorRenderProps } from "../ContextMenu"
import Slide from "@material-ui/core/Slide"
import ClickAwayListener from "@material-ui/core/ClickAwayListener"
import Popper from "@material-ui/core/Popper"
import MenuList from "@material-ui/core/MenuList"
import Paper from "@material-ui/core/Paper"
import makeStyles from "@material-ui/core/styles/makeStyles"

interface ItemProps {
  disabled?: boolean
  hidden?: boolean
  icon: React.ReactElement<any>
  label: string
  onClick: () => void
}

const AccountContextMenuItem = React.forwardRef((props: ItemProps, ref) => {
  if (props.hidden) {
    return null
  }
  return (
    <MenuItem disabled={props.disabled} onClick={props.onClick}>
      <ListItemIcon style={{ flex: "0 0 24px", marginRight: 24, minWidth: 24 }}>{props.icon}</ListItemIcon>
      <ListItemText ref={ref}>{props.label}</ListItemText>
    </MenuItem>
  )
})

const MenuListProps = {
  style: {
    padding: 0
  }
}

interface MenuProps {
  account: Account
  activated: boolean
  children: (anchorProps: AnchorRenderProps) => React.ReactNode
  onAccountSettings: () => void
  onManageAssets: () => void
  onTrade: () => void
  onWithdraw: () => void
  settings: SettingsContextType
}

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    position: "fixed",
    left: 0,
    bottom: 0,
    visibility: "visible"
  }
}))

function AccountContextMenu(props: MenuProps) {
  const isSmallScreen = useIsMobile()
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ContextMenu
        anchor={props.children}
        menu={({ anchorEl, open, onClose, closeAndCall }) => (
          <Popper placement="bottom" open={open} anchorEl={anchorEl || undefined} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Slide
                {...TransitionProps}
                direction="up"
                style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
              >
                <Paper className={classes.paper}>
                  <ClickAwayListener onClickAway={onClose}>
                    <MenuList autoFocusItem={open} id="menu-list-grow">
                      <AccountContextMenuItem
                        disabled={!props.activated}
                        icon={<SwapHorizIcon style={{ transform: "scale(1.2)" }} />}
                        label="Trade"
                        onClick={closeAndCall(props.onTrade)}
                      />
                      <AccountContextMenuItem
                        disabled={!props.activated}
                        icon={<CallMadeIcon />}
                        label="Withdraw"
                        onClick={closeAndCall(props.onWithdraw)}
                      />
                      <Divider />
                      <AccountContextMenuItem
                        disabled={!props.activated}
                        icon={<MoneyIcon />}
                        label="Assets & Balances"
                        onClick={closeAndCall(props.onManageAssets)}
                      />
                      <AccountContextMenuItem
                        icon={<SettingsIcon />}
                        label="Account Settings"
                        onClick={closeAndCall(props.onAccountSettings)}
                      />
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Slide>
            )}
          </Popper>
        )}
      />
    </div>
  )
}

export default React.memo(AccountContextMenu)
