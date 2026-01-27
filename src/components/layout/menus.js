const menus = () => {
  return [
    {
      text: "Math Editor",
      link: "mathEditor",
      children: null,
    },
  ];
};

const settings = [
  {
    text: "Reset Password",
    link: "reset_pwd",
  },
  {
    text: "Logout",
    link: "sign_in",
  },
];

export { menus, settings };
