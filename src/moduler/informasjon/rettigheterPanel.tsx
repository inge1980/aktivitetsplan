import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import styles from './informasjon-modal.module.less';

export function RettigheterPanel() {
    return (
        <Ekspanderbartpanel tittel="Rettigheter og personvern" tittelProps="undertittel">
            <Normaltekst>
                Du har rett til å få en aktivitetsplan når du har kontaktet oss for å få hjelp til å komme i jobb. Alle
                skal bruke aktivitetsplanen og kommunisere med NAV gjennom den.
            </Normaltekst>
            <Undertittel className={styles.undertittel}>Manuell oppfølging</Undertittel>
            <Normaltekst>
                NAV henter informasjon om deg fra Folkeregisteret og sjekker mot Kontakt- og reservasjonsregisteret. Det
                gjør vi for å se om du har reservert deg mot digital kommunikasjon med det offentlige. Hvis du har
                reservert deg, eller ikke er i stand til å fylle inn en aktivitetsplan, vil NAV følge deg opp manuelt.
                Det betyr at en veileder følger deg opp uten at du selv bruker den digitale aktivitetsplanen. Du får
                aktivitetsplanen skrevet ut på papir.
            </Normaltekst>
            <Undertittel className={styles.undertittel}>Deling og lagring</Undertittel>
            <Normaltekst>
                Opplysningene i aktivitetsplanen blir ikke delt med andre offentlige etater, med mindre de har rett til
                å hente slike opplysninger.
            </Normaltekst>
            <Normaltekst>
                Opplysningene i aktivitetsplanen din blir lagret og oppbevart etter arkivloven. Aktiviteter og meldinger
                i dialogen kan ikke slettes når de først er opprettet.
            </Normaltekst>
            <Normaltekst>
                Les mer om{' '}
                <Lenke href="https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten">
                    hvordan NAV behandler personopplysninger
                </Lenke>
                .
            </Normaltekst>
        </Ekspanderbartpanel>
    );
}
