import wretch from 'wretch';
import QueryStringAddon from "wretch/addons/queryString"
import {AuthResponse} from '@/services/api/auth.ts';
import { useAuthStore } from '@/store/authStore.tsx';

const BASE_URL = 'http://localhost:8080/v1';



const wretchClient = wretch(BASE_URL)
  .options({
    mode: 'cors',
    credentials: 'include',
  })
  .content('application/json');


const wretchClientWithRefresh = wretch(BASE_URL)
  .addon(QueryStringAddon)
  .options({
    mode: 'cors',
    credentials: 'include',
  })
  .accept('application/json')
  .content('application/json')
  .catcher(401, async (err, originalRequest) => {
    // get old access token from localStorage
    const oldAccessToken = useAuthStore.getState().accessToken
    if (oldAccessToken.length < 1) {
      throw err;
    }

    const {access_token: newAccessToken,user_id,role} = await wretchClient.url('/token/refresh')
      .auth(`Bearer ${oldAccessToken}`)
      .post()
      .unauthorized((err) => {
        throw err;
      })
      .json<AuthResponse>();

    useAuthStore.getState().setUser(user_id, role, newAccessToken)
    return originalRequest
      .auth(`Bearer ${newAccessToken}`)
      .fetch()
      .unauthorized((err) => {
        throw err;
      })
      .json();
  });

export {wretchClient, wretchClientWithRefresh};
