/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import PT from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import * as konstanter from '../../../../constant';
import Radio from '../../../../felles-komponenter/skjema/input/radio';
import * as AppPT from '../../../../proptypes';
import { DirtyContext } from '../../../context/dirty-context';

const validator = useFormstate({
    etikettstatus: () => {},
});

function StillingEtikettForm(props) {
    const { aktivitet, disabled, onSubmit } = props;

    const state = validator({
        etikettstatus: aktivitet.etikett || konstanter.INGEN_VALGT,
    });

    const dirty = useContext(DirtyContext);
    useEffect(
        () => {
            dirty.setFormIsDirty('etikett', !state.pristine);
            return () => {
                dirty.setFormIsDirty('etikett', false);
            };
        },
        [dirty.setFormIsDirty, state.pristine]
    );

    const disable = state.submitting || disabled;

    return (
        <form onSubmit={state.onSubmit(onSubmit)}>
            <Radio
                label="Ikke startet"
                value={konstanter.INGEN_VALGT}
                disabled={disable}
                {...state.fields.etikettstatus}
            />
            <Radio
                label="Sendt søknad"
                value={konstanter.SOKNAD_SENDT}
                disabled={disable}
                {...state.fields.etikettstatus}
            />
            <Radio
                label="Skal på intervju"
                value={konstanter.INNKALT_TIL_INTERVJU}
                disabled={disable}
                {...state.fields.etikettstatus}
            />
            <Radio
                label="Fått jobbtilbud"
                value={konstanter.JOBBTILBUD}
                disabled={disable}
                {...state.fields.etikettstatus}
            />
            <Radio
                label="Fått avslag"
                value={konstanter.AVSLAG}
                disabled={disable}
                {...state.fields.etikettstatus}
            />
            <Hovedknapp
                className="oppdater-status"
                disabled={disable}
                spinner={state.submitting}
                autoDisableVedSpinner
            >
                Lagre
            </Hovedknapp>
        </form>
    );
}

StillingEtikettForm.defaultProps = {
    disabled: true,
};

StillingEtikettForm.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    onSubmit: PT.func.isRequired,
    disabled: PT.bool,
};

export default StillingEtikettForm;
