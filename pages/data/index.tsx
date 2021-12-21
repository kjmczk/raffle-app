import Link from 'next/link';
import useSWR from 'swr';

import ModalNew from '../../components/ModalNew';

export default function AllData() {
  const { data, error } = useSWR('/api/data');

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center pt-8 pb-4 border-b border-gray-500 mb-4">
        <h1 className="text-2xl">Data List</h1>
        <Link href="/">
          <a className="text-blue-400 hover:text-blue-500">Raffle</a>
        </Link>
      </div>

      <div className="text-center">
        <ModalNew />

        <ul className="space-y-2 my-4">
          {data.map((data: string, index: number) => (
            <li key={index}>
              <Link href={`/data/${data}`}>
                <a className="underline text-gray-300">{data}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
