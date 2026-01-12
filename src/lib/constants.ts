export const TEAMS = Array.from({ length: 11 }, (_, i) => ({
    id: `team${i + 1}`,
    password: `pass${i + 1}`,
}));

export const ADMIN = {
    id: 'admin',
    password: 'adminpassword123',
};
