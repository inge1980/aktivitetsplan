import * as Utils from './utils';

describe('app utils', () => {
    describe('fn', () => {
        it('Skal returnere en funksjon hva en som blir gitt som input', () => {
            const funksjon = () => 'en funksjon';
            const string = 'en string';

            expect(Utils.fn(funksjon)()).toEqual('en funksjon');
            expect(Utils.fn(string)()).toEqual('en string');
            expect(typeof Utils.fn('test')).toBe('function');
        });
    });

    describe('guid', () => {
        it('GUID skal følge standard format', () => {
            const guid = Utils.guid();
            const guidParts = guid.split('-');

            expect(guidParts.length).toEqual(5);
        });

        it('GUID skal være forskjellige', () => {
            const guid1 = Utils.guid();
            const guid2 = Utils.guid();

            expect(guid1 === guid2).toEqual(false);
        });
    });

    describe('autobind', () => {
        it('Skal kalle rebinde alle funksjoner på prototypen', () => {
            class Mock {
                constructor() {
                    Utils.autobind(this);
                }

                fn1() {
                    this.a = 1;
                }

                fn2() {
                    this.b = 1;
                }
            }

            const mock = new Mock();

            expect(mock.hasOwnProperty('fn1')).toEqual(true); // eslint-disable-line no-prototype-builtins
            expect(mock.hasOwnProperty('fn2')).toEqual(true); // eslint-disable-line no-prototype-builtins
        });

        it('Skal håndertere verdier på prototypen', () => {
            class Mock {
                constructor() {
                    Utils.autobind(this);
                }

                fn3() {
                    this.c = 1;
                }
            }
            Mock.prototype.val1 = 'abba';

            new Mock(); // eslint-disable-line no-new

            expect(true).toEqual(true); // Skal ikke kaste error
        });
    });

    describe('erInternlenke', () => {
        it('Skal kjenne igjen en ekstern lenke', () => {
            const httpsHref = 'https://www.nrk.no/';
            const httpHref = 'http://www.nrk.no/';

            expect(Utils.erInternlenke(httpsHref)).toEqual(false);
            expect(Utils.erInternlenke(httpHref)).toEqual(false);
            expect(Utils.erInternlenke('/a/b/c')).toEqual(true);
            expect(Utils.erInternlenke(null)).toEqual(false);
            expect(Utils.erInternlenke(undefined)).toEqual(false);
        });
    });

    describe('dateToISODate', () => {
        it('Skal formattere korrekt', () => {
            expect(Utils.dateToISODate(new Date(2014, 1, 14))).toEqual(
                '2014-02-13T23:00:00.000Z'
            );
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.dateToISODate('14.02.2014')).toEqual('');
            expect(Utils.dateToISODate('ugyldig')).toEqual('');
            expect(Utils.dateToISODate('')).toEqual('');
            expect(Utils.dateToISODate(null)).toEqual('');
            expect(Utils.dateToISODate(undefined)).toEqual('');
        });
    });

    describe('datePickerToISODate', () => {
        it('Skal formattere korrekt', () => {
            expect(Utils.datePickerToISODate('14.02.2014')).toEqual(
                '2014-02-13T23:00:00.000Z'
            );
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.datePickerToISODate('ugyldig')).toEqual('');
            expect(Utils.datePickerToISODate('')).toEqual('');
            expect(Utils.datePickerToISODate(null)).toEqual('');
            expect(Utils.datePickerToISODate(undefined)).toEqual('');
        });
    });

    describe('ISODateToDatePicker', () => {
        it('Skal formattere korrekt', () => {
            expect(
                Utils.ISODateToDatePicker('2014-02-13T23:00:00.000Z')
            ).toEqual('14.02.2014');
        });

        it('Skal ikke formattere ugyldige eller tomme datoer', () => {
            expect(Utils.ISODateToDatePicker('ugyldig')).toEqual('');
            expect(Utils.ISODateToDatePicker('')).toEqual('');
            expect(Utils.ISODateToDatePicker(null)).toEqual('');
            expect(Utils.ISODateToDatePicker(undefined)).toEqual('');
        });
    });

    describe('erGyldigISODato', () => {
        it('Tolker ISO-datoer riktig', () => {
            expect(Utils.erGyldigISODato('2014-02-13T23:00:00.000Z')).toEqual(
                true
            );
            expect(
                Utils.erGyldigISODato('2014-02-13T23:00:00.000+0000')
            ).toEqual(true);
            expect(Utils.erGyldigISODato('2014-02-13')).toEqual(true);
            expect(Utils.erGyldigISODato('13.02.2014')).toEqual(false);
            expect(Utils.erGyldigISODato('')).toEqual(false);
            expect(Utils.erGyldigISODato(null)).toEqual(false);
            expect(Utils.erGyldigISODato(undefined)).toEqual(false);
        });
    });

    describe('formaterDatoTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoTid(null)).toBeUndefined();
            expect(Utils.formaterDatoTid(undefined)).toBeUndefined();
            expect(Utils.formaterDatoTid('2014-02-13T14:23:21.123Z')).toEqual(
                '13.02.2014 15:23'
            ); // NB zulu-time != paris-time
        });
    });

    describe('formaterDato', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDato(null)).toBeUndefined();
            expect(Utils.formaterDato(undefined)).toBeUndefined();
            expect(Utils.formaterDato('2014-02-13T14:23:21.123Z')).toEqual(
                '13. feb 2014'
            );
        });
    });

    describe('formaterDatoKortManed', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoKortManed(null)).toBeUndefined();
            expect(Utils.formaterDatoKortManed(undefined)).toBeUndefined();
            expect(
                Utils.formaterDatoKortManed('2014-02-13T14:23:21.123Z')
            ).toEqual('13. feb 2014'); // NB zulu-time != paris-time
        });
    });

    describe('formaterDatoKortManedTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterDatoKortManedTid(null)).toBeUndefined();
            expect(Utils.formaterDatoKortManedTid(undefined)).toBeUndefined();
            expect(
                Utils.formaterDatoKortManedTid('2014-02-13T14:23:21.123Z')
            ).toEqual('13. feb 2014 kl 15:23'); // NB zulu-time != paris-time
        });
    });

    describe('formaterTid', () => {
        it('Formater datoer riktig', () => {
            expect(Utils.formaterTid(null)).toBeUndefined();
            expect(Utils.formaterTid(undefined)).toBeUndefined();
            expect(Utils.formaterTid('2014-02-13T14:23:21.123Z')).toEqual(
                '15:23'
            ); // NB zulu-time != paris-time
        });
    });

    describe('datoComparator', () => {
        it('Returner 0 ved like datoer', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-13T23:00:00.000Z',
                    '2014-02-13T23:00:00.000Z'
                )
            ).toEqual(0);
        });

        it('Returner > 0 hvis venstre er senere enn høyre', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-16T23:00:00.000Z',
                    '2014-02-13T23:00:00.000Z'
                )
            ).toBeGreaterThan(0);
        });

        it('Returner < 0 hvis venstre er tidligere enn høyre', () => {
            expect(
                Utils.datoComparator(
                    '2014-02-13T23:00:00.000Z',
                    '2014-02-16T23:00:00.000Z'
                )
            ).toBeLessThan(0);
        });

        it('Fornuftig håndtering av null og undefined', () => {
            expect(
                Utils.datoComparator('2014-02-13T23:00:00.000Z', null)
            ).toBeGreaterThan(0);
            expect(
                Utils.datoComparator('2014-02-13T23:00:00.000Z', undefined)
            ).toBeGreaterThan(0);

            expect(
                Utils.datoComparator(null, '2014-02-16T23:00:00.000Z')
            ).toBeLessThan(0);
            expect(
                Utils.datoComparator(undefined, '2014-02-16T23:00:00.000Z')
            ).toBeLessThan(0);
        });
    });

    describe('storeForbokstaver', () => {
        it('Formatterer ord med stor forbokstav', () => {
            expect(Utils.storeForbokstaver('KARI')).toEqual('Kari');
            expect(Utils.storeForbokstaver('PER OLAV KNUTSON')).toEqual(
                'Per Olav Knutson'
            );
            expect(Utils.storeForbokstaver('pelle parafin')).toEqual(
                'Pelle Parafin'
            );
            expect(
                Utils.storeForbokstaver('FORNAVN', 'MELLOMNAVN', 'ETTERNAVN')
            ).toEqual('Fornavn Mellomnavn Etternavn');
            expect(
                Utils.storeForbokstaver('FORNAVN', undefined, 'ETTERNAVN')
            ).toEqual('Fornavn Etternavn');
            expect(Utils.storeForbokstaver('', null, 'ETTERNAVN')).toEqual(
                'Etternavn'
            );
            expect(Utils.storeForbokstaver(null)).toEqual('');
            expect(Utils.storeForbokstaver(undefined)).toEqual('');
        });
    });
});

