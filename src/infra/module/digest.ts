import crypto from 'crypto';
import env from './dotenv';

class PasswordDigester {
    private originPassword: string;
    private digestedPassword: string;
    private salt: string;

    constructor(password: string, salt?: string) {
        this.originPassword = password;
        if (salt) this.salt = salt;
    }

    async randomSalt(): Promise<void> {
        this.salt = crypto.randomBytes(64).toString('hex');
    }

    async runDigest(): Promise<void> {
        if (!this.salt) await this.randomSalt();
        this.digestedPassword = this.originPassword;
        for (let i = 0; i < env.PASSWORD_ITERATION; i++) {
            this.digestedPassword = crypto
                .createHmac('sha512', this.digestedPassword)
                .update(this.salt)
                .digest('hex');
        }
    }

    async getSalt(): Promise<string> {
        if (!this.salt) return undefined;
        else return this.salt;
    }

    async getResult(): Promise<string> {
        if (!this.digestedPassword) return undefined;
        else return this.digestedPassword;
    }

    async runAndGetResult(): Promise<string[]> {
        await this.runDigest();
        return [await this.getResult(), await this.getSalt()];
    }
}

export default PasswordDigester;
