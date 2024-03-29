import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
	FieldValues,
	useController,
	UseControllerProps,
} from 'react-hook-form';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';
import { clsx } from 'clsx';
import _ from 'lodash';

export type DataType = {
	displayName: string,
	value: string
}

type ControlledSelectProps<U extends FieldValues>  =  UseControllerProps<U> & {
	label: string
	data: DataType[],
	defaultValue: string
}

export function ControlledSelect<U extends FieldValues>({label, data, defaultValue, ...props}: ControlledSelectProps<U>) {
	const {field: {name, value, onChange}} = useController(props)

	const getDisplayNameSelected = data.find(v => v.value === value)?.displayName
	const displayName = getDisplayNameSelected ? getDisplayNameSelected : defaultValue

	return <Listbox value={value} onChange={onChange} name={name}>
		{({ open }) => (
			<>
				<Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{label}</Listbox.Label>
				<div className="relative mt-2">
					<Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm sm:leading-6">
						<span className="block truncate">{_.capitalize(displayName)}</span>
						<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
					</Listbox.Button>

					<Transition
						show={open}
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{data.map((obj) => (
								<Listbox.Option
									key={obj.value}
									className={({ active }) =>
										clsx(
											active ? 'bg-secondary text-white' : 'text-gray-900',
											'relative cursor-default select-none py-2 pl-3 pr-9'
										)
									}
									value={obj.value}
								>
									{({ selected, active }) => (
										<>
                        <span className={clsx(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {obj.displayName}
                        </span>

											{selected ? (
												<span
													className={clsx(
														active ? 'text-white' : 'text-secondary-text',
														'absolute inset-y-0 right-0 flex items-center pr-4'
													)}
												>
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
											) : null}
										</>
									)}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</>
		)}
	</Listbox>
}