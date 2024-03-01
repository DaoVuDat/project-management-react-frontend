import _ from 'lodash';
import {clsx} from 'clsx';

interface StatusPaymentProp {
  projectPrice: number;
  paymentPaid: number;
}

type PaymentStatus = 'paid' | 'unpaid' | 'progress';

export function StatusPayment({paymentPaid, projectPrice}: StatusPaymentProp) {
  const status: PaymentStatus =
    paymentPaid === 0
      ? 'unpaid'
      : paymentPaid === projectPrice
        ? 'paid'
        : 'progress';

  return (
    <>
      <dt className="sr-only">Status</dt>
      <dd
        className={clsx(
          'rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset ',
          {
						"text-green-600 bg-green-50 ring-green-600/20": status === "paid",
						"text-red-600 bg-red-50 ring-red-600/20": status === "unpaid",
						"text-yellow-600 bg-yellow-50 ring-yellow-600/20": status === "progress",
					},
        )}>
        {_.capitalize(status)}
      </dd>
    </>
  );
}
