import redisClient from '../connector/redis';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import env from './dotenv';
import * as moment from 'moment';

const REDIS_JWT_KEY_PREFIX = 'JWTKEY-';
const REDIS_REFRESH_TOKEN_PREFIX = 'RFCTKN-';

interface TokenInterface {
    accessToken: string;
    refreshToken: string;
}

class KeyManager {
    private static async generateNewJwtKey() {
        const { publicKey, privateKey } = await crypto.generateKeyPairSync(
            'rsa',
            {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                    cipher: 'aes-256-cbc',
                    passphrase: '',
                },
            },
        );
        const key =
            REDIS_JWT_KEY_PREFIX + String(Math.floor(Number(moment.utc())));
        await redisClient.set(
            key as any,
            (publicKey + '|' + privateKey) as any,
            {
                EX: env.REFRESH_TTL,
            } as any,
        );
        return key;
    }

    private static async getRedisKeyList(): Promise<string[]> {
        const keys: string[] = await redisClient.keys(
            (REDIS_JWT_KEY_PREFIX + '*') as any,
        );
        keys.sort().reverse();
        return keys;
    }

    static async getPublicKeyList(): Promise<string[]> {
        const keys: string[] = await this.getRedisKeyList();

        const jwtPublicKeys = [];
        for (const key of keys) {
            jwtPublicKeys.push(
                ((await redisClient.get(key as any)) ?? '').split('|')[0],
            );
        }
        return jwtPublicKeys;
    }

    static async getPrivateKey(): Promise<string> {
        let key: string = (await this.getRedisKeyList())[0];
        if (
            key === undefined ||
            Number(moment.utc()) + (env.JWT_KEY_TTL * 1000) / 2 <
                parseInt(key.replace(REDIS_JWT_KEY_PREFIX, ''), 10)
        )
            key = await this.generateNewJwtKey();
        return ((await redisClient.get(key as any)) ?? '').split('|')[1];
    }
}

class TokenManager {
    private readonly id: number;

    constructor(id?: number) {
        if (id) this.id = id;
    }

    private generateRefreshToken(): string {
        let result = '';
        const characterSet =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const characterSetLength = characterSet.length;
        for (let i = 0; i < 256; i++) {
            result += characterSet.charAt(
                Math.floor(Math.random() * characterSetLength),
            );
        }
        return result;
    }

    async generateTokenObject(): Promise<TokenInterface> {
        const privateKey: string = await KeyManager.getPrivateKey();

        const access = jwt.sign(
            {
                idx: this.id,
            },
            { key: privateKey, passphrase: '' },
            {
                issuer: env.JWT_ISSUER,
                expiresIn: env.ACCESS_TTL,
                algorithm: 'RS256',
            },
        );

        const refresh = this.generateRefreshToken();
        await redisClient.set(
            (REDIS_REFRESH_TOKEN_PREFIX + refresh) as any,
            this.id as any,
            {
                EX: env.REFRESH_TTL,
            } as any,
        );

        return { accessToken: access, refreshToken: refresh };
    }

    async validateAccessToken(access: string): Promise<number | Error> {
        const publicKeys = await KeyManager.getPublicKeyList();

        for (const i in publicKeys) {
            const result: number | undefined = await new Promise(resolve => {
                jwt.verify(
                    access,
                    publicKeys[i],
                    {
                        issuer: env.JWT_ISSUER,
                        algorithms: ['RS256'],
                    },
                    (
                        err: jwt.VerifyErrors | null,
                        decoded: { idx: string },
                    ) => {
                        if (err || typeof decoded === 'string')
                            resolve(undefined);
                        else resolve(parseInt(decoded.idx, 10) ?? undefined);
                    },
                );
            });
            if (result) return result;
        }
        return new Error('cannot find matching key');
    }

    async getAndDelRefreshToken(refresh: string): Promise<string | Error> {
        const idString: string =
            (await redisClient.get(
                (REDIS_REFRESH_TOKEN_PREFIX + refresh) as any,
            )) ?? '';
        await redisClient.del((REDIS_REFRESH_TOKEN_PREFIX + refresh) as any);
        if ('' === idString) {
            return new Error('cannot find refresh token');
        }

        return idString;
    }
}

export { TokenInterface };
export default TokenManager;