describe('getAntallDager', () => {
    test('samme fradato og tildato ', () => {
        const now = new Date();

        expect(Utils.getAntallDager(now, now)).toBe(0);
    });

    test('tildato neste dag men under 24t fram i tid', () => {
        const now = new Date('2019-07-12T15:00:10.971+01:00');
        const tilDato = new Date('2019-07-13T01:00:10.971+01:00');

        expect(Utils.getAntallDager(now, tilDato)).toBe(1);
    });

    test('tildato neste dag og under 24t fram i tid', () => {
        const now = new Date('2019-07-12T15:00:10.971+01:00');
        const tilDato = new Date('2019-07-13T16:00:10.971+01:00');

        expect(Utils.getAntallDager(now, tilDato)).toBe(1);
    });

    test('tildato neste dag og under 24t fram i tid', () => {
        const now = new Date('2019-07-12T15:00:10.971+01:00');
        const tilDato = new Date('2019-07-13T16:00:10.971+01:00');

        expect(Utils.getAntallDager(now, tilDato)).toBe(1);
    });

    test('tildato flere dager fram i tid', () => {
        const now = new Date('2019-07-12T15:00:10.971+01:00');
        const tilDato = new Date('2019-07-24T16:00:10.971+01:00');

        expect(Utils.getAntallDager(now, tilDato)).toBe(12);
    });

    test('tildato før fradato', () => {
        const now = new Date('2019-07-12T15:00:10.971+01:00');
        const tilDato = new Date('2019-07-10T15:00:10.971+01:00');

        expect(Utils.getAntallDager(now, tilDato)).toBe(-2);
    });
});
