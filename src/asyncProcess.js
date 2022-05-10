import { faker } from '@faker-js/faker';

const operation = (cbk) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        cbk({ firstName, lastName });
        resolve('ok');
      }, 500);
    } catch (err) {
      reject(err);
    }
  });
};

const writeData = async (cbk) => {
  for (let index = 0; index < 150; index++) {
    // if (index === 25) throw new Error('Ops!');
    await operation(cbk);
  }
};

module.exports = { writeData };
