import React from 'react';
import PT from 'prop-types';
import AktivitetEtikett from './aktivitet-etikett';
import { AVTALT_MED_NAV } from '../../constant';
import * as AppPT from '../../proptypes';
import { div as HiddenIfDiv } from '../hidden-if/hidden-if';

// TODO refactor this
function AktivitetEtikettGruppe({ aktivitet, className }) {
    const { avtalt } = aktivitet;
    return (
        <HiddenIfDiv hidden={!avtalt} className={className}>
            <AktivitetEtikett
                hidden={!avtalt}
                etikett={AVTALT_MED_NAV}
                id={AVTALT_MED_NAV}
            />
        </HiddenIfDiv>
    );
}

AktivitetEtikettGruppe.propTypes = {
    aktivitet: PT.object.isRequired,
    avtalt: PT.bool,
    etikett: AppPT.etikett,
    className: PT.string,
};

AktivitetEtikettGruppe.defaultProps = {
    etikett: null,
    avtalt: false,
    className: '',
};

export default AktivitetEtikettGruppe;
