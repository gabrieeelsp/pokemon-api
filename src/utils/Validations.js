const validateName = (name) => {
    if ( !name) return 'El nombre no puede estar vacío';
    return '';
}

const validateAttack = (ataque) => {
    if ( !ataque ) return 'No puede quedar vacío.';
    if ( isNaN(ataque) ) return 'Debe ingresar un numero.';
    return '';
}

const validateVida = (vida) => {
    if ( !vida ) return 'No puede quedar vacío.';
    if ( isNaN(vida) ) return 'Debe ingresar un numero.';
    return '';
}

const validateDefensa = (defensa) => {
    if ( !defensa ) return 'No puede quedar vacío.';
    if ( isNaN(defensa) ) return 'Debe ingresar un numero.';
    return '';
}

const validateVelocidad = (velocidad) => {
    if ( isNaN(velocidad) ) return 'Debe ingresar un numero.';
    return '';
}

const validateAltura = (altura) => {
    if ( isNaN(altura) ) return 'Debe ingresar un numero.';
    return '';
}

const validatePeso = (peso) => {
    if ( isNaN(peso) ) return 'Debe ingresar un numero.';
    return '';
}

module.exports = {
    validateName,
    validateAttack,
    validateVida,
    validateDefensa,
    validateVelocidad,
    validateAltura,
    validatePeso,
}