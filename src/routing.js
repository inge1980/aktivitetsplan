import 'babel-polyfill';
import React from 'react';
import PT from 'prop-types';
import { FNR_I_URL } from '~config'; //eslint-disable-line
import { Route, Switch, withRouter } from 'react-router-dom';
import DialogModal from './moduler/dialog/dialog-modal/dialog-modal';
import AktivitetmalEndre from './moduler/mal/aktivitetsmal-endre';
import Aktivitetsmal from './moduler/mal/aktivitetsmal';
import AktivitetRoutes from './moduler/aktivitet/aktivitet-routes';
import ArbeidslisteContainer from './moduler/arbeidsliste/arbeidsliste-container';
import AktivitetsplanPrint from './moduler/utskrift/aktivitetsplanprint';
import InnstillingerRoutes from './moduler/innstillinger/innstillinger-routes';
import InformasjonModal from './moduler/informasjon/informasjon-modal';

export const aktivitetRoute = aktivitetId => `/aktivitet/vis/${aktivitetId}`;
export const endreAktivitetRoute = aktivitetId =>
    `/aktivitet/endre/${aktivitetId}`;
export const fullforAktivitetRoute = aktivitetId =>
    `/aktivitet/fullfor/${aktivitetId}`;
export const avbrytAktivitetRoute = aktivitetId =>
    `/aktivitet/avbryt/${aktivitetId}`;

function getPathWithBase(path) {
    if (FNR_I_URL) {
        return `/:fnr${path}`;
    }
    return path;
}

const Routing = ({ location }) =>
    <Switch location={location}>
        <Route exact path={getPathWithBase('/mal')} component={Aktivitetsmal} />
        <Route
            path={getPathWithBase('/mal/endre')}
            component={AktivitetmalEndre}
        />
        <Route
            exact
            path={getPathWithBase('/dialog')}
            component={DialogModal}
        />
        <Route
            exact
            path={getPathWithBase('/dialog/:id')}
            component={DialogModal}
        />
        <Route
            path={getPathWithBase('/aktivitet')}
            component={AktivitetRoutes}
        />
        <Route
            path={getPathWithBase('/arbeidsliste')}
            component={ArbeidslisteContainer}
        />
        <Route
            path={getPathWithBase('/utskrift')}
            component={AktivitetsplanPrint}
        />
    </Switch>;

Routing.propTypes = {
    location: PT.object.isRequired,
};

function Public({ location }) {
    // TODO : Remove innstillinger. This is a hack
    return (
        <Switch location={location}>
            <Route
                path={getPathWithBase('/innstillinger')}
                component={InnstillingerRoutes}
            />

            <Route
                path={getPathWithBase('/informasjon')}
                component={InformasjonModal}
            />
        </Switch>
    );
}

Public.propTypes = {
    location: PT.object.isRequired,
};

export const PublicRouting = withRouter(Public);

export default withRouter(Routing);
