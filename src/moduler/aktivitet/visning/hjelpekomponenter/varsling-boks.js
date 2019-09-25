import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import { div as HiddenIfDiv } from '../../../../felles-komponenter/hidden-if/hidden-if';
import { selectDialogForAktivitetId, selectDialogStatus } from '../../../dialog/dialog-selector';
import * as AppPT from '../../../../proptypes';
import Innholdslaster from '../../../../felles-komponenter/utils/innholdslaster';
import { MOTE_TYPE } from '../../../../constant';
import { selectErVeileder, selectIdentitetStatus } from '../../../identitet/identitet-selector';

function VarslingBoks({ avhengigheter, visVarselOmManglendeDialog, className }) {
    return (
        <HiddenIfDiv hidden={!visVarselOmManglendeDialog}>
            <Innholdslaster avhengigheter={avhengigheter}>
                <HiddenIfDiv className={className} hidden={!visVarselOmManglendeDialog}>
                    <AlertStripe type="advarsel">
                        Brukeren får ikke automatisk informasjon om møtet. Send en dialog eller forhåndsorientering for
                        at brukeren skal få beskjed.
                    </AlertStripe>
                </HiddenIfDiv>
            </Innholdslaster>
        </HiddenIfDiv>
    );
}

VarslingBoks.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    visVarselOmManglendeDialog: PT.bool.isRequired,
    className: PT.string.isRequired
};

const mapStateToProps = (state, props) => {
    const { aktivitet } = props;
    return {
        avhengigheter: [selectIdentitetStatus(state), selectDialogStatus(state)],
        visVarselOmManglendeDialog:
            aktivitet.type === MOTE_TYPE && selectErVeileder(state) && !selectDialogForAktivitetId(state, aktivitet.id)
    };
};

export default connect(mapStateToProps)(VarslingBoks);
