export const userIdSchema = {
  safeParse: (data = {}) =>
    data.userId
      ? { success: true, data }
      : {
          success: false,
          error: {
            flatten: () => ({
              fieldErrors: { userId: ["User ID is required"] },
            }),
          },
        },
};
