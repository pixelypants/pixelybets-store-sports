import { Observable, of } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';
import { ReduxDevToolsExtension } from '@codewithdan/observable-store-extensions';

export interface StoreState {
  sports: {
    matches: any[];
  };
}

ObservableStore.globalSettings = {
  trackStateHistory: true
};
ObservableStore.addExtension(new ReduxDevToolsExtension({ reactRouterHistory: history }))


class SportsStore extends ObservableStore<StoreState> {
  constructor() {
    const initialState = {
      sports: {
        matches: [],
      },
    };
    super({ trackStateHistory: true, logStateChanges: true });
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
