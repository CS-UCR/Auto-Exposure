import nc from "next-connect";
import { all } from "@/middlewares/index";
import multer from "multer";
import { getPosts, insertPost } from "@/db/index";
import { ReplSet } from "mongodb";
import { v2 as cloudinary } from "cloudinary";

const upload = multer({ dest: "/tmp" });
const handler = nc();

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

handler.use(all);

const maxAge = 1 * 24 * 60 * 60;

handler.get(async (req, res) => {
  const posts = await getPosts(
    req.db,
    req.query.from ? new Date(req.query.from) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  if (req.query.from && posts.length > 0) {
    // This is safe to cache because from defines
    //  a concrete range of posts
    res.setHeader("cache-control", `public, max-age=${maxAge}`);
  }
  res.send({ posts });
});

handler.post( async (req, res) => {
  if (!req.body.content)
    return res.status(400).send("You must write something");
  const post = await insertPost(req.db, {
    content: req.body.content,
    creatorId: req.user._id,
    imageUrl: req.body.imageUrl,
  });

  return res.json({ post });
});

export default handler;
