import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { autofill, touch } from 'redux-form';
import { CustomField } from 'react-redux-form-validation';
import { connect } from 'react-redux';
import MaskedInput from 'react-maskedinput';
import moment from 'moment';
import { autobind, dateToISODate, toDatePrettyPrint, erGyldigISODato, ISODateToDatePicker, datePickerToISODate, erGyldigFormattertDato } from '../../../utils';
import DayPickerComponent from './day-picker';

function validerPeriode(input, alternativer) {
    const { fra, til } = alternativer;
    const inputDato = moment(input).toDate();
    if (fra && til && (inputDato < fra || inputDato > til)) {
        return `Datoen må være innenfor perioden ${toDatePrettyPrint(fra)}-${toDatePrettyPrint(til)}`;
    }
    if (til && inputDato > til) {
        return `Datoen må være før ${toDatePrettyPrint(til)}`;
    }
    if (fra && inputDato < fra) {
        return `Datoen må være etter ${toDatePrettyPrint(fra)}`;
    }
    return undefined;
}

function validerDatoField(input, alternativer) {
    if (!input) {
        return undefined;
    } else if (!erGyldigISODato(input)) {
        return 'Ugyldig dato';
    } else if (alternativer && (alternativer.fra || alternativer.til)) {
        return validerPeriode(input, alternativer);
    }
    return undefined;
}

function stopEvent(event) {
    try {
        event.nativeEvent.stopImmediatePropagation();
    } catch (e) {
        event.stopPropagation();
    }
}

class DatoField extends Component {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            erApen: false
        };
    }

    onKeyUp(e) {
        const ESCAPE_KEYCODE = 27;
        if (e.which === ESCAPE_KEYCODE) {
            this.lukk();
        }
    }

    onDayClick(event) {
        const { input, dispatch, meta } = this.props;
        const skjemanavn = meta.form;
        const inputName = input.name;
        const isoDate = dateToISODate(new Date(event));
        dispatch(autofill(skjemanavn, inputName, isoDate));
        dispatch(touch(skjemanavn, inputName));
        this.lukk();
    }

    toggle(e) {
        e.preventDefault();
        if (this.state.erApen) {
            this.lukk();
        } else {
            this.apne();
        }
    }
    apne() {
        this.setState({
            erApen: true
        });
    }

    lukk() {
        this.setState({
            erApen: false
        });
        this.toggleButton.focus();
    }

    render() {
        const { meta, input, id, label, disabled, tidligsteFom, senesteTom, inlineError } = this.props;

        const feil = inlineError ? inlineError.props.children[0] : undefined;
        const value = input.value;
        const maskedInputProps = { ...input,
            value: erGyldigISODato(value) ? ISODateToDatePicker(value) : value
        };

        return (
            <div className="datovelger skjemaelement">
                <label className="skjemaelement__label" htmlFor={id}>{label}</label>
                <div // eslint-disable-line jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role
                    className="datovelger__inner"
                    tabIndex=""
                    onClick={stopEvent}
                >
                    <div className="datovelger__inputContainer">
                        <MaskedInput
                            type="tel"
                            mask="11.11.1111"
                            autoComplete="off"
                            placeholder="dd.mm.åååå"
                            id={id}
                            disabled={disabled}
                            className={`skjemaelement__input input--m datovelger__input ${meta.touched && meta.error ? 'input--feil' : ''}`}
                            {...maskedInputProps}
                        />
                        <button
                            className="js-toggle datovelger__toggleDayPicker"
                            aria-label={this.state.erApen ? 'Skjul datovelger' : 'Vis datovelger'}
                            ref={(toggle) => { this.toggleButton = toggle; }}
                            id={`toggle-${id}`}
                            disabled={disabled}
                            onKeyUp={this.onKeyUp}
                            onClick={this.toggle}
                            aria-pressed={this.erApen}
                        />
                    </div>
                    { this.state.erApen && <DayPickerComponent
                        {...this.props}
                        ariaControls={`toggle-${id}`}
                        tidligsteFom={tidligsteFom}
                        senesteTom={senesteTom}
                        onDayClick={this.onDayClick}
                        onKeyUp={this.onKeyUp}
                        lukk={this.lukk}
                    />}
                </div>
                <div role="alert" aria-live="assertive" className="skjemaelement__feilmelding">{feil}</div>
            </div>);
    }
}

DatoField.propTypes = {
    meta: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    id: PT.string.isRequired,
    label: PT.oneOfType([PT.string, PT.node]).isRequired,
    input: PT.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dispatch: PT.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    disabled: PT.bool,
    tidligsteFom: PT.instanceOf(Date),
    senesteTom: PT.instanceOf(Date),
    inlineError: PT.shape({ feilmelding: PT.string })
};

function parseDato(dato) {
    return erGyldigFormattertDato(dato) ? datePickerToISODate(dato) : dato;
}

const ConnectedDatoField = connect()(DatoField);

function Datovelger(props) {
    const { feltNavn, labelId, tidligsteFom, senesteTom } = props;

    const datoFelt = <ConnectedDatoField label={<FormattedMessage id={labelId} />} {...props} />;
    return (
        <CustomField
            name={feltNavn}
            parse={parseDato}
            errorClass="skjemaelement--harFeil"
            customComponent={datoFelt}
            validate={(value) => (
                validerDatoField(value, {
                    fra: tidligsteFom,
                    til: senesteTom
                })
            )}
        />
    );
}

Datovelger.propTypes = {
    feltNavn: PT.string.isRequired,
    labelId: PT.string.isRequired,
    tidligsteFom: PT.instanceOf(Date),
    senesteTom: PT.instanceOf(Date)
};

export default Datovelger;
