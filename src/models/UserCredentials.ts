import { z } from "zod";

export type UserCredentials = { email: string; password: string };

export const emailSchema = z
  .string({ required_error: "Email Is Required." })
  .email({ message: "Invalid Email." });

export const passwordSchema = z
  .string()
  .min(6, "Password must contain 6-10 Chars")
  .max(10, "Password must contain 6-10 Chars");

export const credentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  validatePassword: z.string().optional(),
});

export const credentialsRegisterSchema = credentialsSchema.refine(
  ({ password, validatePassword }) => {
    if (password !== validatePassword) return false;
    return true;
  },
  { path: ["validatePassword"], message: "Passwords do Not match." }
);

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string({ required_error: "Old password is required." }),
    newPassword: passwordSchema,
    validatePassword: z.string().optional(),
  })
  .refine(
    ({ newPassword, validatePassword }) => {
      if (newPassword !== validatePassword) return false;
      return true;
    },
    { path: ["validatePassword"], message: "Passwords do Not match." }
  );

export type CredentialsSchemaType = z.infer<typeof credentialsSchema>;

export type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
};
