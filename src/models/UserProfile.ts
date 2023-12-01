import { z } from "zod";

const image = z
  .instanceof(FileList)
  .optional()
  .refine(
    (image) => {
      if (!image?.[0]) return true;
      if (!image?.[0].type.startsWith("image")) return false;
      //avoid gifs and animations
      if (image?.[0].type.endsWith("gif") || image?.[0].type.endsWith("webp"))
        return false;
      return true;
    },
    { message: "Only Images are allowed." }
  );

export const userProfileSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((name) => {
      if (!name) return true;
      if (name.length < 2 || name.length > 10) return false;
      return true;
    }),
  // .min(2, "Must contain 2-10 chracters")
  // .max(10, "Must contain 2-10 chracters"),
  image,
});

export type UserProfileForm = z.infer<typeof userProfileSchema>;
