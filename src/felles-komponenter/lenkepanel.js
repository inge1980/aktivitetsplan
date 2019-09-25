import React from 'react';
import NavLenkepanel from 'nav-frontend-lenkepanel';
import InternLenke from './utils/internLenke';
import hiddenIf from './hidden-if/hidden-if';

function LenkeUtenStyling(props) {
    return <InternLenke {...props} skipStyling />;
}

function Lenkepanel(props) {
    return <NavLenkepanel linkCreator={LenkeUtenStyling} {...props} />;
}

export default hiddenIf(Lenkepanel);
