import React, { createContext, useContext, useState, useReducer } from "react";
import { FetchedTiger } from "../hooks/useFetchTiger";
import { FetchedOffer } from "../hooks/useTigerOffer";

const StoreContext = createContext<Store | null>(null);

type TigersReducerActions = {
  type: "addTiger";
  payload: FetchedTiger;
};
type TigersMap = { [key: number]: FetchedTiger };
const tigersReducer: React.Reducer<TigersMap, TigersReducerActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "addTiger":
      return { ...state, [action.payload.id]: action.payload };
    default:
      throw new Error();
  }
};

type AddOfferAction = {
  type: "addOffer";
  payload: FetchedOffer;
};
type RemoveOfferAction = {
  type: "removeOffer";
  payload: number;
};
type OffersReducerActions = AddOfferAction | RemoveOfferAction;
type OffersMap = { [key: number]: FetchedOffer };
const offersReducer: React.Reducer<OffersMap, OffersReducerActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "addOffer": {
      const newState = { ...state };
      // Remove any old entries with the same id
      delete newState[action.payload.id];
      // Then add new entry
      newState[action.payload.id] = action.payload;
      return newState;
    }
    case "removeOffer": {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      throw new Error();
  }
};

export interface Store {
  account: null | string;
  isOwner: boolean;
  tigers: TigersMap;
  offers: OffersMap;

  setAccount: (account: null | string) => void;
  setIsOwner: (isOwner: boolean) => void;
  addTiger: (tiger: FetchedTiger) => void;
  addOffer: (offer: FetchedOffer) => void;
  removeOffer: (tigerId: number) => void;
}

export const StoreProvider: React.FC = ({ children }) => {
  const [account, setAccount] = useState<Store["account"]>(null);
  const [tigers, dispatchTigers] = useReducer(tigersReducer, {});
  const [offers, dispatchOffers] = useReducer(offersReducer, {});
  const [isOwner, setIsOwner] = useState<Store["isOwner"]>(false);

  const addTiger = (tiger: FetchedTiger) =>
    dispatchTigers({ type: "addTiger", payload: tiger });
  const addOffer = (offer: FetchedOffer) =>
    dispatchOffers({ type: "addOffer", payload: offer });
  const removeOffer = (tigerId: number) =>
    dispatchOffers({ type: "removeOffer", payload: tigerId });

  const store: Store = {
    isOwner,
    setIsOwner,
    account,
    setAccount,
    tigers,
    addTiger,
    offers,
    addOffer,
    removeOffer,
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("store is not defined");
  }

  return store;
};
