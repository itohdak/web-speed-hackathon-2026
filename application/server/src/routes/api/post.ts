import { Router } from "express";
import httpErrors from "http-errors";

import { Comment, Post } from "@web-speed-hackathon-2026/server/src/models";
import { serializePost, serializePosts } from "@web-speed-hackathon-2026/server/src/utils/serialize_post";

export const postRouter = Router();

postRouter.get("/posts", async (req, res) => {
  const posts = await Post.findAll({
    limit: req.query["limit"] != null ? Number(req.query["limit"]) : undefined,
    offset: req.query["offset"] != null ? Number(req.query["offset"]) : undefined,
  });

  return res.status(200).type("application/json").send(serializePosts(posts));
});

postRouter.get("/posts/:postId", async (req, res) => {
  const post = await Post.findByPk(req.params.postId);

  if (post === null) {
    throw new httpErrors.NotFound();
  }

  return res.status(200).type("application/json").send(serializePost(post));
});

postRouter.get("/posts/:postId/comments", async (req, res) => {
  const posts = await Comment.findAll({
    limit: req.query["limit"] != null ? Number(req.query["limit"]) : undefined,
    offset: req.query["offset"] != null ? Number(req.query["offset"]) : undefined,
    where: {
      postId: req.params.postId,
    },
  });

  return res.status(200).type("application/json").send(posts);
});

postRouter.post("/posts", async (req, res) => {
  const startedAt = Date.now();

  if (req.session.userId === undefined) {
    console.warn("[api/posts] unauthorized");
    throw new httpErrors.Unauthorized();
  }

  console.info("[api/posts] start", {
    imageCount: Array.isArray(req.body?.images) ? req.body.images.length : 0,
    movieId: req.body?.movie?.id,
    soundId: req.body?.sound?.id,
    textLength: typeof req.body?.text === "string" ? req.body.text.length : 0,
    userId: req.session.userId,
  });

  const post = await Post.create(
    {
      ...req.body,
      userId: req.session.userId,
    },
    {
      include: [
        {
          association: "images",
          through: { attributes: [] },
        },
        { association: "movie" },
        { association: "sound" },
      ],
    },
  );

  console.info("[api/posts] success", {
    elapsedMs: Date.now() - startedAt,
    imageCount: post.images?.length ?? 0,
    postId: post.id,
    userId: req.session.userId,
  });

  return res.status(200).type("application/json").send(serializePost(post));
});
