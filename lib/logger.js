/**
 * Check the documentation at https://getpino.io/#/docs/browser
 * Use the write method to send errors logs to the server
 write (Function | Object)
 Instead of passing log messages to console.log they can be passed to a supplied function.

 If write is set to a single function, all logging objects are passed to this function.

 const pino = require('pino')({
  browser: {
    write: (o) => {
      // do something with o
    }
  }
})
 *
 */

// import * as Pino from 'pino';
//
// function browser() {
//     Pino({browser: {asObject: true}});
//     // Pino({
//     //     browser: {
//     //         write: (o) => {
//     //             console.log("pino: ", o)
//     //         }
//     //     }
//     // });
// }
//
// const logger = (typeof window !== "undefined") ? browser() : Pino('pino')

const logger = {
    LEVEL: {
        MUTE:20,
        ERROR:10,
        WARN:5,
        INFO:2,
        FINE:1,
        DEBUG:0,
    },
    level: 0,
    error: (...str) => {
        if (logger.level <= 10)
            console.error(str ? JSON.stringify(str) : null)
    },
    warn: (...str) => {
        if (logger.level <= 5)
            console.error("warning:" + (str ? JSON.stringify(str) : null))
    },
    info: (...str) => {
        if (logger.level <= 2)
            console.log("info:" + (str ? JSON.stringify(str) : null))
    },
    fine: (...str) => {
        if (logger.level <= 1)
            console.log("fine:" + (str ? JSON.stringify(str) : null))
    },
    debug: (...str) => {
        if (logger.level == 0)
            console.log("debug:" + (str ? JSON.stringify(str) : null))
    }
}
export default logger