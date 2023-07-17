import cron from 'node-cron';
import containerController from './controller/container.controller.js';


export const weeklyScheduler = cron.schedule('50 58 23 * * 0', () => {
    containerController.weeklyDataCalculation();
});

export const monthlyScheduler = cron.schedule('59 58 23 30 * *', () => {
    containerController.monthlyDataCalculation();
});




// cron.schedule('30,35 0,1 * * * *', () => {
//     console.log(`Testing cron job function every minute${Math.random()}`);
// })



//Running cron with step values
// cron.schedule('*/5 * * * * *', () => {
//     console.log(`Testing cron job function every minute${Math.random()}`);
// })


// ┌────────────── second (optional)
// │ ┌──────────── minute
// │ │ ┌────────── hour
// │ │ │ ┌──────── day of month
// │ │ │ │ ┌────── month
// │ │ │ │ │ ┌──── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *


//Using Cron method

// cron.schedule("* * * * * *", () => {
//     console.log(`Testing cron job function every minute${Math.random()}`);
// }, {
//    // scheduled: true,
//     timezone: ""
// }
// )

// task.stop();
// task.start();
