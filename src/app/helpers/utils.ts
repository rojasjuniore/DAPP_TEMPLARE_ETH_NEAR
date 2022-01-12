
import Web3 from 'web3';
import BigNumber from "bignumber.js";

// https://ethereum.stackexchange.com/questions/35014/how-to-show-18-decimals-token-balance-in-readable-format
const decimals = 8;



/**
* @notice convert from Ether to Wei  in the correct format
*/
export function toWei(value): any {
    if (!value) { return 0 }
    return Web3.utils.toWei(value.toString());
}

export function toBN(value): any {
    return Web3.utils.toBN(value)
}





/**
* @notice convert from Wei to Ether in the correct format
*/
export function fromWei(value): any {
    if (!value) { return "" }

    return Web3.utils.fromWei(value.toString());
}


/**
* @notice  verify that the address is valid
*/
export function addressIsValid(accounts) {
    return Web3.utils.isAddress(accounts)
}



/**
 * agregamos dias a la fecha actual
 */
export function addDays(days) {
    let dateInAWeek = new Date(); // now
    dateInAWeek.setDate(dateInAWeek.getDate() + days); // add 7 days
    const deadline = Math.floor(dateInAWeek.getTime() / 1000); // unix timestamp
    return deadline.toString()
}

/**
 * transforma una fecha de bloque a js
 */
export function getDateFromBlock(timestamp) {
    let date = new Date(timestamp * 1000);
    // datevalues = [
    //     date.getFullYear(),
    //     date.getMonth()+1,
    //     date.getDate(),
    //     date.getHours(),
    //     date.getMinutes(),
    //     date.getSeconds(),
    //  ];
    return date
}


/**
 * convertimos los dias por segundo
 */

export function convertFromDaysToSeconds(day) {
    return 86400 * day;
}



