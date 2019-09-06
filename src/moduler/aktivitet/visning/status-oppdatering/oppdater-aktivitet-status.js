import React, { useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as AppPT from '../../../../proptypes';
import AktivitetStatusForm from './aktivitet-status-form';
import { selectKanEndreAktivitetStatus } from '../../aktivitetliste-selector';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { flyttetAktivitetMetrikk } from '../../../../felles-komponenter/utils/logging';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import EndreLinje from '../endre-linje/endre-linje';
import StatusVisning from './status-visning';
import Underseksjon from '../underseksjon/underseksjon';

function OppdaterAktivitetStatus(props) {
    const { aktivitet, disableStatusEndring, lagreStatusEndringer } = props;

    const [endring, setEndring] = useState(false);

    const onSubmit = val =>
        lagreStatusEndringer(val).then(() => {
            setEndring(false);
            document.querySelector('.aktivitet-modal').focus();
        });

    const visning = <StatusVisning status={aktivitet.status} />;
    const form = (
        <AktivitetStatusForm
            disabled={disableStatusEndring}
            onSubmit={onSubmit}
            aktivitet={aktivitet}
        />
    );

    return (
        <Underseksjon>
            <EndreLinje
                tittel="Hva er status på aktiviteten?"
                endring={endring}
                setEndring={setEndring}
                visning={visning}
                form={form}
            />
        </Underseksjon>
    );
}

OppdaterAktivitetStatus.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    disableStatusEndring: PT.bool.isRequired,
    lagreStatusEndringer: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    return {
        disableStatusEndring:
            !selectKanEndreAktivitetStatus(state, props.aktivitet) ||
            !selectErUnderOppfolging(state),
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    lagreStatusEndringer: values => {
        flyttetAktivitetMetrikk(
            'submit',
            props.aktivitet,
            values.aktivitetstatus
        );
        return dispatch(
            flyttAktivitetMedBegrunnelse(
                props.aktivitet,
                values.aktivitetstatus,
                values.begrunnelse
            )
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterAktivitetStatus
);
