import * as Api from './api';
import { doThenDispatch, STATUS } from './utils';

// Actions
export const HENTER = 'arenaAktivitet/hent';
export const HENTET = 'arenaAktivitet/hent/ok';
export const HENTING_FEILET = 'arenaAktivitet/hent/fail';

const initalState = {
    data: [],
    status: STATUS.NOT_STARTED
};

// Reducer
export default function reducer(state = initalState, action) {
    switch (action.type) {
        case HENTET:
            return { ...state, status: STATUS.OK, data: action.data };
        case HENTING_FEILET:
            return { ...state, status: STATUS.ERROR };
        default:
            return state;
    }
}

// Action creator
export function hentArenaAktiviteter() {
    return doThenDispatch(() => Api.hentArenaAktiviteter(), {
        OK: HENTET,
        FEILET: HENTING_FEILET,
        PENDING: HENTER
    });
}
