import * as Api from './lest-api';
import { createActionsAndReducer } from '../../ducks/rest-reducer';

const { reducer, action, selectData, selectStatus } = createActionsAndReducer(
    'lest',
    'lest',
    []
);

export function hentLest() {
    return action(Api.hentSisteLest);
}

export function selectLest(state) {
    return selectData(state);
}

function selectLestRessurs(state, ressurs) {
    return selectLest(state).filter(e => e.ressurs === ressurs)[0];
}

export function selectLestInformasjon(state) {
    return selectLestRessurs(state, 'informasjon');
}

export function selectLestAktivitetsplan(state) {
    return selectLestRessurs(state, 'aktivitetsplan');
}

export function selectLestStatus(state) {
    return selectStatus(state);
}

export default reducer;