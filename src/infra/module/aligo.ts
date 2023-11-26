import env from './dotenv';
import axios from 'axios';

class Aligo {
    static async sendMessage(phone: string, content: string) {
        return await axios.post(
            'https://apis.aligo.in/send/',
            (() => {
                const formData = new FormData();

                formData.append('key', env.ALIGO_KEY);
                formData.append('user_id', env.ALIGO_ID);
                formData.append('sender', env.ALIGO_SENDER);
                formData.append('receiver', phone);
                formData.append('msg', content);

                return formData;
            })(),
        );
    }
}

export default Aligo;
