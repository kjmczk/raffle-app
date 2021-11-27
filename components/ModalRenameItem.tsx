import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import useSWR, { useSWRConfig } from 'swr';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    background: '#111',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#__next');

export default function ModalRenameItem() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const { mutate } = useSWRConfig();
  const { data } = useSWR(
    router.query.slug ? `/api/data/${router.query.slug}` : null
  );

  function openModal() {
    setIsOpen(true);
    if (errorMessage) setErrorMessage('');
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  async function handleUpdateItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(`/api/data/${router.query.slug}`, async () => {
      await fetch(`/api/data/${router.query.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: event.currentTarget.item.value,
          users: data.users,
        }),
      });
    });
    closeModal();
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm"
      >
        Rename Item
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Rename Item Modal"
      >
        <form onSubmit={handleUpdateItem}>
          <div className="mb-4">
            <label htmlFor="item" className="block text-sm font-bold mb-2">
              New Item Name
            </label>
            <input
              type="text"
              id="item"
              name="item"
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errorMessage && (
              <p className="text-red-500 text-xs italic">{errorMessage}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
