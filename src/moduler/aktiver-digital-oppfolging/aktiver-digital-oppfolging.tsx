import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { settDigital } from '../oppfolging-status/oppfolging-reducer';
import { STATUS } from '../../ducks/utils';
import { selectOppfolgingStatus, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import AktiverDigitalOppfolgingVarsel from './aktiver-digital-oppfolging-varsel';

function AktiverDigitalOppfolging() {
    const oppfolgingStatus = useSelector(selectOppfolgingStatus);
    const reservertKrr = useSelector(selectReservasjonKRR);
    const dispatch = useDispatch();

    const settOppfolgingFeilet = oppfolgingStatus === STATUS.ERROR;
    const lasterOppfolging = oppfolgingStatus === STATUS.PENDING || oppfolgingStatus === STATUS.RELOADING;

    return (
        <div className="sett-digital">
            <AktiverDigitalOppfolgingVarsel reservertIKRR={reservertKrr} settDigitalFeilet={settOppfolgingFeilet} />
            <HiddenIfHovedknapp
                disabled={lasterOppfolging}
                hidden={reservertKrr}
                onClick={() => dispatch(settDigital())}
                autoDisableVedSpinner
            >
                <FormattedMessage id="sett-digital.manuell-oppfolging.aktiver-digital-knapp" />
            </HiddenIfHovedknapp>
        </div>
    );
}

export default AktiverDigitalOppfolging;