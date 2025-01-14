import React, { useContext } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../constant';
import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import Modal from '../../../felles-komponenter/modal/Modal';
import ModalHeader from '../../../felles-komponenter/modal/ModalHeader';
import { Avhengighet } from '../../../felles-komponenter/utils/Innholdslaster';
import { aktivitetStatusMap, aktivitetTypeMap } from '../../../utils/textMappers';
import { DirtyContext } from '../../context/dirty-context';
import { selectDialogFeilmeldinger } from '../../dialog/dialog-selector';
import { selectErBruker } from '../../identitet/identitet-selector';
import { selectNivaa4Feilmeldinger } from '../../tilgang/tilgang-selector';
import { selectAktivitetFeilmeldinger } from '../aktivitet-selector';
import { selectArenaFeilmeldinger } from '../arena-aktivitet-selector';
import { skalMarkereForhaandsorienteringSomLest } from './avtalt-container/utilsForhaandsorientering';

const header = (valgtAktivitet?: Aktivitet) => {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast = valgtAktivitet.status === STATUS_FULLFOERT || valgtAktivitet.status === STATUS_AVBRUTT;

    return (
        <ModalHeader
            headerTekst={`${aktivitetStatusMap[valgtAktivitet.status]} / ${aktivitetTypeMap[valgtAktivitet.type]}`}
            aria-describedby="modal-aktivitetsvisning-header"
            aktivitetErLaast={aktivitetErLaast}
        />
    );
};

const DIALOG_TEKST = 'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

interface Props {
    aktivitet?: Aktivitet;
    avhengigheter: Avhengighet[];
    children: React.ReactNode;
}

const AktivitetvisningModal = (props: Props) => {
    const { aktivitet, avhengigheter, children } = props;
    const dirty = useContext(DirtyContext);
    const history = useHistory();
    const selector = aktivitet?.arenaAktivitet ? selectArenaFeilmeldinger : selectAktivitetFeilmeldinger;

    const aktivitetFeil = useSelector(selector, shallowEqual);
    const nivaa4Feil = useSelector(selectNivaa4Feilmeldinger, shallowEqual);
    const dialogFeil = useSelector(selectDialogFeilmeldinger, shallowEqual);
    const alleFeil = aktivitetFeil.concat(dialogFeil).concat(nivaa4Feil);
    const erBruker = useSelector(selectErBruker);

    const fho = aktivitet?.forhaandsorientering;
    const skalLeses = skalMarkereForhaandsorienteringSomLest(erBruker, aktivitet);

    return (
        <Modal
            contentLabel="aktivitetsvisning-modal"
            contentClass="aktivitetsvisning"
            avhengigheter={avhengigheter}
            header={header(aktivitet)}
            onRequestClose={() => {
                if (dirty.isDirty && !window.confirm(DIALOG_TEKST)) {
                    return;
                }
                if (skalLeses && fho) {
                    window.alert('Det er en viktig beskjed om ansvaret ditt som du må lese.');
                    return;
                }
                history.push('/');
            }}
            feilmeldinger={alleFeil}
        >
            {children}
        </Modal>
    );
};

export default AktivitetvisningModal;
