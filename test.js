// const Account = {
//     getID: () => Math.random(),
//     getFirstName: () => "Temitayo",
//     getLastName: () => "Sosanya",
//     getPhoneNumber: () => "07037767045",
//     getEmail: () => "tnsosanya@gmail.com",
//     getAddress: () => "Olowoora, Lagos state",
// }

// const AccountEncode = (entity) => {
//     return {
//         id: entity.getID(),
//         firstName: entity.getFirstName(),
//         lastName: entity.getLastName(),
//         email: entity.getEmail(),
//         phoneNumber: entity.getPhoneNumber(),
//         address: entity.getAddress()
//     }

// };

// const AccountDecode = (entity) => {
// return {
//     getID: () => id,
//     getFirstName: () => firstName,
//     getLastName: () => lastName,
//     getPhoneNumber: () => phoneNumber,
//     getEmail: () => email,
//     getAddress: () => address,
// }
// }

// console.log(AccountEncode(Account));
// console.log(AccountDecode(Account));

const brandID = 2349;


const greetings = brandID == 234 || brandID == 456 || brandID == 567 ? "welcome": "Goodbye";


console.log(greetings);