export const publicIdSchema = {
  safeParse: (data = {}) =>
    data.publicId
      ? { success: true, data }
      : {
          success: false,
          error: {
            flatten: () => ({
              fieldErrors: { publicId: ["Public ID is required"] },
            }),
          },
        },
};
