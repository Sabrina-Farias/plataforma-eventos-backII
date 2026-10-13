import { randomBytes } from 'node:crypto';

export const createReservationCode = () => {
    return `TCK-${randomBytes(4).toString('hex').toUpperCase()}`;
};
