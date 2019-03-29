import React from 'react';
import { connect } from 'react-redux';
import { isDirty } from 'redux-form';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Systemtittel } from 'nav-frontend-typografi';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import ModalFooter from '../../../felles-komponenter/modal/modal-footer';
import BegrunnelseForm from '../begrunnelse-form';
import {
    settManuellOppfolging,
    lagreBegrunnelse,
} from '../innstillinger-reducer';
import InnstillingerModal from '../innstillinger-modal';
import { STATUS } from '../../../ducks/utils';
import { selectIdentitetId } from '../../identitet/identitet-selector';
import { selectInnstillingerStatus } from '../innstillinger-selector';
import { hentOppfolging } from '../../oppfolging-status/oppfolging-reducer';
import * as AppPT from '../../../proptypes';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';

const SETT_MANUELL_FORM_NAME = 'sett-manuell-form';

function SettManuellOppfolging({
    veilederId,
    innstillingerStatus,
    handleSubmit,
    history,
    intl,
    formIsDirty,
    lukkModal,
}) {
    const oppfolgingStatus =
        innstillingerStatus === STATUS.PENDING ||
        innstillingerStatus === STATUS.RELOADING;
    return (
        <InnstillingerModal
            onRequestClose={() => {
                const dialogTekst = intl.formatMessage({
                    id: 'aktkivitet-skjema.lukk-advarsel',
                });
                // eslint-disable-next-line no-alert
                if (!formIsDirty || window.confirm(dialogTekst)) {
                    history.push('/');
                    lukkModal();
                }
            }}
            visConfirmDialog={formIsDirty}
        >
            <section className="innstillinger__prosess">
                <div className="blokk-xxs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.manuell.infotekst" />
                </AlertStripeInfoSolid>
                <BegrunnelseForm
                    labelId="innstillinger.modal.manuell.begrunnelse"
                    pakrevdFeilmelding="sett-manuell.begrunnelse.for-kort"
                    formNavn={SETT_MANUELL_FORM_NAME}
                    onSubmit={form => handleSubmit(form, veilederId)}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    spinner={oppfolgingStatus}
                    disabled={oppfolgingStatus}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

SettManuellOppfolging.defaultProps = {
    veilederId: undefined,
};

SettManuellOppfolging.propTypes = {
    veilederId: PT.string,
    handleSubmit: PT.func.isRequired,
    innstillingerStatus: AppPT.status.isRequired,
    history: AppPT.history.isRequired,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = state => ({
    veilederId: selectIdentitetId(state),
    innstillingerStatus: selectInnstillingerStatus(state),
    formIsDirty: isDirty(SETT_MANUELL_FORM_NAME)(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lukkModal: () => dispatch({ type: LUKK_MODAL }),
    handleSubmit: (form, veilederId) => {
        dispatch(lagreBegrunnelse(form.begrunnelse));
        dispatch(settManuellOppfolging(form.begrunnelse, veilederId))
            .then(() => props.history.push('/innstillinger/manuell/kvittering'))
            .then(() => dispatch(hentOppfolging()))
            .catch(() => props.history.push('/innstillinger/feilkvittering'));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(SettManuellOppfolging)
);
