import wretch from 'wretch';
import {AuthResponse} from '@/services/api/auth.ts';
import {getAccessToken, storeAccessToken} from '@/services/localStorage.ts';

const BASE_URL = 'http://localhost:8080/v1';

const token = localStorage.getItem('accessToken');

const wretchClientWithRefresh = wretch(BASE_URL)
  .auth(`Bearer ${token}`)
  .options({
    mode: 'cors',
    credentials: 'include',
  })
  .accept('application/json')
  .content('application/json')
  .catcher(401, async (err, originalRequest) => {
    // get old access token from localStorage
    const oldAccessToken = getAccessToken();
    if (oldAccessToken.length < 1) {
      throw err;
    }

    const {access_token: newAccessToken} = await wretch('/token/refresh')
      .auth(`Bearer ${oldAccessToken}`)
      .post()
      .unauthorized((err) => {
        throw err;
      })
      .json<AuthResponse>();

    storeAccessToken(newAccessToken);
    return originalRequest
      .auth(`Bearer ${newAccessToken}`)
      .fetch()
      .unauthorized((err) => {
        throw err;
      })
      .json();
  });

const wretchClient = wretch(BASE_URL)
  .options({
    mode: 'cors',
    credentials: 'include',
  })
  .content('application/json');

export {wretchClient, wretchClientWithRefresh};
