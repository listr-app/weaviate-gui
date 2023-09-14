const routes = {
  home: "/",
  listings: {
    new: {
      index: "/listings/new",
      single: "/listings/new/single",
      multiple: "/listings/new/multiple",
    },
    drafts: "/listings/drafts",
    published: "/listings/published",
    edit: (id: string) => `/listings/edit/${id}`,
  },
  settings: "/settings",
} as const;

export default routes;
