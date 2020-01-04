import { Observable, of } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';
import { ReduxDevToolsExtension } from '@codewithdan/observable-store-extensions';

export interface Proposition {
  id: string;
  name: string;
  returnWin: number;
  returnPlace: number;
  bettingStatus: string;
  allowPlace: boolean;
  number: number;
  isOpen: boolean;
  sortOrder: number;
  position: string;
}

export interface Matche {
  id: string;
  name: string;
  shortName: string;
  betOption: string;
  betOptionSpectrumId: string;
  betOptionPriority: number;
  marketUniqueId: number;
  closeTime: Date;
  bettingStatus: string;
  message?: any;
  informationMessage?: any;
  isFuture: boolean;
  onlineBetting: boolean;
  phoneBettingOnly: boolean;
  inPlay: boolean;
  goingInPlay: boolean;
  allowWin: boolean;
  allowPlace: boolean;
  allowEachWay: boolean;
  allowMulti: boolean;
  allowMultiWin: boolean;
  allowMultiPlace: boolean;
  allowMultiEachWay: boolean;
  numberOfPlaces: number;
  cashOutEligibility: string;
  allowBundle: boolean;
  propositions: Proposition[];
}

export interface StoreState {
  sports: {
    matches: Matche[];
  };
}

ObservableStore.addExtension(new ReduxDevToolsExtension({ reactRouterHistory: history }))

class SportsStore extends ObservableStore<StoreState> {
  constructor() {
    super({ trackStateHistory: true, logStateChanges: true });
    const initialState = {
      sports: {
        matches: [],
      },
    };
    this.setState(initialState, sportsStoreActions.InitSportsState);
  }

  fetchSports() {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    const url =
      'https://api.beta.tab.com.au/v1/tab-info-service/sports/Basketball/competitions/NBA/markets?jurisdiction=NSW';
    return fetch(proxyurl + url)
      .then(response => response.json())
      .then(sports => {
        this.setState({ sports }, sportsStoreActions.GetSports);
        return;
      });
  }

  getSports() {
    const state = this.getState();
    if (state && state.sports) {
      return of(state.sports);
    } else {
      return this.fetchSports().then(sports => {
        return of(this.getState().sports);
      });
    }
  }
}

export const sportsStoreActions = {
  GetSports: 'GET_SPORTS',
  InitSportsState: 'INIT_STATE',
};

export default new SportsStore();
