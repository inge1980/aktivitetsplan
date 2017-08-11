import React from 'react';
import PT from 'prop-types';
import AlertStripeInfoSolid from 'nav-frontend-alertstriper/src/info-solid-alertstripe';
import { FormattedMessage } from 'react-intl';
import { manglerPubliseringAvSamtaleReferat } from '../aktivitet-util';
import OppdaterReferatContainer from '../visning/status-oppdatering/oppdater-referat-container';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import * as AppPT from '../../../proptypes';

function PubliserReferat({ aktivitet, children }) {
    if (manglerPubliseringAvSamtaleReferat(aktivitet)) {
        return (
            <ModalHeader>
                <ModalContainer className="publiser-referat">
                    <AlertStripeInfoSolid className="publiser-referat__info">
                        <FormattedMessage id="aktivitetstatus.mangler-publisering-av-samtalereferat" />
                    </AlertStripeInfoSolid>
                    <OppdaterReferatContainer aktivitet={aktivitet} />
                </ModalContainer>
            </ModalHeader>
        );
    }
    return children;
}

PubliserReferat.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    children: PT.node.isRequired,
};

export default PubliserReferat;