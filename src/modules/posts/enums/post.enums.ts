import { PostStatus } from "../../../generated/prisma/enums.js";

export { PostStatus };

export const POST_STATUSES = Object.values(PostStatus) as [
  PostStatus,
  ...PostStatus[],
];
