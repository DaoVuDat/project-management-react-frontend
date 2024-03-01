import { clsx } from 'clsx';
import _ from 'lodash';

interface StatusProjectProps {
	status: string
}

export function StatusProject({status}: StatusProjectProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ring-1 ring-inset',
        status === 'finished' &&
          ' bg-green-50 text-green-700 ring-green-600/20',
        status === 'progressing' &&
          ' bg-yellow-50 text-yellow-700 ring-yellow-600/20',
        status === 'registering' && ' bg-red-50 text-red-700 ring-red-600/20',
      )}>
      {_.capitalize(status)}
    </span>
  );
}