

const appendZero = (num) => (num < 10 ? `0${num}` : num);
function getFormattedTime(time, remaining = false) {
    const dateTime = new Date(0, 0, 0, 0, 0, time / 1000, 0);

    const dateTimeH = appendZero(dateTime.getHours());
    const dateTimeM = appendZero(dateTime.getMinutes());
    const dateTimeS = appendZero(dateTime.getSeconds());
    const minus = remaining ? '-' : '';

    return dateTimeH > 0
        ? `${minus}${dateTimeH}:${dateTimeM}:${dateTimeS}`
        : `${minus}${dateTimeM}:${dateTimeS}`;
}

module.exports = {
    getFormattedTime
}