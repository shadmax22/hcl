const errorMessage = (error, thunkAPI) => {
  const message =
    (error.response && error.response.data && error.response.data.msg) ||
    error.message ||
    error.toString();
  alert(message);
  return { errorStatusCode: error.response.status, message };
};

export default errorMessage;
