import {z} from 'zod';
import {useAuthStore} from '@/store/authStore.tsx';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useRouter} from '@tanstack/react-router';
import {CommaInput} from '@/components/inputNumberWithComma/CommaInput.tsx';
import {MdAdd} from 'react-icons/md';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {addPayment, Payment, PaymentCreate} from '@/services/api/payment.ts';
import {toast} from 'react-hot-toast';
import {ToastLoadingId} from '@/components/toast/Toast.tsx';
import {clsx} from 'clsx';

const INITIAL_COST = ''

const schema = z.object({
  amount: z
    .string()
    .refine(
      (val) => (val ? Number(val) >= 1_000_000 : null),
      'Amount must be large than 1,000,000',
    )
    .nullish(),
});

type SchemaType = z.infer<typeof schema>;

interface AddPaymentFormProps {
  projectId: string;
  userId: string;
}

export function AddPaymentForm({userId, projectId}: AddPaymentFormProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  const router = useRouter();

  const {mutate} = useMutation<Payment, Error, PaymentCreate>({
    mutationFn: (data) => addPayment(accessToken, projectId, userId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId],
      });
      toast.dismiss(ToastLoadingId);
      toast.success(`Added new payment successfully.`);
      router.invalidate();
    },
    onMutate: () => {
      toast.loading(`Adding new payment...`, {
        id: ToastLoadingId,
      });
    },
    onError: () => {
      toast.dismiss(ToastLoadingId);
      toast.error(`Failed to add new payment.`);
    },
  });

  const {
    handleSubmit,
    control,
    formState: {isDirty},
    getValues,
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = handleSubmit((formData) => {
    if (isDirty) {
      const amount = formData.amount
        ? formData.amount.substring(0, formData.amount.length - 6)
        : undefined;
      const paymentCreate: PaymentCreate = {
        amount: Number(amount),
      };
      mutate(paymentCreate);
    }
  });

  return (
    <div className="lg:col-start-3">
      <h2 className="sr-only">Add New Payment</h2>
      <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <form onSubmit={onSubmit}>
          <div className="mt-6 border-gray-900/5 p-5">
            <label
              htmlFor="amount"
              className="text-sm font-medium leading-6">
              Amount
            </label>
            <CommaInput
              initialValue={INITIAL_COST}
              name="amount"
              control={control}
              className="mt-4"
            />
          </div>
          <div className="px-6 pb-6 text-end">
            <button
              type="submit"
              disabled={
                getValues('amount') === undefined || getValues('amount') === ''
              }
              className={clsx(
                'inline-flex space-x-2 rounded-md border bg-white p-2 text-xl',
                {
                  'cursor-not-allowed':
                    getValues('amount') === undefined ||
                    getValues('amount') === '',
                },
              )}>
              <MdAdd /> <span className="text-sm">Add new payment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
