import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { Sidetittel } from 'nav-frontend-typografi';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import Aktivitetsbeskrivelse from './aktivitetsbeskrivelse';
import EndringsloggForAktivitet from './endringslogg-for-aktivitet';
import AktivitetEtiketter from '../../felles-komponenter/aktivitet-etiketter';
import ModalHeader from '../modal-header';
import history from '../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import NyHenvendelse from '../../dialog/ny-henvendelse';
import Henvendelser from '../../dialog/henvendelser';
import { slettAktivitet } from '../../ducks/aktiviteter';
import { visibleIfHOC } from '../../hocs/visible-if';
import * as AppPT from '../../proptypes';
import ModalFooter from './../modal-footer';
import ModalContainer from '../modal-container';
import {TILLAT_SLETTING} from '~config' // eslint-disable-line
import BekreftSlettVisning from './bekreftslettvisning';
import AvtaltContainer from './avtalt-container';

const VisibleHenvendelser = visibleIfHOC(Henvendelser);

class Aktivitetvisning extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visBekreftSletting: false,
            settAutoFocusSlett: false
        };
    }

    render() {
        const { params, aktiviteter, dialoger, doSlettAktivitet, oppfolgingStatus } = this.props;
        const { id } = params;
        const valgtAktivitet = aktiviteter.data.find((aktivitet) => aktivitet.id === id);
        const dialog = dialoger.find((d) => d.aktivitetId === id);

        if (!valgtAktivitet) {
            return null;
        } else if (this.state.visBekreftSletting) {
            const slettAction = () => {
                doSlettAktivitet(valgtAktivitet);
                history.push('/');
            };

            return (
                <BekreftSlettVisning
                    slettAction={slettAction}
                    avbrytAction={() => this.setState({
                        visBekreftSletting: false,
                        settAutoFocusSlett: true })}
                />
            );
        }

        const valgtAktivitetId = valgtAktivitet.id;
        const tillatSletting = TILLAT_SLETTING && (
                !oppfolgingStatus.underOppfolging ||
                moment(oppfolgingStatus.oppfolgingUtgang).isAfter(valgtAktivitet.opprettetDato)
            );

        return (
            <ModalHeader
                normalTekstId="aktivitetvisning.header"
                normalTekstValues={{ status: valgtAktivitet.status, type: valgtAktivitet.type }}
                className="side-innhold"
                aria-labelledby="modal-aktivitetsvisning-header"
            >
                <ModalContainer>
                    <div className="aktivitetvisning">
                        <Sidetittel id="modal-aktivitetsvisning-header">
                            {valgtAktivitet.tittel}
                        </Sidetittel>
                        <AktivitetEtiketter etiketter={valgtAktivitet.tagger} className="aktivitetvisning__etikett" />
                        <AktivitetsDetaljer
                            className="aktivitetvisning__detaljer"
                            valgtAktivitet={valgtAktivitet}
                        />
                        <Aktivitetsbeskrivelse beskrivelse={valgtAktivitet.beskrivelse} />
                    </div>
                    <AvtaltContainer aktivitet={valgtAktivitet} />
                    <EndringsloggForAktivitet aktivitet={valgtAktivitet} className="aktivitetvisning__historikk" />
                    <NyHenvendelse formNavn={`ny-henvendelse-aktivitet-${valgtAktivitetId}`} dialogId={dialog && dialog.id} aktivitetId={valgtAktivitetId} />
                    <VisibleHenvendelser visible={!!dialog} dialog={dialog} />
                </ModalContainer>

                <ModalFooter>
                    {/* TODO: tekster*/}
                    {tillatSletting &&
                    <Knapp
                        onClick={() => this.setState({ visBekreftSletting: true, settAutoFocusSlett: false })}
                        className="knapp-liten modal-footer__knapp" autoFocus={this.state.settAutoFocusSlett}
                    >
                        Slett
                    </Knapp>}
                </ModalFooter>
            </ModalHeader>
        );
    }
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    oppfolgingStatus: AppPT.oppfolgingStatus,
    aktiviteter: PT.shape({
        data: PT.arrayOf(AppPT.aktivitet)
    }),
    dialoger: PT.arrayOf(AppPT.dialog)
};

const mapStateToProps = (state) => ({
    aktiviteter: state.data.aktiviteter,
    oppfolgingStatus: state.data.oppfolgingStatus.data,
    dialoger: state.data.dialog.data
});

const mapDispatchToProps = (dispatch) => ({
    doSlettAktivitet: (aktivitet) => slettAktivitet(aktivitet)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
