export default (asyncFn) => {
    return (req, res, next) => {
      asyncFn(req, res, next).catch(next);
    };
  };