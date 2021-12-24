import { Store } from "./store/Store";
import { CataloguePage } from "./pages/CataloguePage";
import { Home } from "./pages/Home";
import { MarketPlace } from "./pages/MarketPlace";
import { MyTigers } from "./pages/MyTigers";
import { Factory } from "./pages/Factory";
import { TigerDetail } from "./pages/TigerDetail";
import { OtherTigers } from "./pages/OtherTigers";
import { Error404 } from "./pages/Error404";

export interface Route {
  navigationLabel?: string;
  to: string;
  isAllowed: boolean;
  component: React.ComponentType;
}

export const routes = (store: Store): Route[] => [
  {
    to: "/",
    isAllowed: true,
    component: Home,
  },
  {
    navigationLabel: "Catalogue",
    to: "/catalogue",
    isAllowed: true,
    component: CataloguePage,
  },
  {
    navigationLabel: "For sale",
    to: "/market",
    isAllowed: true,
    component: MarketPlace,
  },
  {
    navigationLabel: "My tigers",
    to: "/my-tigers",
    isAllowed: !!store.account,
    component: MyTigers,
  },
  {
    navigationLabel: "Factory",
    to: "/factory",
    isAllowed: !!store.isOwner,
    component: Factory,
  },
  {
    to: "/tiger/:id",
    isAllowed: true,
    component: TigerDetail,
  },
  {
    to: "/profile/:address",
    isAllowed: true,
    component: OtherTigers,
  },
  {
    to: "*",
    isAllowed: true,
    component: Error404,
  },
];
