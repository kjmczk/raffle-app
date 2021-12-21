import { useEffect, useState } from 'react';

import { PAGE_SIZE } from '../utils/constants';
import { paginate } from '../utils/paginate';

type Props = {
  items: string[];
  winners: string[];
  index: number;
};

export default function PaginatedWinners({ items, winners, index }: Props) {
  const [currentItems, setCurrentItems] = useState<string[]>([]);
  const [currentWinners, setCurrentWinners] = useState<string[]>([]);

  useEffect(() => {
    setCurrentItems(paginate(items, PAGE_SIZE, index));
    setCurrentWinners(paginate(winners, PAGE_SIZE, index));
  }, [index, items, winners]);

  return (
    <div className="border border-gray-600 flex justify-around items-center max-w-lg mx-auto">
      <ul
        className={`${
          winners.length > 0 ? 'w-1/3' : 'w-full'
        } divide-y divide-gray-600`}
      >
        {currentItems.map((item: string, i: number) => (
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
          {currentWinners.map((winner, i) => (
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
  );
}
