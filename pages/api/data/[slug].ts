import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getFileSlugs,
  getData,
  renameFile,
  addData,
  deleteData,
} from '../../../utils/api';

export default function dataHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { slug },
    body: { newFileName, title, items, users },
  } = req;

  switch (method) {
    case 'GET':
      const data = getData(String(slug));
      res.status(200).json(data);
      break;
    case 'PUT':
      const slugs = getFileSlugs();
      if (slugs.includes(newFileName)) {
        return res
          .status(400)
          .json({ error: `File ${newFileName} Already Exists` });
      }
      renameFile(String(slug), newFileName);
      res.status(200).json({ newFileName });
      break;
    case 'PATCH':
      addData(String(slug), { title, items, users });
      res.status(200).end();
      break;
    case 'DELETE':
      deleteData(String(slug));
      res.status(200).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
