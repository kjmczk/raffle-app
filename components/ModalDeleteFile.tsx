import { useRouter } from 'next/router';
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

export default function ModalDeleteFile() {
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

  async function handleDeleteData() {
    const res = await fetch(`/api/data/${router.query.slug}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      router.push('/data');
    }
  }

  return (
    <div>
      <button
        onClick={openModal}
        className="rounded px-2 py-1 bg-red-600 hover:bg-red-700 text-gray-200"
      >
        Delete File
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Delete File Modal"
      >
        <div className="w-48 mb-4">
          <p>{`Are you sure you want to delete the file ${router.query.slug}?`}</p>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteData}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
