import type { NextApiRequest, NextApiResponse } from 'next';
import { getFileSlugs, addData } from '../../../utils/api';

export default function allDataHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { fileName, title, items, users },
  } = req;

  const slugs = getFileSlugs();

  switch (method) {
    case 'GET':
      res.status(200).json(slugs);
      break;
    case 'PUT':
      if (slugs.includes(fileName)) {
        return res
          .status(400)
          .json({ error: `File ${fileName} Already Exists` });
      }
      addData(fileName, { title, items, users });
      res.status(200).json({ fileName });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
