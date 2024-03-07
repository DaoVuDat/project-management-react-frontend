import {wretchClientWithRefresh} from '@/services/wretchClient.ts';

export interface Payment {
  id: number;
  amount: number;
  created_at: string;
}

export interface PaymentCreate {
  amount: number;
}

export const addPayment = async (
  accessToken: string,
  projectId: string,
  userId: string,
  paymentCreate: PaymentCreate,
) =>
  await wretchClientWithRefresh
    .auth(`Bearer ${accessToken}`)
		.query({
			pid: projectId,
			uid: userId
		})
    .post(paymentCreate, `/payment`)
    .json<Payment>();
