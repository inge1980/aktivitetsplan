import React from 'react';
import PT from 'prop-types';
import { moment } from '../../../utils';
import FieldGroup from '../fieldgroups-valideringv2';

function isValidDate(dato) {
    return dato && moment(dato).isValid();
}

export function validerPeriode(fradato, tildato) {
    if (isValidDate(fradato) && isValidDate(tildato)) {
        const momentTilDato = moment(tildato).startOf('day');
        const momentFraDato = moment(fradato).startOf('day');
        return momentTilDato.isSameOrAfter(momentFraDato);
    }
    return true;
}

export function periodeFeltFeil(fraDato, tilDato) {
    const isValidPeriode = !validerPeriode(
        fraDato.input.value,
        tilDato.input.value
    );
    return isValidPeriode ? 'Fra dato kan ikke være etter til dato' : null;
}

export function periodeErrors(fraDato, tilDato) {
    const periodeFeil = periodeFeltFeil(fraDato, tilDato);
    return periodeFeil ? { periodeValidering: periodeFeil } : {};
}

function PeriodeValidering(props) {
    const { fraDato, tilDato, children } = props;

    const periodeTouched = fraDato.touched && tilDato.touched;
    const periodeFeil = periodeFeltFeil(fraDato, tilDato);

    const feil =
        periodeTouched && periodeFeil ? { feilmelding: periodeFeil } : null;

    return (
        <FieldGroup name="periodeValidering" feil={feil}>
            {children}
        </FieldGroup>
    );
}

PeriodeValidering.propTypes = {
    fraDato: PT.object, // eslint-disable-line react/forbid-prop-types
    tilDato: PT.object, // eslint-disable-line react/forbid-prop-types
    children: PT.node,
};

PeriodeValidering.defaultProps = {
    fraDato: undefined,
    tilDato: undefined,
    children: undefined,
};

export default PeriodeValidering;
