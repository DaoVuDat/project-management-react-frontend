import {Dialog, Transition} from '@headlessui/react';
import {Fragment, ReactElement} from 'react';

interface OverlayDialogProps {
  open: boolean;
  onClose: () => Promise<void> | void;
  titleComponent: ReactElement;
  descriptionComponent?: ReactElement | null;
  bodyComponent: ReactElement;
}

export function OverlayDialog({
  open,
  onClose,
  titleComponent,
  descriptionComponent,
  bodyComponent,
}: OverlayDialogProps) {
  return (
    <Transition
      appear
      show={open}
      as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md sm:max-w-lg md:max-w-xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {titleComponent}
                </Dialog.Title>
                {descriptionComponent && <Dialog.Description>{descriptionComponent}</Dialog.Description>}
                {bodyComponent}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
