import type { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import ModalNew from '../components/ModalNew';

const PROJECT_NAME = 'Skulls In Love';

const Home: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [winner, setWinner] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: slugs } = useSWR('/api/data');
  const { data } = useSWR(selectedFile ? `/api/data/${selectedFile}` : null);

  function handleOnChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedFile(event.target.value);
    setWinner('');
    setErrorMessage('');
    setIsFinished(false);
  }

  function raffle() {
    if (data && data.users.length > 0) {
      setIsDrawing(true);

      const handle = Math.floor(Math.random() * data.users.length);
      window.setTimeout(() => {
        setWinner(`@${data.users[handle]}`);
        setIsDrawing(false);
        setIsFinished(true);
      }, 3 * 1000);
    } else {
      setErrorMessage('no entries yet');
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex flex-col justify-center h-screen">
        <h1 className="text-center text-4xl font-bold mb-8">
          {PROJECT_NAME} Raffle
        </h1>

        {!slugs ? (
          <div>loading...</div>
        ) : (
          <div className="flex justify-center items-center space-x-2">
            <select
              name="files"
              id="file-select"
              onChange={(e) => handleOnChange(e)}
              className="text-gray-800"
            >
              <option value="">-- Please select a file --</option>
              {slugs.map((slug: string, index: number) => (
                <option key={index} value={slug}>
                  {slug}
                </option>
              ))}
            </select>

            {selectedFile && (
              <Link href={`/data/${selectedFile}`}>
                <a>
                  <button className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm">
                    Edit
                  </button>
                </a>
              </Link>
            )}

            <ModalNew />
          </div>
        )}

        {data && (
          <div className="mt-4">
            <div className="mb-4">
              <h2 className="text-center text-xl mb-2">
                The winner of{' '}
                <span className="text-yellow-400">
                  {data.item ? data.item : '???'}
                </span>
              </h2>

              <div className="border border-blue-400 p-4 h-16 flex justify-center items-center max-w-xs mx-auto">
                {winner && (
                  <span className="text-blue-400 font-bold">{winner}</span>
                )}
                {errorMessage && (
                  <span className="text-red-400 font-bold">{errorMessage}</span>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={raffle}
                disabled={isDrawing || isFinished ? true : false}
                className={`flex justify-center items-center rounded px-4 py-2 w-40 ${
                  !isDrawing && !isFinished && 'bg-blue-600 hover:bg-blue-700'
                }
              ${isDrawing && 'bg-red-600 cursor-not-allowed'}
              ${isFinished && 'bg-gray-600 cursor-not-allowed'}
              `}
              >
                {!isDrawing && !isFinished && 'Raffle Start'}
                {isDrawing && (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Drawing...</span>
                  </>
                )}
                {isFinished && 'Raffle End'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
