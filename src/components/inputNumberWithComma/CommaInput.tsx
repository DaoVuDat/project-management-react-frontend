import {FieldValues, useController, UseControllerProps} from 'react-hook-form';
import { useEffect, useState } from 'react';
import {clsx} from 'clsx';

type CommaInputProps<T extends FieldValues> = UseControllerProps<T> & {
	className?: string | undefined,
  initialValue: string
}

export function CommaInput<T extends FieldValues>(
	{className, initialValue, ...props}: CommaInputProps<T>,
) {
  const {
    field: {name, onChange},
    fieldState: {error},
    formState: {isSubmitSuccessful}
  } = useController(props);
  const [numStr, setNumStr] = useState<string>(
    addCommas(removeNonNumeric(initialValue)),
  );

  function addCommas(num: string) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function removeNonNumeric(num: string) {
    return num.toString().replace(/[^0-9]/g, '');
  }

  function reset() {
    const removedNonNumeric = removeNonNumeric(initialValue);
    setNumStr(addCommas(removedNonNumeric));
  }

  useEffect(() => {
    reset()
  }, [isSubmitSuccessful]);

  return (
    <fieldset className="relative">
      <input
        type="text"
        name={name}
        value={numStr}
        onChange={(e) => {
          const removedNonNumeric = removeNonNumeric(e.target.value);
          // for visualization
          setNumStr(addCommas(removedNonNumeric));
          // update
          onChange(removedNonNumeric);
        }}
        className={clsx(
					className,
          'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6',
        )}
      />
      <p className="mt-1 text-sm text-red-400">{error && error.message}</p>
    </fieldset>
  );
}
