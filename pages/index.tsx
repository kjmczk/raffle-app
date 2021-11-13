import type { NextPage } from 'next';
import { useState } from 'react';

const PROJECT_NAME = 'Skulls In Love';

const GIVEAWAY_1 = '#3';
const GROUP_1 = ['taro', 'hanako', 'ichiro', 'yuria'];

const GIVEAWAY_2 = '#9';
const GROUP_2 = ['john', 'jane', 'bob', 'mary'];

const Home: NextPage = () => {
  const [winner1, setWinner1] = useState('');
  const [winner2, setWinner2] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  function raffle() {
    setIsDrawing(true);
    const handle1 = Math.floor(Math.random() * GROUP_1.length);
    const handle2 = Math.floor(Math.random() * GROUP_2.length);
    window.setTimeout(() => {
      setWinner1(`@${GROUP_1[handle1]}`);
      setWinner2(`@${GROUP_2[handle2]}`);
      setIsDrawing(false);
      setIsFinished(true);
    }, 3 * 1000);
  }

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex flex-col justify-center h-screen">
        <h1 className="text-center text-4xl font-bold mb-8">
          {PROJECT_NAME} Raffle
        </h1>

        <div className="mb-4">
          <h2 className="text-center text-xl mb-2">
            The winner of{' '}
            <span className="text-yellow-400">
              {PROJECT_NAME} {GIVEAWAY_1}
            </span>
          </h2>
          <div className="border border-blue-400 p-4 h-16 flex justify-center items-center max-w-xs mx-auto">
            <span className="text-blue-400 font-bold">{winner1}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-center text-xl mb-2">
            The winner of{' '}
            <span className="text-pink-400">
              {PROJECT_NAME} {GIVEAWAY_2}
            </span>
          </h2>
          <div className="border border-blue-400 p-4 h-16 flex justify-center items-center max-w-xs mx-auto">
            <span className="text-blue-400 font-bold">{winner2}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={raffle}
            disabled={isDrawing || isFinished ? true : false}
            className={`flex justify-center items-center rounded px-4 py-2 w-40 ${
              !isDrawing && !isFinished && 'bg-green-600 hover:bg-green-700'
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
    </div>
  );
};

export default Home;
