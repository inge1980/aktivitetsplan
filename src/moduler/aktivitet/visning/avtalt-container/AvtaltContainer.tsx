import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STATUS } from '../../../../api/utils';
import { STATUS_AVBRUTT, STATUS_FULLFOERT, UTDANNING_AKTIVITET_TYPE } from '../../../../constant';
import { Aktivitet, Forhaandsorientering } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import { selectErBruker } from '../../../identitet/identitet-selector';
import { settAktivitetTilAvtalt } from '../../aktivitet-actions';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import AvtaltContainerGammel from '../avtalt-container-gammel/AvtaltContainer-gammel';
import DeleLinje from '../delelinje/delelinje';
import AvtaltForm, {
    Handler,
    IKKE_SEND_FORHAANDSORIENTERING,
    SEND_FORHAANDSORIENTERING,
    SEND_PARAGRAF_11_9,
} from './AvtaltForm';
import { useSendAvtaltMetrikker } from './avtaltHooks';
import SattTilAvtaltInfotekst from './SattTilAvtaltInfotekst';

interface Props {
    underOppfolging: boolean;
    aktivitet: Aktivitet;
    className: string;
}

interface ForhaandsorienteringDialogProps {
    avtaltText: string;
    avtaltText119: string;
    forhaandsorienteringType: string;
}

const getForhaandsorienteringText = (avtaltTextProps: ForhaandsorienteringDialogProps) => {
    switch (avtaltTextProps.forhaandsorienteringType) {
        case SEND_FORHAANDSORIENTERING:
            return avtaltTextProps.avtaltText;
        case SEND_PARAGRAF_11_9:
            return avtaltTextProps.avtaltText119;
        case IKKE_SEND_FORHAANDSORIENTERING:
            return '';
        default:
            throw new Error('Ukjent avtalttype');
    }
};

const AvtaltContainer = (props: Props) => {
    const { underOppfolging, aktivitet, className } = props;
    const [sendtAtErAvtaltMedNav, setSendtAtErAvtaltMedNav] = useState(false);
    const [forhandsorienteringType, setForhandsorienteringType] = useState('');
    const dispatch = useDispatch();

    const doSettAktivitetTilAvtaltNy = (aktivitet: Aktivitet, forhaandsorientering: Forhaandsorientering) =>
        dispatch(settAktivitetTilAvtalt(aktivitet, forhaandsorientering));

    const aktivitetStatus = useSelector(selectAktivitetStatus);
    const sendMetrikker = useSendAvtaltMetrikker();

    const erBruker = useSelector(selectErBruker);
    const { type, status, historisk, avtalt } = aktivitet;

    const lasterData = aktivitetStatus !== STATUS.OK;
    const oppdaterer = aktivitetStatus === STATUS.RELOADING;
    const arenaAktivitet = UTDANNING_AKTIVITET_TYPE === type;
    const mindreEnnSyvDagerTil = !erMerEnnSyvDagerTil(aktivitet.tilDato);

    if (
        erBruker ||
        historisk ||
        !underOppfolging ||
        status === STATUS_FULLFOERT ||
        status === STATUS_AVBRUTT ||
        arenaAktivitet
    ) {
        return null;
    }

    // Kun vis bekreftet hvis nettopp satt til avtalt.
    if (!sendtAtErAvtaltMedNav && avtalt) {
        return null;
    }

    if (avtalt) {
        return (
            <SattTilAvtaltInfotekst
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                forhaandsoreteringstype={forhandsorienteringType}
                className={className}
            />
        );
    }

    const onSubmit: Handler = (avtaltForm) => {
        setSendtAtErAvtaltMedNav(true);
        const tekst = getForhaandsorienteringText(avtaltForm);
        doSettAktivitetTilAvtaltNy(aktivitet, { type: avtaltForm.forhaandsorienteringType, tekst });
        setForhandsorienteringType(avtaltForm.forhaandsorienteringType);

        sendMetrikker(avtaltForm.forhaandsorienteringType, aktivitet.type, mindreEnnSyvDagerTil);

        // @ts-ignore
        document.querySelector('.aktivitet-modal').focus();
        return Promise.resolve();
    };

    return (
        <>
            <AvtaltForm
                className={`${className} avtalt-container`}
                oppdaterer={oppdaterer}
                mindreEnnSyvDagerTil={mindreEnnSyvDagerTil}
                lasterData={lasterData}
                onSubmit={onSubmit}
            />
            <DeleLinje />
        </>
    );
};

const AvtaltContainerWrapper = (props: Props) => {
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();
    return brukeNyForhaandsorientering ? <AvtaltContainer {...props} /> : <AvtaltContainerGammel {...props} />;
};

export default AvtaltContainerWrapper;
