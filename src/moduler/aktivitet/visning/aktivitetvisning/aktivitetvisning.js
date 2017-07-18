import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import UnderelementerForAktivitet from '../underelement-for-aktivitet/underelementer-for-aktivitet';
import ModalHeader from '../../../../felles-komponenter/modal/modal-header';
import history from '../../../../history';
import {
    slettAktivitet,
    hentAktivitet,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../../../../ducks/aktiviteter';
import * as AppPT from '../../../../proptypes';
import ModalFooter from '../../../../felles-komponenter/modal/modal-footer';
import ModalContainer from '../../../../felles-komponenter/modal/modal-container';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import BekreftSlettVisning from '../bekreft-slett-visning/bekreft-slett-visning';
import AvtaltContainer from '../avtalt-container/avtalt-container';
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../../constant';
import BegrunnelseBoks from '../begrunnelse-boks';
import StandardModal from '../../../../felles-komponenter/modal/modal-standard';
import AktivitetinformasjonVisning from './aktivitetinformasjon-visning';
import Statusadministrasjon from './statusadministrasjon';

class Aktivitetvisning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visBekreftSletting: false,
            settAutoFocusSlett: false,
        };
    }

    componentDidMount() {
        if (!isNaN(this.props.params.id)) {
            this.props.doHentAktivitet(this.props.params.id);
        }
        this.props.doFjernForrigeAktiveAktivitetId();
    }

    componentWillUnmount() {
        this.props.doSettForrigeAktiveAktivitetId(this.props.params.id);
    }

    render() {
        const { params, aktiviteter, doSlettAktivitet, situasjon } = this.props;
        const { id } = params;
        const valgtAktivitet = aktiviteter.find(
            aktivitet => aktivitet.id === id
        );

        if (!valgtAktivitet) {
            return null;
        } else if (this.state.visBekreftSletting) {
            const slettAction = () => {
                doSlettAktivitet(valgtAktivitet);
                history.push('/');
            };

            return (
                <StandardModal name="aktivitetsvisningModal">
                    <BekreftSlettVisning
                        slettAction={slettAction}
                        avbrytAction={() =>
                            this.setState({
                                visBekreftSletting: false,
                                settAutoFocusSlett: true,
                            })}
                    />
                </StandardModal>
            );
        }

        const tillatSletting =
            TILLAT_SLETTING &&
            (!situasjon.underOppfolging ||
                moment(situasjon.oppfolgingUtgang).isAfter(
                    valgtAktivitet.opprettetDato
                ));

        const arenaAktivitet = [
            TILTAK_AKTIVITET_TYPE,
            GRUPPE_AKTIVITET_TYPE,
            UTDANNING_AKTIVITET_TYPE,
        ].includes(valgtAktivitet.type);

        const visBegrunnelse =
            !arenaAktivitet &&
            valgtAktivitet.avtalt === true &&
            (valgtAktivitet.status === STATUS_FULLFOERT ||
                valgtAktivitet.status === STATUS_AVBRUTT);

        const aktivitetErLaast =
            valgtAktivitet.status === STATUS_FULLFOERT ||
            valgtAktivitet.status === STATUS_AVBRUTT;

        const aktivitetvisningHeader = (
            <ModalHeader
                normalTekstId="aktivitetvisning.header"
                normalTekstValues={{
                    status: valgtAktivitet.status,
                    type: valgtAktivitet.type,
                }}
                className="side-innhold"
                aria-labelledby="modal-aktivitetsvisning-header"
                aktivitetErLaast={aktivitetErLaast}
            />
        );

        const aktivitetvisningFooter = (
            <ModalFooter visible={tillatSletting && !arenaAktivitet}>
                <Knapp
                    onClick={() =>
                        this.setState({
                            visBekreftSletting: true,
                            settAutoFocusSlett: false,
                        })}
                    className="knapp-liten modal-footer__knapp"
                    autoFocus={this.state.settAutoFocusSlett}
                >
                    <FormattedMessage id="aktivitetvisning.slett-knapp" />
                </Knapp>
            </ModalFooter>
        );

        return (
            <StandardModal name="aktivitetsvisningModal">
                {aktivitetvisningHeader}

                <ModalContainer className="aktivitetvisning">
                    <BegrunnelseBoks
                        className="aktivitetvisning__underseksjon"
                        begrunnelse={valgtAktivitet.avsluttetKommentar}
                        visible={visBegrunnelse}
                    />

                    <AktivitetinformasjonVisning
                        valgtAktivitet={valgtAktivitet}
                        arenaAktivitet={arenaAktivitet}
                    />

                    <AvtaltContainer
                        aktivitet={valgtAktivitet}
                        className="aktivitetvisning__underseksjon"
                    />

                    <Statusadministrasjon
                        valgtAktivitet={valgtAktivitet}
                        arenaAktivitet={arenaAktivitet}
                        paramsId={id}
                    />

                    <UnderelementerForAktivitet
                        aktivitet={valgtAktivitet}
                        className="aktivitetvisning__underseksjon"
                    />
                </ModalContainer>

                {aktivitetvisningFooter}
            </StandardModal>
        );
    }
}
Aktivitetvisning.propTypes = {
    doSlettAktivitet: PT.func.isRequired,
    doHentAktivitet: PT.func.isRequired,
    params: PT.shape({ id: PT.string }),
    situasjon: AppPT.situasjon.isRequired,
    aktiviteter: PT.arrayOf(PT.object),
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
};

Aktivitetvisning.defaultProps = {
    params: undefined,
    situasjon: undefined,
    aktiviteter: undefined,
};

const mapStateToProps = state => {
    const aktivitetListe = state.data.aktiviteter.data || [];
    return {
        situasjon: state.data.situasjon.data,
        aktiviteter: aktivitetListe.concat(state.data.arenaAktiviteter.data),
    };
};

const mapDispatchToProps = dispatch => ({
    doSlettAktivitet: aktivitet => dispatch(slettAktivitet(aktivitet)),
    doHentAktivitet: aktivitetId => dispatch(hentAktivitet(aktivitetId)),
    doSettForrigeAktiveAktivitetId: id =>
        dispatch(settForrigeAktiveAktivitetId(id)),
    doFjernForrigeAktiveAktivitetId: () =>
        dispatch(fjernForrigeAktiveAktivitetId()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Aktivitetvisning);
