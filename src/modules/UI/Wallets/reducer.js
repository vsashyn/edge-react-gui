// @flow

import {combineReducers} from 'redux'
import type {AbcCurrencyWallet} from 'airbitz-core-types'
import * as ACTION from './action'
import {UPDATE_WALLETS} from '../../Core/Wallets/action.js'
type ByIdState = {[string]: AbcCurrencyWallet}

export const activeWalletIds = (state: Array<string> = [], {type,  data: {activeWalletIds} }: any) => type === UPDATE_WALLETS ? activeWalletIds : state
export const archivedWalletIds = (state: Array<string> = [], {type, data: {archivedWalletIds} }: any) => type === UPDATE_WALLETS ? archivedWalletIds : state
export const selectedWalletId = (state: string = '', {type, data: {walletId} }: any) => type === ACTION.SELECT_WALLET_ID ? walletId : state
export const selectedCurrencyCode = (state: string = '', {type, data: {currencyCode} }: any) => type === ACTION.SELECT_CURRENCY_CODE ? currencyCode : state
export const byId = (state: ByIdState, action: any) =>
  action.type === ACTION.UPSERT_WALLET
  ? {...state, [wallet.id]: wallet(state[wallet.id], action)}
  : state

const id = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.id
  : state

const type = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.type
  : state

const name = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.name
  : state

const primaryNativeBalance = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.getBalance(wallet.currencyCode)
  : state

const currencyNames = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? [wallet.currencyInfo.currencyName, ...wallet.metaTokens.map((metaToken) => metaToken.currencyName)]
  : state

const currencyCode = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.currencyCode
  : state

const isoFiatCurrencyCode = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.fiatCurrencyCode
  : state

const fiatCurrencyCode = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.fiatCurrencyCode.replace('iso:', '')
  : state

const denominations = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.currencyInfo.denominations
  : state

const symbolImage = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.currencyInfo.symbolImage
  : state

const symbolImageDarkMono = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.currencyInfo.symbolImageDarkMono
  : state

const metaTokens = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? wallet.currencyInfo.metaTokens
  : state

const allDenominations = (state, {type, data: {currencyWallet: wallet} }) =>
  type === ACTION.UPSERT_WALLET
  ? {
    [wallet.currencyCode]: wallet.denominations.reduce((denominations, denomination) => ({
      ...denominations,
      [denomination.multiplier]: denomination
    }), {}),

    ...wallet.metaTokens.reduce((tokenDenominations, metaToken) => ({
      ...tokenDenominations,

      [metaToken.currencyCode]: {
        ...metaToken.denominations.reduce((denominations, denomination) => ({
          ...denominations,

          [denomination.multiplier]: denomination
        }), {})
      }

    }), {})
  }
  : state

const nativeBalances = (state, {type, data: {currencyWallet: wallet} }) => {
  switch (type) {
  case ACTION.UPSERT_WALLET: {
    const currencyCode = wallet.currencyCode
    const metaTokens = wallet.metaTokens

    return {
      [currencyCode]: wallet.getBalance({currencyCode}),
      ...metaTokens.reduce((tokenBalances, metaToken) => {
        const currencyCode = metaToken.currencyCode
        const balance: string = wallet.getBalance({currencyCode})

        return {
          ...tokenBalances,
          [currencyCode]: balance
        }
      }, {})
    }
  }
  default:
    return state
  }
}

const wallet = combineReducers({
  id,
  type,
  name,
  primaryNativeBalance,
  nativeBalances,
  currencyNames,
  currencyCode,
  isoFiatCurrencyCode,
  fiatCurrencyCode,
  denominations,
  allDenominations,
  symbolImage,
  symbolImageDarkMono,
  metaTokens
})

export const wallets = combineReducers({
  byId,
  activeWalletIds,
  archivedWalletIds,
  selectedWalletId,
  selectedCurrencyCode
})
