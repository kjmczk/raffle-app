import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { FaTimesCircle, FaAngleDown, FaAngleUp } from 'react-icons/fa';

import ModalRenameFile from '../../components/ModalRenameFile';
import ModalDeleteFile from '../../components/ModalDeleteFile';
import ModalRenameTitle from '../../components/ModalRenameTitle';

export default function Data() {
  const [users, setUsers] = useState<string[]>([]);
  const [sortedUsers, setSortedUsers] = useState<string[] | null>(null);

  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, error } = useSWR(
    router.query.slug ? `/api/data/${router.query.slug}` : null
  );

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = event.currentTarget.newItem.value;
    const newItem = value.trim();
    mutate(`/api/data/${router.query.slug}`, async () => {
      await fetch(`/api/data/${router.query.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          items: Array.from(new Set([...data.items, newItem])),
          users: data.users,
        }),
      });
    });
    event.currentTarget.newItem.value = '';
  }

  async function handleRemoveItem(rmItem: string) {
    mutate(`/api/data/${router.query.slug}`, async () => {
      await fetch(`/api/data/${router.query.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          items: data.items.filter((item: string) => item !== rmItem),
          users: data.users,
        }),
      });
    });
  }

  async function handleAddUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = event.currentTarget.newUser.value;
    const newUser = value.trim();
    mutate(`/api/data/${router.query.slug}`, async () => {
      await fetch(`/api/data/${router.query.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          items: data.items,
          users: Array.from(new Set([...data.users, newUser])),
        }),
      });
    });
    event.currentTarget.newUser.value = '';
  }

  async function handleRemoveUser(rmUser: string) {
    mutate(`/api/data/${router.query.slug}`, async () => {
      await fetch(`/api/data/${router.query.slug}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          items: data.items,
          users: data.users.filter((user: string) => user !== rmUser),
        }),
      });
    });
  }

  function sortUsers() {
    setSortedUsers(users.sort());
  }

  function reverseUsers() {
    setSortedUsers(users.sort().reverse());
  }

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    }
  }, [data]);

  useEffect(() => {
    if (sortedUsers) {
      setUsers(sortedUsers);
      setSortedUsers(null);
    }
  }, [sortedUsers]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center pt-8 pb-4 border-b border-gray-500 mb-4">
        <h1 className="text-2xl text-gray-300">
          {router.query.slug ? router.query.slug : 'no file'}
        </h1>
        <div className="space-x-4">
          <span>
            <Link href="/data">
              <a className="text-blue-400 hover:text-blue-500">Data List</a>
            </Link>
          </span>
          <span>
            <Link href="/">
              <a className="text-blue-400 hover:text-blue-500">Raffle</a>
            </Link>
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <ModalRenameFile />
        <ModalDeleteFile />
      </div>

      <div className="mb-6">
        <p className="text-sm mb-1">Event Title:</p>
        <div className="flex items-center">
          <span className="text-xl text-gray-300 font-bold mr-4">
            {data.title}
          </span>
          <ModalRenameTitle />
        </div>
      </div>

      <div className="flex space-x-4 mb-2">
        <form onSubmit={handleAddItem}>
          <label htmlFor="newItem" className="block text-sm mb-2">
            New Item:
          </label>
          <input
            type="text"
            id="newItem"
            name="newItem"
            placeholder="Item name"
            required
            className="appearance-none bg-gray-200 text-gray-700 text-sm border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-1"
          />
          <button className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300">
            Add
          </button>
        </form>
      </div>

      <div className="mb-6">
        <>
          {data.items.length > 0 ? (
            <>
              {data.items.map((item: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center border border-gray-500 rounded px-2 m-1"
                >
                  <span className="text-gray-300 font-bold mr-2">{item}</span>
                  <button onClick={() => handleRemoveItem(item)}>
                    <FaTimesCircle />
                  </button>
                </span>
              ))}
            </>
          ) : (
            <span className="italic text-gray-500">no items</span>
          )}
        </>
      </div>

      <div>
        <div className="flex justify-between items-end space-x-4 mb-2">
          <form onSubmit={handleAddUser}>
            <label htmlFor="newUser" className="block text-sm mb-2">
              New User:
            </label>
            <input
              type="text"
              id="newUser"
              name="newUser"
              placeholder="Username"
              required
              className="appearance-none bg-gray-200 text-gray-700 text-sm border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-1"
            />
            <button className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300">
              Add
            </button>
          </form>

          <div className="space-x-2">
            <button
              onClick={sortUsers}
              className="inline-flex items-center space-x-1 hover:text-gray-300"
            >
              <span>Sort</span>
              <span>
                <FaAngleDown />
              </span>
            </button>
            <span className="text-gray-500">|</span>
            <button
              onClick={reverseUsers}
              className="inline-flex items-center space-x-1 hover:text-gray-300"
            >
              <span>Reverse</span>
              <span>
                <FaAngleUp />
              </span>
            </button>
          </div>
        </div>

        {users.length > 0 ? (
          <table className="border-collapse table-fixed w-full">
            <thead>
              <tr>
                <th className="w-2/12 px-3 py-1">Num</th>
                <th className="w-9/12 px-3 py-1">Users</th>
                <th className="w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: string, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-500 text-center px-3 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 text-center text-gray-300 px-3 py-1">
                    {user}
                  </td>
                  <td className="">
                    <span className="flex justify-center">
                      <button onClick={() => handleRemoveUser(user)}>
                        <FaTimesCircle />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="italic text-gray-500">no entries</div>
        )}
      </div>
    </div>
  );
}
