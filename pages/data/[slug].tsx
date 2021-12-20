import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import ModalRenameFile from '../../components/ModalRenameFile';
import ModalDeleteFile from '../../components/ModalDeleteFile';
import ModalRenameTitle from '../../components/ModalRenameTitle';

export default function Data() {
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

  async function handleRemoveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = event.currentTarget.rmItem.value;
    const rmItem = value.trim();
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
    event.currentTarget.rmItem.value = '';
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

  async function handleRemoveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = event.currentTarget.rmUser.value;
    const rmUser = value.trim();
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
    event.currentTarget.rmUser.value = '';
  }

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
            Enter the item to add:
          </label>
          <input
            type="text"
            id="newItem"
            name="newItem"
            placeholder="Item name"
            className="appearance-none bg-gray-200 text-gray-700 text-sm border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-1"
          />
          <button className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300">
            Add
          </button>
        </form>

        <form onSubmit={handleRemoveItem}>
          <label htmlFor="rmItem" className="block text-sm mb-2">
            Enter the item to remove:
          </label>
          <input
            type="text"
            id="rmItem"
            name="rmItem"
            placeholder="Item name"
            className="appearance-none bg-gray-200 text-gray-700 text-sm border border-red-600 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-red-500 mr-1"
          />
          <button className="rounded px-2 py-1 bg-red-600 hover:bg-red-700 text-sm text-gray-200">
            Remove
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="">
          {data.items.length > 0 ? (
            <div className="space-x-2">
              {data.items.map((item: string, i: number) => (
                <span
                  key={i}
                  className="text-gray-300 font-bold inline-block border border-gray-500 rounded px-2"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <span className="italic text-gray-500">no items</span>
          )}
        </div>
      </div>

      <div>
        <div className="flex space-x-4 mb-2">
          <form onSubmit={handleAddUser}>
            <label htmlFor="newUser" className="block text-sm mb-2">
              Enter the user to add:
            </label>
            <input
              type="text"
              id="newUser"
              name="newUser"
              placeholder="Username"
              className="appearance-none bg-gray-200 text-gray-700 text-sm border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mr-1"
            />
            <button className="rounded px-2 py-1 bg-gray-700 hover:bg-gray-600 text-sm text-gray-300">
              Add
            </button>
          </form>

          <form onSubmit={handleRemoveUser}>
            <label htmlFor="rmUser" className="block text-sm mb-2">
              Enter the user to remove:
            </label>
            <input
              type="text"
              id="rmUser"
              name="rmUser"
              placeholder="Username"
              className="appearance-none bg-gray-200 text-gray-700 text-sm border border-red-600 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white focus:border-red-500 mr-1"
            />
            <button className="rounded px-2 py-1 bg-red-600 hover:bg-red-700 text-sm text-gray-200">
              Remove
            </button>
          </form>
        </div>

        {data.users.length > 0 ? (
          <table className="border-collapse table-fixed w-full">
            <thead>
              <tr>
                <th className="w-1/5 px-3 py-1">Num</th>
                <th className="w-4/5 px-3 py-1">Users</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user: string, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-500 text-center px-3 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-500 text-center text-gray-300 px-3 py-1">
                    {user}
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
