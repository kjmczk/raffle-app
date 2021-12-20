import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';

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

export default function ModalRenameFile() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  function openModal() {
    setIsOpen(true);
    if (errorMessage) setErrorMessage('');
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  async function handleUpdateFileName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (errorMessage) setErrorMessage('');
    try {
      const res = await fetch(`/api/data/${router.query.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newFileName: event.currentTarget.newFileName.value,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        router.push(`/data/${result.newFileName}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300"
      >
        Rename File
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Rename File Modal"
      >
        <form onSubmit={handleUpdateFileName}>
          <div className="mb-4">
            <label
              htmlFor="newFileName"
              className="block text-sm font-bold mb-2"
            >
              New File Name
            </label>
            <input
              type="text"
              id="newFileName"
              name="newFileName"
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
