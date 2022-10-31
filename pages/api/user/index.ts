import { getDatabaseUser } from '@/lib-api/db/getUser';
import { all } from 'lib-api/middlewares';
import nc from 'next-connect';
const handler = nc().use(all);
handler.get(async (req:any, res:any) => {
    // Filter out password
    const user = getDatabaseUser({
      email: req.user.email,
    })
    if (!req.user) return res.json({ user: null });
    const userSession = req.user;
    return res.json({ user: userSession });
  });

  export default handler;