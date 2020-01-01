import { Observable, of } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';

class SportsStore extends ObservableStore {

  constructor() {
    super({ trackStateHistory: true, logStateChanges: true });
  }

  fetchSports() {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "https://api.beta.tab.com.au/v1/tab-info-service/sports/Basketball/competitions/NBA/markets?jurisdiction=NSW";
    return fetch(proxyurl + url)
      .then(response => response.json())
      .then(sports => {
        this.setState({ sports: sports }, SportsStoreActions.GetSports);
        return;
      });
  }

  getSports() {
    let state = this.getState();
    if (state && state.sports) {
      return of(state.sports);
    }
    else {
      return this.fetchSports()
        .then(sports => {
          return of(this.getState().sports)
        })
    }
  }

  getSport(id) {
    return this.getSports()
      .then(sports => {
        let sport = sports.filter(sport => sport.spectrumUniqueId === id);
        return sport;
      });
  }
}

export const SportsStoreActions = {
  GetSports: 'GET_SPORTS',
  GetSport: 'GET_SPORT',
};

export default new SportsStore();