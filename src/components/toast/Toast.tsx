import {Transition} from '@headlessui/react';
import {Toaster, resolveValue, toast} from 'react-hot-toast';
import {Fragment} from 'react';
import {HiOutlineCheckCircle, HiXMark, HiOutlineXCircle} from 'react-icons/hi2';

interface HeaderMessage {
	success: string
	error: string
	loading: string
}

interface CustomToastOption {
	headerMessage: HeaderMessage
}

export const ToastLoadingId = 'loading'

export function Toast(customToastOption: CustomToastOption) {
  return (
    <Toaster position="top-right">
      {(t) => (
        <div
          aria-live="assertive"
          className="pointer-events-none inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            <Transition
              show={t.visible}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
											{t.type === "success" && <HiOutlineCheckCircle
												className="h-6 w-6 text-green-400"
												aria-hidden="true"
											/>}
											{t.type === "error" && <HiOutlineXCircle
		                    className="h-6 w-6 text-red-400"
		                    aria-hidden="true"
	                    />}
                    </div>
                    <div className="ml-3 min-w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
												{t.type === "success" && customToastOption.headerMessage.success}
												{t.type === "error" && customToastOption.headerMessage.error}
												{t.type === "loading" && customToastOption.headerMessage.loading}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
												{resolveValue(t.message, t)}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary-text focus:ring-offset-2"
                        onClick={() => {
                          toast.dismiss(t.id);
                        }}>
                        <span className="sr-only">Close</span>
                        <HiXMark
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      )}
    </Toaster>
  );
}
