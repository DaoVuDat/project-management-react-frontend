import {FieldValues, useController, UseControllerProps} from 'react-hook-form';
import {useState} from 'react';
import {clsx} from 'clsx';

type CommaInputProps<T extends FieldValues> = UseControllerProps<T> & {
	className?: string | undefined
}

export function CommaInput<T extends FieldValues>(
	{className, ...props}: CommaInputProps<T>,
) {
  const {
    field: {name, value, onChange},
    fieldState: {error},
  } = useController(props);
  const [numStr, setNumStr] = useState<string>(
    addCommas(removeNonNumeric(value)),
  );

  function addCommas(num: string) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function removeNonNumeric(num: string) {
    return num.toString().replace(/[^0-9]/g, '');
  }

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
