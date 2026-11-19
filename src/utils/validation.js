const validateData = (user) => {
  const editAllowedFields = [
    "firstName",
    "lastName",
    "email",
    "gender",
    "age",
    "about",
    "photoUrl",
    "skills",
  ];
  const isEditAllowed = Object.keys(user).every((field) =>
    editAllowedFields.includes(field),
  );
  return isEditAllowed;
};
module.exports = validateData;
