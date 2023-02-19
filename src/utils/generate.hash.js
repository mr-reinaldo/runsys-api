import bcrypt from 'bcrypt';

/**
 * Função para gerar hash de senha.
 * @param {string} password - Senha a ser gerada o hash.
 * @returns {string} - Hash gerado.
 * @throws {Error} - Caso ocorra algum erro.
 */
async function generateHash(password) {
    try {
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }
    catch (error) {
        throw new Error(error);
    }
}

/**
 * Função para comparar hash de senha.
 * @param {string} password - Senha a ser comparada.
 * @param {string} hash - Hash a ser comparado.
 * @returns {boolean} - Resultado da comparação.
 * @throws {Error} - Caso ocorra algum erro.
 * @throws {Error} - Caso a senha não seja válida.
 * @throws {Error} - Caso o hash não seja válido.
 */

async function compareHash(password, hash) {
    try {
        const isValid = await bcrypt.compare(password, hash);

        if (!isValid) {
            throw new Error('Senha inválida.');
        }

        return isValid;
    } catch (error) {
        throw new Error(error);
    }
}

export { generateHash, compareHash };