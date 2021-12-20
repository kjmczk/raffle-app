import type { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import type { ChangeEvent } from 'react';
import { useState } from 'react';

import ModalNew from '../components/ModalNew';

const PROJECT_NAME = 'Skulls In Love';

const Home: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: slugs } = useSWR('/api/data');
  const { data } = useSWR(selectedFile ? `/api/data/${selectedFile}` : null);

  function handleOnChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedFile(event.target.value);
    setWinners([]);
    setErrorMessage('');
    setIsFinished(false);
  }

  function getRandom(arr: string[], n: number) {
    let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  function raffle() {
    if (data.users.length === 0) {
      setErrorMessage('no entries yet');
    } else if (data.items.length > data.users.length) {
      setErrorMessage('There are fewer users than items');
    } else {
      setIsDrawing(true);

      const handles = getRandom(data.users, data.items.length);
      window.setTimeout(() => {
        setWinners(handles);
        setIsDrawing(false);
        setIsFinished(true);
      }, 3 * 1000);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex flex-col my-8">
        <h1 className="text-center text-4xl text-gray-500 font-bold mb-8">
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
              className="text-gray-800 bg-gray-200"
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
                  <button className="rounded px-2 py-1 bg-gray-600 hover:bg-gray-700 text-sm text-gray-200">
                    Edit
                  </button>
                </a>
              </Link>
            )}

            <ModalNew />
          </div>
        )}

        {data && (
          <>
            {data.items.length > 0 ? (
              <div className="pt-8">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={raffle}
                    disabled={isDrawing || isFinished ? true : false}
                    className={`flex justify-center items-center rounded px-4 py-2 w-40 ${
                      !isDrawing &&
                      !isFinished &&
                      data.users.length > 0 &&
                      data.items.length <= data.users.length &&
                      'bg-blue-600 hover:bg-blue-700 text-gray-100'
                    }
              ${isDrawing && 'bg-red-600 text-gray-100 cursor-not-allowed'}
              ${
                (isFinished ||
                  data.users.length < 1 ||
                  data.items.length > data.users.length) &&
                'bg-gray-700 cursor-not-allowed'
              }
              `}
                  >
                    {!isDrawing && !isFinished && 'Raffle Start'}
                    {isDrawing && (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5"
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

                <p className="text-center mt-2">
                  Entry Users: {data.users.length}
                </p>

                {errorMessage && (
                  <p className="text-red-500 text-center mt-2">
                    {errorMessage}
                  </p>
                )}

                <h2 className="text-center text-xl text-gray-300 font-bold uppercase mt-6 mb-2">
                  {data.title} {data.users.length > 1 ? 'winners' : 'winner'}
                </h2>

                <div className="border border-gray-600 flex justify-around items-center max-w-lg mx-auto">
                  <ul
                    className={`${
                      winners.length > 0 ? 'w-1/3' : 'w-full'
                    } divide-y divide-gray-600`}
                  >
                    {data.items.map((item: string, i: number) => (
                      <li
                        key={i}
                        className={`${
                          i % 2 === 0 && 'bg-gray-800'
                        } text-yellow-400 py-2 px-4 truncate`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  {winners.length > 0 && (
                    <ul className="w-2/3 text-center divide-y divide-gray-600">
                      {winners.map((winner, i) => (
                        <li
                          key={i}
                          className={`${
                            i % 2 === 0 && 'bg-gray-800'
                          } text-blue-400 py-2 px-4 truncate`}
                        >
                          @{winner}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 my-8">no items</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
